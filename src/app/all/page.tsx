import type { Metadata } from "next";
import Link from "next/link";
import { ListenBoardLinks } from "@/components/ListenBoardLinks";
import { chapters } from "@/data/chapters";
import { appleMusicTrackUrl, spotifyTrackUrl } from "@/lib/listen-links";

const trackCount = chapters.reduce(
  (total, chapter) => total + 1 + chapter.pins.length,
  0,
);

export const metadata: Metadata = {
  title: "All songs",
  description: `Every track across all ${chapters.length} chapters, in one list. Open any song on Spotify or Apple Music.`,
  openGraph: {
    title: "All songs · 9 Songs of My Life",
    description: `The full track list — ${trackCount} songs across ${chapters.length} chapters.`,
  },
};

export default function AllSongsPage() {
  return (
    <main className="hero-wash min-h-screen">
      <header className="mx-auto max-w-4xl px-5 pt-10 sm:px-8">
        <Link
          href="/#board"
          className="text-sm text-paper/55 transition hover:text-amber-soft"
        >
          ← Back to the board
        </Link>

        <div className="mt-8 border-b border-paper/10 pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-soft/80">
            The full track list
          </p>
          <h1 className="mt-3 font-display text-[clamp(2.2rem,6vw,3.6rem)] leading-[1] text-paper">
            All songs
          </h1>
          <p className="mt-3 text-paper/65">
            {trackCount} songs across {chapters.length} chapters. Tap any title
            to open it on Spotify or Apple Music.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-4xl space-y-12 px-5 py-12 sm:px-8">
        {chapters.map((chapter) => {
          const tracks = [chapter.seed, ...chapter.pins];
          return (
            <section key={chapter.id}>
              <div className="flex flex-col gap-3 border-b border-paper/10 pb-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-[0.2em]"
                    style={{ color: chapter.accent }}
                  >
                    {chapter.number}. {chapter.stage} · {chapter.mood}
                  </p>
                  <h2 className="mt-1 font-display text-2xl text-paper">
                    <Link
                      href={`/songs/${chapter.id}`}
                      className="transition hover:text-amber-soft"
                    >
                      {chapter.title}
                    </Link>
                  </h2>
                </div>
                <ListenBoardLinks chapter={chapter} />
              </div>

              <ul className="mt-4 divide-y divide-paper/5">
                {tracks.map((track, index) => (
                  <li
                    key={`${track.title}-${track.artist}-${index}`}
                    className="flex items-center justify-between gap-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-paper">
                        {track.title}
                        {index === 0 && (
                          <span className="ml-2 text-[0.65rem] uppercase tracking-[0.15em] text-amber-soft/70">
                            seed
                          </span>
                        )}
                      </p>
                      <p className="truncate text-sm text-paper/60">
                        {track.artist}
                        {track.year ? ` · ${track.year}` : ""}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2 text-xs">
                      <a
                        href={spotifyTrackUrl(track)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-sm bg-[#1DB954] px-2.5 py-1.5 font-medium text-ink transition hover:brightness-110"
                      >
                        Spotify
                      </a>
                      <a
                        href={appleMusicTrackUrl(track)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-sm bg-paper px-2.5 py-1.5 font-medium text-ink transition hover:bg-paper-warm"
                      >
                        Apple
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <footer className="border-t border-paper/10 px-5 py-10 text-center text-xs text-paper/40">
        9 Songs of My Life · share the board · play the mood
      </footer>
    </main>
  );
}
