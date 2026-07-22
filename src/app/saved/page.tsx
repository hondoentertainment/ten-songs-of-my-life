"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { chapters } from "@/data/chapters";
import { getFavorites } from "@/lib/favorites";
import { withMedia } from "@/lib/media";

export default function SavedPage() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    setIds(getFavorites());
  }, []);

  const saved = chapters.filter((c) => ids.includes(c.id));

  return (
    <main className="hero-wash min-h-screen">
      <div className="mx-auto max-w-[720px] px-3 pb-20 pt-8 sm:px-5">
        <SiteNav />
        <h1 className="font-display text-3xl text-paper">Saved boards</h1>
        <p className="mt-2 text-sm text-paper/50">
          Hearts stay on this device—no account needed.
        </p>

        {saved.length === 0 ? (
          <p className="mt-10 text-sm text-paper/45">
            Nothing saved yet. Open a board and tap Save.
          </p>
        ) : (
          <ul className="mt-8 space-y-3">
            {saved.map((chapter) => {
              const seed = withMedia(chapter.seed);
              return (
                <li key={chapter.id}>
                  <Link
                    href={`/songs/${chapter.id}`}
                    className="flex items-center gap-3 rounded-sm border border-paper/10 bg-ink-soft/50 p-2.5 transition hover:border-amber-soft/40"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={seed.imageUrl}
                      alt=""
                      className="h-14 w-14 object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate font-display text-paper">
                        {chapter.stage}
                      </p>
                      <p className="truncate text-sm text-paper/50">
                        {chapter.mood}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
