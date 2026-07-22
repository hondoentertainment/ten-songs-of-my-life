import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FavoriteButton } from "@/components/FavoriteButton";
import { ListenBoardLinks } from "@/components/ListenBoardLinks";
import { PreviewPlayer } from "@/components/PreviewPlayer";
import { ShareButton } from "@/components/ShareButton";
import { SimilarBoards } from "@/components/SimilarBoards";
import { SiteNav } from "@/components/SiteNav";
import { SongPin } from "@/components/SongPin";
import { SquareGrid } from "@/components/SquareGrid";
import { StoryScrap } from "@/components/StoryScrap";
import { categories } from "@/data/categories";
import { chapters, getChapter, getChapterIndex } from "@/data/chapters";
import { withMedia } from "@/lib/media";

type PageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return chapters.map((c) => ({ id: c.id }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const chapter = getChapter(id);
  if (!chapter) return { title: "Not found" };

  return {
    title: `${chapter.stage} — ${chapter.mood}`,
    description: chapter.story,
    openGraph: {
      title: `${chapter.title} · 10 Songs of My Life`,
      description: `${chapter.stage} · ${chapter.mood}. ${chapter.story}`,
    },
  };
}

export default async function ChapterPage({ params }: PageProps) {
  const { id } = await params;
  const chapter = getChapter(id);
  if (!chapter) notFound();

  const seed = withMedia(chapter.seed);
  const boardPins = [seed, ...chapter.pins.map(withMedia)];
  const index = getChapterIndex(chapter.id);
  const prev = index > 0 ? chapters[index - 1] : null;
  const next =
    index >= 0 && index < chapters.length - 1 ? chapters[index + 1] : null;
  const categoryLabels = chapter.categories
    .map((cid) => categories.find((c) => c.id === cid)?.label)
    .filter(Boolean);

  return (
    <main className="hero-wash min-h-screen">
      <div className="mx-auto max-w-[720px] px-3 pb-20 pt-[max(1.25rem,env(safe-area-inset-top))] sm:px-5 sm:pt-8">
        <SiteNav />
        <Link
          href="/#board"
          className="inline-flex min-h-10 items-center text-sm text-paper/50 transition hover:text-amber-soft"
        >
          ← Board
        </Link>

        <header className="mt-6 animate-fade-up border-b border-paper/10 pb-7">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-amber-soft/90">
            {chapter.weeklyDrop ? "This week’s drop · " : ""}
            {categoryLabels.join(" · ") || "Board"}
          </p>
          <h1 className="mt-2.5 font-display text-[clamp(2rem,8vw,3.25rem)] leading-[0.98] tracking-tight text-paper text-balance">
            {chapter.stage}
          </h1>
          <p className="mt-2 text-base text-paper/55 sm:text-lg">
            {chapter.mood}
          </p>
          <p className="mt-2 text-sm text-paper/40">
            Seed: {seed.title} — {seed.artist}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <PreviewPlayer
              src={seed.previewUrl}
              label={`${seed.title} — ${seed.artist}`}
              chapterId={chapter.id}
            />
            <ListenBoardLinks chapter={{ ...chapter, seed }} />
            <FavoriteButton id={chapter.id} />
            <ShareButton
              title={`${chapter.title} · 10 Songs of My Life`}
              text={`${chapter.stage} — ${chapter.mood}`}
            />
          </div>

          <p className="mt-4 text-xs text-paper/35">
            Embed:{" "}
            <Link
              href={`/embed/${chapter.id}`}
              className="underline-offset-2 hover:text-paper/60 hover:underline"
            >
              /embed/{chapter.id}
            </Link>
          </p>
        </header>

        <section className="mt-8 space-y-8">
          <StoryScrap
            stage={chapter.stage}
            mood={chapter.mood}
            title={chapter.title}
            story={chapter.story}
          />

          <div>
            <div className="mb-3 flex items-baseline justify-between gap-3">
              <h2 className="font-display text-lg text-paper sm:text-xl">
                Listen
              </h2>
              <p className="text-[11px] uppercase tracking-[0.2em] text-paper/35">
                {boardPins.length} tracks
              </p>
            </div>
            <SquareGrid className="overflow-hidden rounded-sm">
              {boardPins.map((pin, pinIndex) => (
                <SongPin
                  key={`${pin.title}-${pin.artist}-${pinIndex}`}
                  pin={pin}
                  delayMs={40 + pinIndex * 30}
                  square
                  playFirst
                  chapterId={chapter.id}
                  indexLabel={pinIndex + 1}
                />
              ))}
            </SquareGrid>
          </div>
        </section>

        <SimilarBoards chapter={chapter} candidates={chapters} />

        <nav className="mt-12 flex items-center justify-between gap-4 border-t border-paper/10 pt-6">
          {prev ? (
            <Link
              href={`/songs/${prev.id}`}
              className="group max-w-[45%] text-sm text-paper/50 transition hover:text-paper"
            >
              <span className="block text-[10px] uppercase tracking-[0.18em] text-paper/30">
                Previous
              </span>
              <span className="mt-1 block truncate font-display text-base text-paper/80 group-hover:text-paper">
                {prev.stage}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/songs/${next.id}`}
              className="group max-w-[45%] text-right text-sm text-paper/50 transition hover:text-paper"
            >
              <span className="block text-[10px] uppercase tracking-[0.18em] text-paper/30">
                Next
              </span>
              <span className="mt-1 block truncate font-display text-base text-paper/80 group-hover:text-paper">
                {next.stage}
              </span>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </div>
    </main>
  );
}
