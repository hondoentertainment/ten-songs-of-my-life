import type { Chapter } from "@/data/chapters";
import { appleBoardUrl, spotifyBoardUrl } from "@/lib/listen-links";

type ListenBoardLinksProps = {
  chapter: Chapter;
};

export function ListenBoardLinks({ chapter }: ListenBoardLinksProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <a
        href={spotifyBoardUrl(chapter.spotifyPlaylistUrl, chapter.seed)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center rounded-sm bg-[#1DB954] px-3.5 py-2 text-sm font-medium text-ink transition hover:brightness-110"
      >
        Play on Spotify
      </a>
      <a
        href={appleBoardUrl(chapter.appleMusicPlaylistUrl, chapter.seed)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center rounded-sm bg-paper px-3.5 py-2 text-sm font-medium text-ink transition hover:bg-paper-warm"
      >
        Play on Apple Music
      </a>
    </div>
  );
}
