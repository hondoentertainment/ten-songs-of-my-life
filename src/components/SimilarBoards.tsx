import Link from "next/link";
import type { Chapter } from "@/data/chapters";
import { withMedia } from "@/lib/media";

type SimilarBoardsProps = {
  chapter: Chapter;
  candidates: Chapter[];
};

export function SimilarBoards({ chapter, candidates }: SimilarBoardsProps) {
  const similar = candidates
    .filter((c) => c.id !== chapter.id)
    .map((c) => ({
      chapter: c,
      score: c.categories.filter((cat) => chapter.categories.includes(cat))
        .length,
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.chapter.number - b.chapter.number)
    .slice(0, 3)
    .map((x) => x.chapter);

  if (!similar.length) return null;

  return (
    <section className="mt-12 border-t border-paper/10 pt-8">
      <h2 className="font-display text-lg text-paper sm:text-xl">
        Similar squares
      </h2>
      <p className="mt-1 text-sm text-paper/45">More boards in this lane.</p>
      <div className="mt-4 grid grid-cols-3 gap-[3px] overflow-hidden rounded-sm">
        {similar.map((c) => {
          const seed = withMedia(c.seed);
          return (
            <Link
              key={c.id}
              href={`/songs/${c.id}`}
              className="group block"
            >
              <div className="relative aspect-square overflow-hidden bg-ink-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={seed.imageUrl}
                  alt=""
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                />
              </div>
              <p className="mt-2 line-clamp-1 px-0.5 font-display text-[0.8rem] text-paper">
                {c.stage}
              </p>
              <p className="line-clamp-1 px-0.5 text-[0.68rem] text-paper/50">
                {c.mood}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
