export type ItunesSong = {
  trackId: number;
  trackName: string;
  artistName: string;
  collectionName?: string;
  previewUrl?: string;
  artworkUrl100?: string;
  trackViewUrl?: string;
  releaseDate?: string;
};

export type MediaHit = {
  title: string;
  artist: string;
  imageUrl?: string;
  previewUrl?: string;
  appleMusicUrl?: string;
  appleId?: string;
  year?: number;
};

function artworkLarge(url?: string, size = 600): string | undefined {
  if (!url) return undefined;
  return url.replace("100x100bb", `${size}x${size}bb`);
}

export function mediaKey(title: string, artist: string): string {
  return `${title.trim().toLowerCase()}::${artist.trim().toLowerCase()}`;
}

export async function searchItunesSongs(
  term: string,
  limit = 8,
): Promise<ItunesSong[]> {
  const url = new URL("https://itunes.apple.com/search");
  url.searchParams.set("term", term);
  url.searchParams.set("entity", "song");
  url.searchParams.set("limit", String(limit));

  const res = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`iTunes search failed: ${res.status}`);
  const data = (await res.json()) as { results?: ItunesSong[] };
  return data.results ?? [];
}

function scoreMatch(song: ItunesSong, title: string, artist: string): number {
  const t = title.toLowerCase();
  const a = artist.toLowerCase().split(/[,&/]/)[0]?.trim() ?? "";
  const st = song.trackName.toLowerCase();
  const sa = song.artistName.toLowerCase();
  let score = 0;
  if (st === t) score += 4;
  else if (st.includes(t) || t.includes(st.split("(")[0]?.trim() ?? "")) score += 2;
  if (sa.includes(a)) score += 4;
  else if (a && sa.split(/\s+/).some((w) => a.includes(w) && w.length > 2)) score += 1;
  return score;
}

export async function lookupTrack(
  title: string,
  artist: string,
): Promise<MediaHit | null> {
  const results = await searchItunesSongs(`${title} ${artist}`, 8);
  if (!results.length) return null;

  const ranked = [...results].sort(
    (x, y) => scoreMatch(y, title, artist) - scoreMatch(x, title, artist),
  );
  const best = ranked[0];
  if (!best || scoreMatch(best, title, artist) < 2) {
    // still return best effort if anything exists
  }
  const hit = best;
  if (!hit) return null;

  return {
    title: hit.trackName,
    artist: hit.artistName,
    imageUrl: artworkLarge(hit.artworkUrl100),
    previewUrl: hit.previewUrl,
    appleMusicUrl: hit.trackViewUrl,
    appleId: String(hit.trackId),
    year: hit.releaseDate
      ? new Date(hit.releaseDate).getFullYear()
      : undefined,
  };
}

export function toMediaHit(song: ItunesSong): MediaHit {
  return {
    title: song.trackName,
    artist: song.artistName,
    imageUrl: artworkLarge(song.artworkUrl100),
    previewUrl: song.previewUrl,
    appleMusicUrl: song.trackViewUrl,
    appleId: String(song.trackId),
    year: song.releaseDate
      ? new Date(song.releaseDate).getFullYear()
      : undefined,
  };
}
