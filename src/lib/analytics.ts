export type AnalyticsEvent =
  | "play_preview"
  | "play_spotify"
  | "play_apple"
  | "open_chapter"
  | "favorite_toggle"
  | "share"
  | "create_save"
  | "category_lock";

type StoredEvent = {
  name: AnalyticsEvent;
  props?: Record<string, string | number | boolean | null | undefined>;
  at: string;
};

const KEY = "tsoml-analytics-v1";
const MAX = 400;

export function track(
  name: AnalyticsEvent,
  props?: StoredEvent["props"],
): void {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(KEY);
    const list: StoredEvent[] = raw ? (JSON.parse(raw) as StoredEvent[]) : [];
    list.push({ name, props, at: new Date().toISOString() });
    window.localStorage.setItem(KEY, JSON.stringify(list.slice(-MAX)));
  } catch {
    // ignore quota / private mode
  }
}

export function getAnalyticsEvents(): StoredEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as StoredEvent[]) : [];
  } catch {
    return [];
  }
}

export function summarizeAnalytics(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const e of getAnalyticsEvents()) {
    counts[e.name] = (counts[e.name] ?? 0) + 1;
  }
  return counts;
}
