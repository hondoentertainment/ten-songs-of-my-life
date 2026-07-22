"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";

type PreviewPlayerProps = {
  src?: string;
  label: string;
  chapterId?: string;
  compact?: boolean;
};

export function PreviewPlayer({
  src,
  label,
  chapterId,
  compact = false,
}: PreviewPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  if (!src) {
    return (
      <button
        type="button"
        disabled
        className={
          compact
            ? "inline-flex min-h-9 items-center rounded-full bg-paper/10 px-3 text-xs text-paper/35"
            : "btn-secondary opacity-40"
        }
        title="No preview available"
      >
        Preview
      </button>
    );
  }

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!audioRef.current) {
      audioRef.current = new Audio(src);
      audioRef.current.preload = "none";
      audioRef.current.addEventListener("ended", () => setPlaying(false));
    }

    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
      return;
    }

    // stop other previews
    document.querySelectorAll("audio").forEach((a) => {
      a.pause();
    });

    try {
      await audioRef.current.play();
      setPlaying(true);
      track("play_preview", { label, chapterId });
    } catch {
      setPlaying(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={
        compact
          ? `inline-flex min-h-9 items-center rounded-full px-3 text-xs font-semibold transition ${
              playing
                ? "bg-amber-glow text-ink"
                : "bg-paper text-ink hover:bg-paper-warm"
            }`
          : playing
            ? "btn-primary"
            : "btn-secondary"
      }
      aria-pressed={playing}
      aria-label={playing ? `Stop preview of ${label}` : `Preview ${label}`}
    >
      {playing ? "Stop" : "Play preview"}
    </button>
  );
}
