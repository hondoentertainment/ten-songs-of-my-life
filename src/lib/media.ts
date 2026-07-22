import type { TrackPin } from "@/data/chapters";
import { mediaKey, type MediaHit } from "@/lib/itunes";
import cache from "@/data/media-cache.json";

const mediaCache = cache as Record<string, MediaHit>;

export function getMedia(pin: TrackPin): MediaHit {
  const hit = mediaCache[mediaKey(pin.title, pin.artist)];
  return {
    title: hit?.title ?? pin.title,
    artist: hit?.artist ?? pin.artist,
    imageUrl: hit?.imageUrl ?? pin.imageUrl,
    previewUrl: hit?.previewUrl ?? pin.previewUrl,
    appleMusicUrl: hit?.appleMusicUrl ?? pin.appleMusicUrl,
    appleId: hit?.appleId ?? pin.appleId,
    year: hit?.year ?? pin.year,
  };
}

export function withMedia(pin: TrackPin): TrackPin {
  const hit = getMedia(pin);
  return {
    ...pin,
    title: hit.title,
    artist: hit.artist,
    imageUrl: hit.imageUrl ?? pin.imageUrl,
    previewUrl: hit.previewUrl,
    appleMusicUrl: hit.appleMusicUrl ?? pin.appleMusicUrl,
    appleId: hit.appleId ?? pin.appleId,
    year: hit.year ?? pin.year,
    spotifyUrl:
      pin.spotifyUrl ??
      `https://open.spotify.com/search/${encodeURIComponent(`${hit.title} ${hit.artist}`)}`,
  };
}
