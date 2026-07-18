const TOKEN_URL = "https://accounts.spotify.com/api/token";
const API = "https://api.spotify.com/v1";

export type SpotifyTrack = {
  id: string;
  name: string;
  artists: { id: string; name: string }[];
  album: { images: { url: string; height: number | null }[] };
  external_ids?: { isrc?: string };
  external_urls: { spotify: string };
};

async function getAccessToken(): Promise<string> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!clientId || !clientSecret) {
    throw new Error("Missing SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET");
  }

  if (refreshToken) {
    const body = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    });
    const res = await fetch(TOKEN_URL, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });
    if (!res.ok) {
      throw new Error(`Spotify refresh failed: ${res.status} ${await res.text()}`);
    }
    const data = (await res.json()) as { access_token: string };
    return data.access_token;
  }

  const body = new URLSearchParams({ grant_type: "client_credentials" });
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  if (!res.ok) {
    throw new Error(`Spotify client credentials failed: ${res.status}`);
  }
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

export async function spotifyFetch<T>(
  path: string,
  init?: RequestInit & { token?: string },
): Promise<T> {
  const token = init?.token ?? (await getAccessToken());
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    throw new Error(`Spotify ${path}: ${res.status} ${await res.text()}`);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export async function searchTrack(
  title: string,
  artist: string,
): Promise<SpotifyTrack | null> {
  const q = encodeURIComponent(`track:${title} artist:${artist}`);
  const data = await spotifyFetch<{ tracks: { items: SpotifyTrack[] } }>(
    `/search?q=${q}&type=track&limit=5`,
  );
  return data.tracks.items[0] ?? null;
}

export async function getArtistTopTracks(
  artistId: string,
): Promise<SpotifyTrack[]> {
  const data = await spotifyFetch<{ tracks: SpotifyTrack[] }>(
    `/artists/${artistId}/top-tracks?market=US`,
  );
  return data.tracks ?? [];
}

export async function getAlbumTracks(
  albumId: string,
): Promise<{ id: string; name: string; artists: { id: string; name: string }[] }[]> {
  const data = await spotifyFetch<{
    items: { id: string; name: string; artists: { id: string; name: string }[] }[];
  }>(`/albums/${albumId}/tracks?limit=20`);
  return data.items ?? [];
}

export async function getTrack(id: string): Promise<SpotifyTrack> {
  return spotifyFetch<SpotifyTrack>(`/tracks/${id}`);
}

export async function searchByMoodTags(
  tags: string[],
  limit = 10,
): Promise<SpotifyTrack[]> {
  const q = encodeURIComponent(tags.slice(0, 3).join(" "));
  const data = await spotifyFetch<{ tracks: { items: SpotifyTrack[] } }>(
    `/search?q=${q}&type=track&limit=${limit}`,
  );
  return data.tracks.items ?? [];
}

export async function createPlaylist(
  userId: string,
  name: string,
  description: string,
): Promise<{ id: string; external_urls: { spotify: string } }> {
  return spotifyFetch(`/users/${userId}/playlists`, {
    method: "POST",
    body: JSON.stringify({
      name,
      description,
      public: true,
    }),
  });
}

export async function addTracksToPlaylist(
  playlistId: string,
  uris: string[],
): Promise<void> {
  for (let i = 0; i < uris.length; i += 100) {
    const chunk = uris.slice(i, i + 100);
    await spotifyFetch(`/playlists/${playlistId}/tracks`, {
      method: "POST",
      body: JSON.stringify({ uris: chunk }),
    });
  }
}

export async function getCurrentUserId(): Promise<string> {
  const me = await spotifyFetch<{ id: string }>("/me");
  return me.id;
}

export function bestImage(
  images: { url: string; height: number | null }[] | undefined,
): string | undefined {
  if (!images?.length) return undefined;
  return [...images].sort((a, b) => (b.height ?? 0) - (a.height ?? 0))[0]?.url;
}
