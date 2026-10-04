"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PreviewPlayer } from "@/components/PreviewPlayer";
import { ShareButton } from "@/components/ShareButton";
import { SiteNav } from "@/components/SiteNav";
import { SongPin } from "@/components/SongPin";
import { SquareGrid } from "@/components/SquareGrid";
import { clearMyNine, getMyNine, type MyNine } from "@/lib/my-nine";
import type { TrackPin } from "@/data/chapters";

export default function MyNinePage() {
  const [board, setBoard] = useState<MyNine | null>(null);

  useEffect(() => {
    setBoard(getMyNine());
  }, []);

  if (!board || board.slots.length === 0) {
    return (
      <main className="hero-wash min-h-screen">
        <div className="mx-auto max-w-[720px] px-3 py-8 sm:px-5">
          <SiteNav />
          <h1 className="font-display text-3xl text-paper">My Nine</h1>
          <p className="mt-3 text-sm text-paper/55">
            You haven’t built a board yet.
          </p>
          <Link href="/create" className="btn-primary mt-6 inline-flex">
            Make your Nine
          </Link>
        </div>
      </main>
    );
  }

  const pins: TrackPin[] = board.slots.map((s) => ({
    title: s.title,
    artist: s.artist,
    imageUrl: s.imageUrl,
    previewUrl: s.previewUrl,
    appleMusicUrl: s.appleMusicUrl,
    appleId: s.appleId,
    year: s.year,
  }));

  return (
    <main className="hero-wash min-h-screen">
      <div className="mx-auto max-w-[720px] px-3 pb-20 pt-8 sm:px-5">
        <SiteNav />
        <header className="mb-6 flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-amber-soft/90">
              Yours
            </p>
            <h1 className="mt-2 font-display text-3xl text-paper">My Nine</h1>
            <p className="mt-2 text-sm text-paper/45">
              Saved on this device
              {board.updatedAt
                ? ` · ${new Date(board.updatedAt).toLocaleDateString()}`
                : ""}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <ShareButton title="My Nine · 9 Songs of My Life" text="My nine life songs." />
            <Link href="/create" className="btn-secondary">
              Edit
            </Link>
          </div>
        </header>

        {pins[0]?.previewUrl && (
          <div className="mb-4">
            <PreviewPlayer
              src={pins[0].previewUrl}
              label={`${pins[0].title} — ${pins[0].artist}`}
            />
          </div>
        )}

        <SquareGrid className="overflow-hidden rounded-sm">
          {pins.map((pin, i) => (
            <SongPin
              key={`${pin.title}-${i}`}
              pin={pin}
              square
              playFirst
              indexLabel={i + 1}
              caption={board.slots[i]?.stage ?? pin.title}
              subcaption={pin.title}
            />
          ))}
        </SquareGrid>

        <button
          type="button"
          className="mt-8 text-sm text-paper/40 underline-offset-2 hover:text-paper hover:underline"
          onClick={() => {
            clearMyNine();
            setBoard(null);
          }}
        >
          Clear My Nine
        </button>
      </div>
    </main>
  );
}
