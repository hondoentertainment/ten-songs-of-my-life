import Link from "next/link";
import type { Chapter } from "@/data/chapters";
import { withMedia } from "@/lib/media";

type WeeklyDropProps = {
  chapter: Chapter;
};

export function WeeklyDrop({ chapter }: WeeklyDropProps) {
  const seed = withMedia(chapter.seed);

  return (
    <Link
      href={`/songs/${chapter.id}`}
      className="group mb-6 flex overflow-hidden rounded-sm border border-paper/10 bg-ink-soft/60 transition hover:border-amber-soft/40"
    >
      <div className="relative h-24 w-24 shrink-0 sm:h-28 sm:w-28">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={seed.imageUrl}
          alt=""
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center px-4 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-soft">
          This week’s drop
        </p>
        <p className="mt-1 truncate font-display text-lg text-paper">
          {chapter.stage}
        </p>
        <p className="truncate text-sm text-paper/50">{chapter.mood}</p>
      </div>
    </Link>
  );
}
