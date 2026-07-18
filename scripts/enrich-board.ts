/**
 * Enrich chapter pins with Spotify/Apple IDs, album art, listen URLs,
 * and optionally create backing playlists.
 *
 * Usage:
 *   npm run enrich
 *   npm run enrich -- --create-playlists
 *
 * Requires .env.local with Spotify (and optionally Apple Music) credentials.
 * Writes src/data/chapters.enriched.json (does not overwrite chapters.ts).
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve } from "path";
import {
  addTracksToPlaylist,
  bestImage,
  createPlaylist,
  getArtistTopTracks,
  getCurrentUserId,
  getTrack,
  searchByMoodTags,
  searchTrack,
  type SpotifyTrack,
} from "./lib/spotify";
import {
  appleArtworkUrl,
  createAppleLibraryPlaylist,
  searchAppleSong,
} from "./lib/apple";

type PinHeight = "tall" | "medium" | "short";

type TrackPin = {
  title: string;
  artist: string;
  year?: number;
  spotifyId?: string;
  appleId?: string;
  isrc?: string;
  imageUrl?: string;
  pinHeight?: PinHeight;
  spotifyUrl?: string;
  appleMusicUrl?: string;
};

type Chapter = {
  id: string;
  number: number;
  stage: string;
  mood: string;
  title: string;
  story: string;
  seed: TrackPin;
  pins: TrackPin[];
  moodTags: string[];
  spotifyPlaylistUrl?: string;
  appleMusicPlaylistUrl?: string;
  coverHint?: string;
  accent: string;
};

const heights: PinHeight[] = ["tall", "medium", "short", "medium", "tall"];

function loadEnvLocal() {
  const path = resolve(process.cwd(), ".env.local");
  if (!existsSync(path)) return;
  const text = readFileSync(path, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

function trackKey(title: string, artist: string): string {
  return `${title.toLowerCase()}::${artist.toLowerCase()}`;
}

function fromSpotify(t: SpotifyTrack, index: number): TrackPin {
  return {
    title: t.name,
    artist: t.artists.map((a) => a.name).join(", "),
    spotifyId: t.id,
    isrc: t.external_ids?.isrc,
    imageUrl: bestImage(t.album.images),
    spotifyUrl: t.external_urls.spotify,
    pinHeight: heights[index % heights.length],
  };
}

async function resolvePin(pin: TrackPin, index: number): Promise<TrackPin> {
  let spotify: SpotifyTrack | null = null;

  if (pin.spotifyId) {
    try {
      spotify = await getTrack(pin.spotifyId);
    } catch {
      spotify = null;
    }
  }
  if (!spotify) {
    spotify = await searchTrack(pin.title, pin.artist);
  }

  const next: TrackPin = {
    ...pin,
    pinHeight: pin.pinHeight ?? heights[index % heights.length],
  };

  if (spotify) {
    next.spotifyId = spotify.id;
    next.spotifyUrl = spotify.external_urls.spotify;
    next.isrc = next.isrc ?? spotify.external_ids?.isrc;
    next.imageUrl = bestImage(spotify.album.images) ?? next.imageUrl;
    next.title = spotify.name;
    next.artist = spotify.artists.map((a) => a.name).join(", ");
  }

  try {
    const apple = await searchAppleSong(next.title, next.artist, next.isrc);
    if (apple) {
      next.appleId = apple.id;
      next.appleMusicUrl = apple.attributes.url;
      if (!next.imageUrl || next.imageUrl.startsWith("data:")) {
        next.imageUrl =
          appleArtworkUrl(apple.attributes.artwork?.url) ?? next.imageUrl;
      }
    }
  } catch (err) {
    console.warn(`  Apple lookup skipped for ${next.title}:`, (err as Error).message);
  }

  return next;
}

async function expandChapter(chapter: Chapter): Promise<TrackPin[]> {
  const seen = new Set<string>();
  const collected: SpotifyTrack[] = [];

  const seed =
    (chapter.seed.spotifyId
      ? await getTrack(chapter.seed.spotifyId).catch(() => null)
      : null) ?? (await searchTrack(chapter.seed.title, chapter.seed.artist));

  if (seed) {
    collected.push(seed);
    seen.add(trackKey(seed.name, seed.artists[0]?.name ?? ""));

    const artistId = seed.artists[0]?.id;
    if (artistId) {
      const tops = await getArtistTopTracks(artistId);
      for (const t of tops) {
        const key = trackKey(t.name, t.artists[0]?.name ?? "");
        if (seen.has(key)) continue;
        seen.add(key);
        collected.push(t);
      }
    }
  }

  for (const curated of chapter.pins) {
    const t =
      (curated.spotifyId
        ? await getTrack(curated.spotifyId).catch(() => null)
        : null) ?? (await searchTrack(curated.title, curated.artist));
    if (!t) continue;
    const key = trackKey(t.name, t.artists[0]?.name ?? "");
    if (seen.has(key)) continue;
    seen.add(key);
    collected.push(t);
  }

  const moodHits = await searchByMoodTags(chapter.moodTags, 12);
  for (const t of moodHits) {
    const key = trackKey(t.name, t.artists[0]?.name ?? "");
    if (seen.has(key)) continue;
    seen.add(key);
    collected.push(t);
  }

  return collected.slice(0, 18).map((t, i) => fromSpotify(t, i));
}

async function main() {
  loadEnvLocal();

  const createPlaylists = process.argv.includes("--create-playlists");
  const chaptersPath = resolve(process.cwd(), "src/data/chapters.ts");
  if (!existsSync(chaptersPath)) {
    throw new Error("src/data/chapters.ts not found");
  }

  // Dynamic import of compiled-ish data via eval-free path:
  // read the exported array by importing through tsx.
  const mod = await import("../src/data/chapters");
  const chapters = structuredClone(mod.chapters) as Chapter[];

  let spotifyUserId: string | null = null;
  if (createPlaylists) {
    if (!process.env.SPOTIFY_REFRESH_TOKEN) {
      throw new Error("--create-playlists requires SPOTIFY_REFRESH_TOKEN");
    }
    spotifyUserId = await getCurrentUserId();
  }

  for (const chapter of chapters) {
    console.log(`\nEnriching: ${chapter.stage} (${chapter.id})`);

    const expanded = await expandChapter(chapter);
    const resolvedSeed = await resolvePin(chapter.seed, 0);

    const related = expanded
      .filter((p) => p.spotifyId !== resolvedSeed.spotifyId)
      .slice(0, 16);

    const resolvedPins: TrackPin[] = [];
    for (let i = 0; i < related.length; i++) {
      resolvedPins.push(await resolvePin(related[i], i + 1));
      await new Promise((r) => setTimeout(r, 120));
    }

    chapter.seed = resolvedSeed;
    chapter.pins = resolvedPins;

    if (createPlaylists && spotifyUserId) {
      const uris = [resolvedSeed, ...resolvedPins]
        .map((p) => p.spotifyId)
        .filter(Boolean)
        .map((id) => `spotify:track:${id}`);

      const playlist = await createPlaylist(
        spotifyUserId,
        `10 Songs · ${chapter.stage}`,
        chapter.story.slice(0, 280),
      );
      await addTracksToPlaylist(playlist.id, uris);
      chapter.spotifyPlaylistUrl = playlist.external_urls.spotify;
      console.log(`  Spotify playlist: ${chapter.spotifyPlaylistUrl}`);

      const appleIds = [resolvedSeed, ...resolvedPins]
        .map((p) => p.appleId)
        .filter((id): id is string => Boolean(id));

      if (appleIds.length) {
        const applePl = await createAppleLibraryPlaylist(
          `10 Songs · ${chapter.stage}`,
          chapter.story.slice(0, 280),
          appleIds,
        );
        if (applePl) {
          chapter.appleMusicPlaylistUrl = `https://music.apple.com/library/playlist/${applePl.id}`;
          console.log(`  Apple playlist id: ${applePl.id}`);
        }
      }
    }

    console.log(
      `  Seed: ${chapter.seed.title} · pins: ${chapter.pins.length} · art: ${chapter.seed.imageUrl ? "yes" : "no"}`,
    );
  }

  const outPath = resolve(process.cwd(), "src/data/chapters.enriched.json");
  writeFileSync(outPath, JSON.stringify(chapters, null, 2), "utf8");
  console.log(`\nWrote ${outPath}`);
  console.log(
    "Review the JSON, then copy enriched fields into src/data/chapters.ts (or wire the site to load this file).",
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
