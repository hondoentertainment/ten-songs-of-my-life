import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChapterKeyboardNav } from "@/components/ChapterKeyboardNav";
import { ListenBoardLinks } from "@/components/ListenBoardLinks";
import { MasonryBoard } from "@/components/MasonryBoard";
import { ShareButton } from "@/components/ShareButton";
import { SongPin } from "@/components/SongPin";
import { StoryScrap } from "@/components/StoryScrap";
import { chapters, getChapter } from "@/data/chapters";

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
      title: `${chapter.title} · 9 Songs of My Life`,
      description: `${chapter.stage} · ${chapter.mood}. ${chapter.story}`,
    },
  };
}

export default async function ChapterPage({ params }: PageProps) {
  const { id } = await params;
  const chapter = getChapter(id);
  if (!chapter) notFound();

  const boardPins = [chapter.seed, ...chapter.pins];
  const prevChapter = chapter.number > 1 ? chapters[chapter.number - 2] : undefined;
  const nextChapter =
    chapter.number < chapters.length ? chapters[chapter.number] : undefined;
  const prevHref = prevChapter ? `/songs/${prevChapter.id}` : undefined;
  const nextHref = nextChapter ? `/songs/${nextChapter.id}` : undefined;

  return (
    <main className="hero-wash min-h-screen">
      <ChapterKeyboardNav prevHref={prevHref} nextHref={nextHref} />
      <header className="mx-auto max-w-[1400px] px-4 pt-8 sm:px-6 lg:px-8">
        <Link
          href="/#board"
          className="text-sm text-paper/55 transition hover:text-amber-soft"
        >
          ← Back to the board
        </Link>

        <div className="mt-8 flex flex-col gap-6 border-b border-paper/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl animate-fade-up">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-soft/80">
              Pin {chapter.number} of 10
            </p>
            <h1 className="mt-3 font-display text-[clamp(2.2rem,6vw,3.8rem)] leading-[1] text-paper">
              {chapter.stage}
            </h1>
            <p className="mt-3 text-lg text-paper/65">{chapter.mood}</p>
          </div>

          <div
            className="flex flex-wrap items-center gap-2 animate-fade-up"
            style={{ animationDelay: "100ms" }}
          >
            <ListenBoardLinks chapter={chapter} />
            <ShareButton
              title={`${chapter.title} · 9 Songs of My Life`}
              text={`${chapter.stage} — ${chapter.mood}`}
            />
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
        <MasonryBoard>
          <StoryScrap
            stage={chapter.stage}
            mood={chapter.mood}
            title={chapter.title}
            story={chapter.story}
          />
          {boardPins.map((pin, index) => (
            <SongPin
              key={`${pin.title}-${pin.artist}-${index}`}
              pin={pin}
              delayMs={60 + index * 40}
              featured={index === 0}
            />
          ))}
        </MasonryBoard>
      </section>

      <nav className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 pb-6 sm:px-6 lg:px-8">
        {prevChapter ? (
          <Link
            href={prevHref!}
            className="text-sm text-paper/55 hover:text-paper"
          >
            ← {prevChapter.stage}
          </Link>
        ) : (
          <span />
        )}
        {nextChapter ? (
          <Link
            href={nextHref!}
            className="text-sm text-paper/55 hover:text-paper"
          >
            {nextChapter.stage} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
      <p className="mx-auto max-w-[1400px] px-4 pb-16 text-center text-xs text-paper/30 sm:px-6 lg:px-8">
        Tip: use ← and → to move between chapters
      </p>
    </main>
  );
}
