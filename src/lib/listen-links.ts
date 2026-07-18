import type { TrackPin } from "@/data/chapters";

export function spotifyTrackUrl(pin: TrackPin): string {
  if (pin.spotifyUrl) return pin.spotifyUrl;
  if (pin.spotifyId) return `https://open.spotify.com/track/${pin.spotifyId}`;
  const q = encodeURIComponent(`${pin.title} ${pin.artist}`);
  return `https://open.spotify.com/search/${q}`;
}

export function appleMusicTrackUrl(pin: TrackPin): string {
  if (pin.appleMusicUrl) return pin.appleMusicUrl;
  if (pin.appleId) return `https://music.apple.com/song/${pin.appleId}`;
  const q = encodeURIComponent(`${pin.title} ${pin.artist}`);
  return `https://music.apple.com/search?term=${q}`;
}

export function spotifyBoardUrl(playlistUrl?: string, seed?: TrackPin): string {
  if (playlistUrl) return playlistUrl;
  if (seed) return spotifyTrackUrl(seed);
  return "https://open.spotify.com";
}

export function appleBoardUrl(playlistUrl?: string, seed?: TrackPin): string {
  if (playlistUrl) return playlistUrl;
  if (seed) return appleMusicTrackUrl(seed);
  return "https://music.apple.com";
}
