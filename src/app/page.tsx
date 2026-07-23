import Link from "next/link";
import { MasonryBoard } from "@/components/MasonryBoard";
import { SongPin } from "@/components/SongPin";
import { ShareButton } from "@/components/ShareButton";
import { chapters } from "@/data/chapters";

export default function HomePage() {
  return (
    <main className="hero-wash min-h-screen">
      <section className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-end px-5 pb-14 pt-20 sm:px-8 sm:pb-20">
        <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.28em] text-amber-soft/80">
          A personal mood board
        </p>
        <h1
          className="animate-fade-up mt-4 max-w-3xl font-display text-[clamp(2.8rem,9vw,5.6rem)] leading-[0.95] tracking-tight text-paper"
          style={{ animationDelay: "80ms" }}
        >
          9 Songs of My Life
        </h1>
        <p
          className="animate-fade-up mt-5 max-w-xl text-base leading-relaxed text-paper/70 sm:text-lg"
          style={{ animationDelay: "160ms" }}
        >
          Ten stages. Ten moods. A visual board you can wander—and play on
          Spotify or Apple Music.
        </p>
        <div
          className="animate-fade-up mt-8 flex flex-wrap items-center gap-3"
          style={{ animationDelay: "240ms" }}
        >
          <a
            href="#board"
            className="inline-flex items-center rounded-sm bg-amber-glow px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-amber-soft"
          >
            Enter the ten
          </a>
          <ShareButton
            title="9 Songs of My Life"
            text="A visual mood board of ten life-stage songs."
          />
        </div>
      </section>

      <section
        id="board"
        className="mx-auto max-w-[1400px] px-4 pb-24 sm:px-6 lg:px-8"
      >
        <div className="mb-8 flex items-end justify-between gap-4 border-b border-paper/10 pb-4">
          <div>
            <h2 className="font-display text-2xl text-paper sm:text-3xl">
              The board
            </h2>
            <p className="mt-1 text-sm text-paper/55">
              Tap a stage pin to open its mood collage.
            </p>
          </div>
          <Link
            href="/all"
            className="shrink-0 text-xs uppercase tracking-[0.2em] text-paper/50 transition hover:text-amber-soft"
          >
            All songs →
          </Link>
        </div>

        <MasonryBoard>
          {chapters.map((chapter, index) => (
            <SongPin
              key={chapter.id}
              pin={chapter.seed}
              href={`/songs/${chapter.id}`}
              caption={`${chapter.number}. ${chapter.stage}`}
              subcaption={chapter.mood}
              delayMs={index * 45}
              featured
              showListen={false}
            />
          ))}
        </MasonryBoard>
      </section>

      <footer className="border-t border-paper/10 px-5 py-10 text-center text-xs text-paper/40">
        9 Songs of My Life · share the board · play the mood
      </footer>
    </main>
  );
}
