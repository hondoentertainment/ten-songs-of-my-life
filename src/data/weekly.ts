import { chapters, type Chapter } from "@/data/chapters";

/** Explicit weekly drop, or fall back to a featured ritual board. */
export function getWeeklyDrop(): Chapter {
  return (
    chapters.find((c) => c.weeklyDrop) ??
    chapters.find((c) => c.id === "rainy-day-in") ??
    chapters[0]
  );
}
