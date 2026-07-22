import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PreviewPlayer } from "@/components/PreviewPlayer";
import { SongPin } from "@/components/SongPin";
import { SquareGrid } from "@/components/SquareGrid";
import { chapters, getChapter } from "@/data/chapters";
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
  if (!chapter) return { title: "Embed" };
  return {
    title: `${chapter.stage} (embed)`,
    robots: { index: false, follow: false },
  };
}

export default async function EmbedPage({ params }: PageProps) {
  const { id } = await params;
  const chapter = getChapter(id);
  if (!chapter) notFound();

  const seed = withMedia(chapter.seed);
  const pins = [seed, ...chapter.pins.map(withMedia)].slice(0, 9);

  return (
    <main className="min-h-screen bg-ink px-2 py-3 text-paper">
      <div className="mx-auto max-w-[420px]">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-soft">
              10 Songs of My Life
            </p>
            <h1 className="mt-1 truncate font-display text-xl">{chapter.stage}</h1>
            <p className="truncate text-xs text-paper/50">{chapter.mood}</p>
          </div>
          <PreviewPlayer
            src={seed.previewUrl}
            label={seed.title}
            chapterId={chapter.id}
            compact
          />
        </div>

        <SquareGrid>
          {pins.map((pin, i) => (
            <SongPin
              key={`${pin.title}-${i}`}
              pin={pin}
              square
              playFirst
              chapterId={chapter.id}
              indexLabel={i + 1}
              caption={pin.title}
              subcaption={pin.artist}
            />
          ))}
        </SquareGrid>

        <p className="mt-3 text-center text-[11px] text-paper/35">
          <Link href={`/songs/${chapter.id}`} className="hover:text-paper/60">
            Open full board →
          </Link>
        </p>
      </div>
    </main>
  );
}
