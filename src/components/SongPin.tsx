"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { PreviewPlayer } from "@/components/PreviewPlayer";
import type { PinHeight, TrackPin } from "@/data/chapters";
import { track } from "@/lib/analytics";
import { appleMusicTrackUrl, spotifyTrackUrl } from "@/lib/listen-links";

type SongPinProps = {
  pin: TrackPin;
  href?: string;
  caption?: string;
  subcaption?: string;
  delayMs?: number;
  showListen?: boolean;
  square?: boolean;
  indexLabel?: string | number;
  chapterId?: string;
  playFirst?: boolean;
};

const heightClass: Record<PinHeight, string> = {
  tall: "pin-tall",
  medium: "pin-medium",
  short: "pin-short",
};

export function SongPin({
  pin,
  href,
  caption,
  subcaption,
  delayMs = 0,
  showListen = true,
  square = false,
  indexLabel,
  chapterId,
  playFirst = false,
}: SongPinProps) {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const height = pin.pinHeight ?? "medium";
  const title = caption ?? pin.title;
  const subtitle = subcaption ?? pin.artist;
  const isDataImage = pin.imageUrl?.startsWith("data:");
  const itemClass = square ? "square-grid-item" : "masonry-item";
  const ratioClass = square ? "pin-square" : heightClass[height];

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const image = pin.imageUrl ? (
    isDataImage ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={pin.imageUrl}
        alt=""
        className="absolute inset-0 h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.04]"
      />
    ) : (
      <Image
        src={pin.imageUrl}
        alt=""
        fill
        sizes={
          square
            ? "(max-width: 720px) 33vw, 240px"
            : "(max-width: 640px) 50vw, 33vw"
        }
        className="object-cover transition duration-500 ease-out group-hover:scale-[1.04]"
      />
    )
  ) : (
    <div className="absolute inset-0 bg-gradient-to-br from-amber-deep/50 to-ink" />
  );

  const playBar = playFirst ? (
    <div className="absolute inset-x-0 bottom-0 z-[2] flex flex-wrap gap-1.5 p-2">
      <PreviewPlayer
        src={pin.previewUrl}
        label={`${pin.title} — ${pin.artist}`}
        chapterId={chapterId}
        compact
      />
      <a
        href={spotifyTrackUrl(pin)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("play_spotify", { title: pin.title, chapterId })}
        className="inline-flex min-h-9 items-center rounded-full bg-[#1DB954] px-3 text-xs font-semibold text-[#04140a]"
      >
        Spotify
      </a>
    </div>
  ) : null;

  // Square + href: no nested interactive elements
  if (square && href) {
    return (
      <div
        className={`${itemClass} group animate-pin-in`}
        style={{ animationDelay: `${delayMs}ms` }}
      >
        <div className="flex flex-col gap-2">
          <div
            className={`relative w-full overflow-hidden bg-ink-muted ${ratioClass}`}
          >
            <Link
              href={href}
              className="absolute inset-0 z-0"
              aria-label={`${title}: ${subtitle}`}
              onClick={() => {
                if (chapterId) track("open_chapter", { id: chapterId });
              }}
            >
              <span className="sr-only">
                {title}: {subtitle}
              </span>
            </Link>
            <div className="pointer-events-none absolute inset-0">{image}</div>
            {indexLabel != null && (
              <span className="pointer-events-none absolute left-2 top-2 z-[1] flex h-6 min-w-6 items-center justify-center rounded-[3px] bg-ink/70 px-1.5 text-[11px] font-semibold tabular-nums text-paper backdrop-blur-sm">
                {indexLabel}
              </span>
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
            {playBar}
          </div>
          <Link
            href={href}
            className="min-h-[2.6rem] px-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-soft"
            onClick={() => {
              if (chapterId) track("open_chapter", { id: chapterId });
            }}
          >
            <p className="line-clamp-1 font-display text-[0.8rem] leading-snug text-paper sm:text-[0.92rem]">
              {title}
            </p>
            <p className="mt-0.5 line-clamp-1 text-[0.68rem] leading-snug text-paper/55 sm:text-xs">
              {subtitle}
            </p>
          </Link>
        </div>
      </div>
    );
  }

  const media = square ? (
    <div className="flex flex-col gap-2">
      <div className={`relative w-full overflow-hidden bg-ink-muted ${ratioClass}`}>
        {image}
        {indexLabel != null && (
          <span className="absolute left-2 top-2 z-[1] flex h-6 min-w-6 items-center justify-center rounded-[3px] bg-ink/70 px-1.5 text-[11px] font-semibold tabular-nums text-paper backdrop-blur-sm">
            {indexLabel}
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
        {playBar}
      </div>
      <div className="min-h-[2.6rem] px-0.5">
        <p className="line-clamp-1 font-display text-[0.8rem] leading-snug text-paper sm:text-[0.92rem]">
          {title}
        </p>
        <p className="mt-0.5 line-clamp-1 text-[0.68rem] leading-snug text-paper/55 sm:text-xs">
          {subtitle}
        </p>
      </div>
    </div>
  ) : (
    <div
      className={`relative w-full overflow-hidden rounded-sm bg-ink-soft shadow-pin ${ratioClass}`}
    >
      {image}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/25 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-3 sm:p-3.5">
        <p className="line-clamp-2 font-display text-[0.95rem] leading-tight text-paper">
          {title}
        </p>
        <p className="mt-1 line-clamp-1 text-xs text-paper/70">{subtitle}</p>
      </div>
    </div>
  );

  const shellClass = `${itemClass} group block w-full text-left animate-pin-in focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-soft focus-visible:ring-offset-2 focus-visible:ring-offset-ink`;

  if (href) {
    return (
      <Link
        href={href}
        className={shellClass}
        style={{ animationDelay: `${delayMs}ms` }}
        aria-label={`${title}: ${subtitle}`}
        onClick={() => {
          if (chapterId) track("open_chapter", { id: chapterId });
        }}
      >
        {media}
      </Link>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={shellClass}
        style={{ animationDelay: `${delayMs}ms` }}
        aria-label={`Open ${pin.title} by ${pin.artist}`}
      >
        {media}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/80 p-4 backdrop-blur-md sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-md border border-paper/10 bg-ink-soft shadow-lift animate-fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-square bg-ink">{image}</div>
            <div className="space-y-5 p-5 sm:p-6">
              <div>
                <h3
                  id={titleId}
                  className="font-display text-2xl leading-tight text-paper text-balance"
                >
                  {pin.title}
                </h3>
                <p className="mt-1.5 text-sm text-paper/65">
                  {pin.artist}
                  {pin.year ? ` · ${pin.year}` : ""}
                </p>
              </div>
              {showListen && (
                <div className="space-y-2">
                  <PreviewPlayer
                    src={pin.previewUrl}
                    label={`${pin.title} — ${pin.artist}`}
                    chapterId={chapterId}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={spotifyTrackUrl(pin)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-spotify"
                      onClick={() =>
                        track("play_spotify", {
                          title: pin.title,
                          chapterId,
                        })
                      }
                    >
                      Spotify
                    </a>
                    <a
                      href={appleMusicTrackUrl(pin)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-apple"
                      onClick={() =>
                        track("play_apple", {
                          title: pin.title,
                          chapterId,
                        })
                      }
                    >
                      Apple Music
                    </a>
                  </div>
                </div>
              )}
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(false)}
                className="text-sm text-paper/55 underline-offset-4 transition hover:text-paper hover:underline"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
