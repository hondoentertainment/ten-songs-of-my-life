import type { MediaHit } from "@/lib/itunes";

const KEY = "tsoml-my-nine-v1";

export type MyNineSlot = MediaHit & {
  stage?: string;
  mood?: string;
};

export type MyNine = {
  updatedAt: string;
  slots: MyNineSlot[];
};

export function getMyNine(): MyNine | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as MyNine) : null;
  } catch {
    return null;
  }
}

export function saveMyNine(slots: MyNineSlot[]): MyNine {
  const payload: MyNine = {
    updatedAt: new Date().toISOString(),
    slots: slots.slice(0, 9),
  };
  window.localStorage.setItem(KEY, JSON.stringify(payload));
  return payload;
}

export function clearMyNine(): void {
  window.localStorage.removeItem(KEY);
}
