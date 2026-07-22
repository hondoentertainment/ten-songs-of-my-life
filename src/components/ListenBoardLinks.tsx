"use client";

import type { Chapter } from "@/data/chapters";
import { track } from "@/lib/analytics";
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
        className="btn-spotify"
        onClick={() => track("play_spotify", { id: chapter.id, board: true })}
      >
        Spotify
      </a>
      <a
        href={appleBoardUrl(chapter.appleMusicPlaylistUrl, chapter.seed)}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-apple"
        onClick={() => track("play_apple", { id: chapter.id, board: true })}
      >
        Apple Music
      </a>
    </div>
  );
}
