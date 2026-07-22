"use client";

import { useEffect, useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { summarizeAnalytics } from "@/lib/analytics";

export default function StatsPage() {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    setCounts(summarizeAnalytics());
  }, []);

  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  return (
    <main className="hero-wash min-h-screen">
      <div className="mx-auto max-w-[720px] px-3 py-8 sm:px-5">
        <SiteNav />
        <h1 className="font-display text-3xl text-paper">Listening stats</h1>
        <p className="mt-2 text-sm text-paper/50">
          Stored only on this device. Previews, plays, saves, and shares.
        </p>
        {entries.length === 0 ? (
          <p className="mt-10 text-sm text-paper/45">
            No events yet — play a preview or open a board.
          </p>
        ) : (
          <ul className="mt-8 space-y-2">
            {entries.map(([name, count]) => (
              <li
                key={name}
                className="flex items-center justify-between rounded-sm border border-paper/10 px-3 py-2.5 text-sm"
              >
                <span className="text-paper/70">{name}</span>
                <span className="tabular-nums text-paper">{count}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
