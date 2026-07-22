"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { track } from "@/lib/analytics";
import type { MediaHit } from "@/lib/itunes";
import { saveMyNine, type MyNineSlot } from "@/lib/my-nine";

const STAGE_HINTS = [
  "Childhood",
  "Teens",
  "Early twenties",
  "First love",
  "Heartbreak",
  "Building years",
  "Found family",
  "Solo chapter",
  "Right now",
];

export default function CreatePage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MediaHit[]>([]);
  const [loading, setLoading] = useState(false);
  const [slots, setSlots] = useState<MyNineSlot[]>([]);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remaining = 9 - slots.length;

  async function search(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim().length < 2) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/itunes/search?q=${encodeURIComponent(query.trim())}`,
      );
      const data = (await res.json()) as { results: MediaHit[] };
      setResults(data.results ?? []);
    } catch {
      setError("Search failed — try again.");
    } finally {
      setLoading(false);
    }
  }

  function addSong(hit: MediaHit) {
    if (slots.length >= 9) return;
    if (slots.some((s) => s.title === hit.title && s.artist === hit.artist)) {
      return;
    }
    const stage = STAGE_HINTS[slots.length];
    setSlots((prev) => [
      ...prev,
      { ...hit, stage, mood: "Your pick" },
    ]);
    setSaved(false);
  }

  function removeAt(index: number) {
    setSlots((prev) => prev.filter((_, i) => i !== index));
    setSaved(false);
  }

  function save() {
    if (slots.length !== 9) return;
    saveMyNine(slots);
    track("create_save", { count: 9 });
    setSaved(true);
  }

  const canSave = slots.length === 9;

  const filledLabel = useMemo(
    () => `${slots.length} / 9 squares`,
    [slots.length],
  );

  return (
    <main className="hero-wash min-h-screen">
      <div className="mx-auto max-w-[720px] px-3 pb-20 pt-[max(1.25rem,env(safe-area-inset-top))] sm:px-5 sm:pt-8">
        <SiteNav />
        <header className="mb-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-amber-soft/90">
            Build
          </p>
          <h1 className="mt-2 font-display text-3xl text-paper sm:text-4xl">
            Make your Nine
          </h1>
          <p className="mt-2 max-w-lg text-sm text-paper/55">
            Search the catalog, pick nine songs that map your life, save them on
            this device, and share your board.
          </p>
          <p className="mt-3 text-sm text-amber-soft/90">{filledLabel}</p>
        </header>

        <form onSubmit={search} className="flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search song or artist"
            className="min-h-11 flex-1 rounded-sm border border-paper/15 bg-ink-soft px-3 text-sm text-paper placeholder:text-paper/30 focus:border-amber-soft/50 focus:outline-none"
          />
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "…" : "Search"}
          </button>
        </form>
        {error && <p className="mt-2 text-sm text-red-300">{error}</p>}

        {results.length > 0 && (
          <ul className="mt-4 divide-y divide-paper/10 rounded-sm border border-paper/10">
            {results.map((hit) => (
              <li
                key={`${hit.appleId}-${hit.title}`}
                className="flex items-center gap-3 p-3"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={hit.imageUrl}
                  alt=""
                  className="h-12 w-12 rounded-sm object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-paper">{hit.title}</p>
                  <p className="truncate text-xs text-paper/50">{hit.artist}</p>
                </div>
                <button
                  type="button"
                  className="btn-secondary px-3 text-xs"
                  disabled={remaining <= 0}
                  onClick={() => addSong(hit)}
                >
                  Add
                </button>
              </li>
            ))}
          </ul>
        )}

        <section className="mt-8">
          <h2 className="font-display text-xl text-paper">Your squares</h2>
          <ol className="mt-3 space-y-2">
            {Array.from({ length: 9 }).map((_, i) => {
              const slot = slots[i];
              return (
                <li
                  key={i}
                  className="flex items-center gap-3 rounded-sm border border-paper/10 bg-ink-soft/40 p-2.5"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-sm bg-paper/10 text-xs tabular-nums text-paper/50">
                    {i + 1}
                  </span>
                  {slot ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={slot.imageUrl}
                        alt=""
                        className="h-10 w-10 object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-paper">
                          {slot.title}
                        </p>
                        <p className="truncate text-xs text-paper/45">
                          {STAGE_HINTS[i]} · {slot.artist}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="text-xs text-paper/40 hover:text-paper"
                        onClick={() => removeAt(i)}
                      >
                        Remove
                      </button>
                    </>
                  ) : (
                    <p className="text-sm text-paper/30">Empty square</p>
                  )}
                </li>
              );
            })}
          </ol>

          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              className="btn-primary"
              disabled={!canSave}
              onClick={save}
            >
              {saved ? "Saved" : "Save My Nine"}
            </button>
            {saved && (
              <Link href="/my-nine" className="btn-secondary">
                Open My Nine
              </Link>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
