"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CategoryLock } from "@/components/CategoryLock";
import { SongPin } from "@/components/SongPin";
import { SquareGrid } from "@/components/SquareGrid";
import { WeeklyDrop } from "@/components/WeeklyDrop";
import type { Category, CategoryId } from "@/data/categories";
import type { Chapter } from "@/data/chapters";
import { track } from "@/lib/analytics";
import { withMedia } from "@/lib/media";

type HomeBoardProps = {
  chapters: Chapter[];
  categories: Category[];
  weekly?: Chapter;
};

const CAT_IDS: Array<CategoryId | "all"> = [
  "all",
  "timeline",
  "heart",
  "energy",
  "places",
  "rituals",
];

function parseCat(value: string | null): CategoryId | "all" {
  if (!value) return "timeline";
  if (CAT_IDS.includes(value as CategoryId | "all")) {
    return value as CategoryId | "all";
  }
  return "timeline";
}

export function HomeBoard({ chapters, categories, weekly }: HomeBoardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [locked, setLocked] = useState<CategoryId | "all">(() =>
    parseCat(searchParams.get("cat")),
  );

  useEffect(() => {
    setLocked(parseCat(searchParams.get("cat")));
  }, [searchParams]);

  function onLock(id: CategoryId | "all") {
    setLocked(id);
    track("category_lock", { id });
    const params = new URLSearchParams(searchParams.toString());
    if (id === "timeline") params.delete("cat");
    else params.set("cat", id);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  const counts = useMemo(() => {
    const next: Record<CategoryId | "all", number> = {
      all: chapters.length,
      timeline: 0,
      heart: 0,
      energy: 0,
      places: 0,
      rituals: 0,
    };
    for (const chapter of chapters) {
      for (const cat of chapter.categories) {
        next[cat] += 1;
      }
    }
    return next;
  }, [chapters]);

  const visible = useMemo(() => {
    const filtered =
      locked === "all"
        ? [...chapters].sort((a, b) => a.number - b.number)
        : chapters
            .filter((c) => c.categories.includes(locked))
            .sort((a, b) => a.number - b.number);

    if (locked === "timeline") return filtered.slice(0, 9);
    return filtered;
  }, [chapters, locked]);

  const heading =
    locked === "timeline"
      ? "The nine"
      : locked === "all"
        ? "All boards"
        : (categories.find((c) => c.id === locked)?.label ?? "Board");

  return (
    <section id="board" className="w-full">
      {weekly && locked === "timeline" && <WeeklyDrop chapter={weekly} />}

      <div className="mb-5 space-y-4 sm:mb-6">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-display text-xl tracking-tight text-paper sm:text-2xl">
            {heading}
          </h2>
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-paper/35">
            {locked === "timeline" ? "3 × 3" : `${visible.length}`}
          </p>
        </div>

        <CategoryLock
          categories={categories}
          locked={locked}
          onLock={onLock}
          counts={counts}
        />
      </div>

      <SquareGrid key={locked} className="overflow-hidden rounded-sm">
        {visible.map((chapter, index) => {
          const seed = withMedia(chapter.seed);
          return (
            <SongPin
              key={chapter.id}
              pin={seed}
              href={`/songs/${chapter.id}`}
              caption={chapter.stage}
              subcaption={chapter.mood}
              delayMs={index * 35}
              showListen={false}
              square
              playFirst
              chapterId={chapter.id}
              indexLabel={locked === "timeline" ? index + 1 : chapter.number}
            />
          );
        })}
      </SquareGrid>

      {visible.length === 0 && (
        <p className="py-16 text-center text-sm text-paper/45">
          Nothing in this lane yet — try another category.
        </p>
      )}
    </section>
  );
}
