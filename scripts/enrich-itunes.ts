/**
 * Enrich chapter tracks via iTunes Search API (no API key).
 * Merges into existing src/data/media-cache.json (skips hits that already exist unless --force).
 *
 *   npm run enrich:itunes
 *   npm run enrich:itunes -- --force
 */

import { existsSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { chapters } from "../src/data/chapters";
import { lookupTrack, mediaKey, type MediaHit } from "../src/lib/itunes";

async function sleep(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

async function lookupWithRetry(
  title: string,
  artist: string,
  attempts = 4,
): Promise<MediaHit | null> {
  for (let i = 0; i < attempts; i++) {
    try {
      return await lookupTrack(title, artist);
    } catch (err) {
      const msg = (err as Error).message ?? "";
      if (msg.includes("429") && i < attempts - 1) {
        const wait = 1500 * (i + 1);
        console.warn(`  rate limited — waiting ${wait}ms`);
        await sleep(wait);
        continue;
      }
      throw err;
    }
  }
  return null;
}

async function main() {
  const force = process.argv.includes("--force");
  const out = resolve(process.cwd(), "src/data/media-cache.json");
  const cache: Record<string, MediaHit> = existsSync(out)
    ? (JSON.parse(readFileSync(out, "utf8")) as Record<string, MediaHit>)
    : {};

  const tracks = new Map<string, { title: string; artist: string }>();
  for (const chapter of chapters) {
    for (const pin of [chapter.seed, ...chapter.pins]) {
      tracks.set(mediaKey(pin.title, pin.artist), {
        title: pin.title,
        artist: pin.artist,
      });
    }
  }

  const pending = [...tracks.entries()].filter(
    ([key]) => force || !cache[key]?.imageUrl,
  );

  console.log(
    `Looking up ${pending.length} tracks (${tracks.size - pending.length} cached)…`,
  );

  let i = 0;
  for (const [key, track] of pending) {
    i += 1;
    try {
      const hit = await lookupWithRetry(track.title, track.artist);
      if (hit?.imageUrl) {
        cache[key] = hit;
        console.log(`  [${i}/${pending.length}] ${hit.title} — ${hit.artist}`);
      } else {
        console.warn(`  [${i}/${pending.length}] miss: ${track.title}`);
      }
    } catch (err) {
      console.warn(`  [${i}/${pending.length}] error: ${track.title}`, err);
    }
    await sleep(350);
  }

  writeFileSync(out, JSON.stringify(cache, null, 2));
  console.log(`\nCache size: ${Object.keys(cache).length} → ${out}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
