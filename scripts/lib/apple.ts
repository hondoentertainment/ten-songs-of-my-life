import { createPrivateKey } from "crypto";
import { SignJWT, importPKCS8 } from "jose";

const API = "https://api.music.apple.com/v1";

export type AppleSong = {
  id: string;
  attributes: {
    name: string;
    artistName: string;
    isrc?: string;
    url?: string;
    artwork?: { url: string; width: number; height: number };
  };
};

function normalizePrivateKey(raw: string): string {
  if (raw.includes("BEGIN PRIVATE KEY")) {
    return raw.replace(/\\n/g, "\n");
  }
  return raw;
}

export async function createAppleDeveloperToken(): Promise<string> {
  const teamId = process.env.APPLE_MUSIC_TEAM_ID;
  const keyId = process.env.APPLE_MUSIC_KEY_ID;
  const privateKey = process.env.APPLE_MUSIC_PRIVATE_KEY;

  if (!teamId || !keyId || !privateKey) {
    throw new Error(
      "Missing APPLE_MUSIC_TEAM_ID / APPLE_MUSIC_KEY_ID / APPLE_MUSIC_PRIVATE_KEY",
    );
  }

  const pem = normalizePrivateKey(privateKey);
  const key = await importPKCS8(pem, "ES256");

  return new SignJWT({})
    .setProtectedHeader({ alg: "ES256", kid: keyId })
    .setIssuer(teamId)
    .setIssuedAt()
    .setExpirationTime("180d")
    .sign(key);
}

export async function appleFetch<T>(
  path: string,
  init?: RequestInit & { userToken?: string },
): Promise<T> {
  const token = await createAppleDeveloperToken();
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    ...(init?.headers as Record<string, string> | undefined),
  };
  if (init?.userToken) {
    headers["Music-User-Token"] = init.userToken;
  }

  const res = await fetch(`${API}${path}`, { ...init, headers });
  if (!res.ok) {
    throw new Error(`Apple Music ${path}: ${res.status} ${await res.text()}`);
  }
  return (await res.json()) as T;
}

export async function searchAppleSong(
  title: string,
  artist: string,
  isrc?: string,
): Promise<AppleSong | null> {
  if (isrc) {
    try {
      const byIsrc = await appleFetch<{ data: AppleSong[] }>(
        `/catalog/us/songs?filter[isrc]=${encodeURIComponent(isrc)}`,
      );
      if (byIsrc.data?.[0]) return byIsrc.data[0];
    } catch {
      // fall through to text search
    }
  }

  const term = encodeURIComponent(`${title} ${artist}`);
  const data = await appleFetch<{
    results: { songs?: { data: AppleSong[] } };
  }>(`/catalog/us/search?types=songs&limit=5&term=${term}`);

  return data.results.songs?.data?.[0] ?? null;
}

export function appleArtworkUrl(
  template: string | undefined,
  size = 640,
): string | undefined {
  if (!template) return undefined;
  return template.replace("{w}", String(size)).replace("{h}", String(size));
}

export async function createAppleLibraryPlaylist(
  name: string,
  description: string,
  songIds: string[],
): Promise<{ id: string } | null> {
  const userToken = process.env.APPLE_MUSIC_USER_TOKEN;
  if (!userToken) {
    console.warn("No APPLE_MUSIC_USER_TOKEN — skipping Apple playlist create");
    return null;
  }

  const body = {
    attributes: {
      name,
      description,
      isPublic: true,
    },
    relationships: {
      tracks: {
        data: songIds.map((id) => ({ id, type: "songs" })),
      },
    },
  };

  const res = await appleFetch<{ data: { id: string }[] }>(
    `/me/library/playlists`,
    {
      method: "POST",
      userToken,
      body: JSON.stringify(body),
    },
  );

  return res.data?.[0] ?? null;
}

/** Validate key parses — helpful for setup debugging. */
export function assertAppleKeyParses(): void {
  const privateKey = process.env.APPLE_MUSIC_PRIVATE_KEY;
  if (!privateKey) return;
  createPrivateKey(normalizePrivateKey(privateKey));
}
