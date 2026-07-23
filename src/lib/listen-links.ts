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

/** Spotify embed URL for the in-app mini player, or null when the track has no resolved ID. */
export function spotifyEmbedUrl(pin: TrackPin): string | null {
  if (!pin.spotifyId) return null;
  return `https://open.spotify.com/embed/track/${pin.spotifyId}`;
}

/** Apple Music embed URL for the in-app mini player, or null when the track has no resolved ID. */
export function appleEmbedUrl(pin: TrackPin): string | null {
  if (!pin.appleId) return null;
  return `https://embed.music.apple.com/us/song/${pin.appleId}`;
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
