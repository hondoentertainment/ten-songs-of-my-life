"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { PinHeight, TrackPin } from "@/data/chapters";
import { appleMusicTrackUrl, spotifyTrackUrl } from "@/lib/listen-links";

type SongPinProps = {
  pin: TrackPin;
  href?: string;
  caption?: string;
  subcaption?: string;
  delayMs?: number;
  featured?: boolean;
  showListen?: boolean;
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
  featured = false,
  showListen = true,
}: SongPinProps) {
  const [open, setOpen] = useState(false);
  const height = pin.pinHeight ?? "medium";
  const title = caption ?? pin.title;
  const subtitle = subcaption ?? pin.artist;
  const isDataImage = pin.imageUrl?.startsWith("data:");

  const media = (
    <div
      className={`relative w-full overflow-hidden rounded-sm bg-ink-soft shadow-pin transition duration-300 group-hover:-translate-y-1 group-hover:shadow-lift ${heightClass[height]} ${featured ? "ring-1 ring-amber-soft/40" : ""}`}
    >
      {pin.imageUrl ? (
        isDataImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={pin.imageUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <Image
            src={pin.imageUrl}
            alt=""
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        )
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-amber-deep/40 to-ink" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent opacity-90" />
      <div className="absolute inset-x-0 bottom-0 p-3 sm:p-3.5">
        <p className="font-display text-[0.95rem] leading-tight text-paper sm:text-base">
          {title}
        </p>
        <p className="mt-1 text-xs text-paper/70 sm:text-sm">{subtitle}</p>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="masonry-item group block animate-pin-in focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-soft"
        style={{ animationDelay: `${delayMs}ms` }}
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
        className="masonry-item group block w-full text-left animate-pin-in focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-soft"
        style={{ animationDelay: `${delayMs}ms` }}
      >
        {media}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/75 p-4 backdrop-blur-sm sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-label={`${pin.title} by ${pin.artist}`}
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-md bg-ink-soft shadow-lift animate-fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[4/3] bg-ink">
              {pin.imageUrl ? (
                isDataImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={pin.imageUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Image
                    src={pin.imageUrl}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="400px"
                  />
                )
              ) : null}
            </div>
            <div className="space-y-4 p-5">
              <div>
                <h3 className="font-display text-2xl text-paper">{pin.title}</h3>
                <p className="mt-1 text-sm text-paper/70">
                  {pin.artist}
                  {pin.year ? ` · ${pin.year}` : ""}
                </p>
              </div>
              {showListen && (
                <div className="flex flex-wrap gap-2">
                  <a
                    href={spotifyTrackUrl(pin)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-sm bg-[#1DB954] px-3.5 py-2 text-sm font-medium text-ink transition hover:brightness-110"
                  >
                    Spotify
                  </a>
                  <a
                    href={appleMusicTrackUrl(pin)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-sm bg-paper px-3.5 py-2 text-sm font-medium text-ink transition hover:bg-paper-warm"
                  >
                    Apple Music
                  </a>
                </div>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-sm text-paper/60 underline-offset-4 hover:text-paper hover:underline"
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
