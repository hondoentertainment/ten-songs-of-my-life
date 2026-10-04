import { Suspense } from "react";
import { HomeBoard } from "@/components/HomeBoard";
import { ShareButton } from "@/components/ShareButton";
import { SiteNav } from "@/components/SiteNav";
import { categories } from "@/data/categories";
import { chapters } from "@/data/chapters";
import { getWeeklyDrop } from "@/data/weekly";

export default function HomePage() {
  const weekly = getWeeklyDrop();

  return (
    <main className="hero-wash min-h-screen">
      <div className="mx-auto flex min-h-[100dvh] max-w-[720px] flex-col px-3 pb-16 pt-[max(1.25rem,env(safe-area-inset-top))] sm:px-5 sm:pb-20 sm:pt-8">
        <header className="animate-fade-up shrink-0 pb-4 sm:pb-5">
          <SiteNav />
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-amber-soft/90 sm:text-[11px]">
                For music lovers
              </p>
              <h1 className="mt-2 font-display text-[clamp(1.85rem,7vw,2.75rem)] leading-[0.98] tracking-tight text-paper text-balance">
                9 Songs of My Life
              </h1>
              <p className="mt-3 max-w-md text-[0.9rem] leading-relaxed text-paper/55 sm:text-[0.95rem]">
                Nine squares for life’s stages—preview a clip, open Spotify or
                Apple Music, or build your own Nine.
              </p>
            </div>
            <ShareButton
              title="9 Songs of My Life"
              text="Nine squares for the songs of a life."
              compact
            />
          </div>
        </header>

        <div
          className="animate-fade-up flex-1"
          style={{ animationDelay: "100ms" }}
        >
          <Suspense
            fallback={
              <p className="py-10 text-sm text-paper/40">Loading board…</p>
            }
          >
            <HomeBoard
              chapters={chapters}
              categories={categories}
              weekly={weekly}
            />
          </Suspense>
        </div>

        <footer className="mt-12 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-paper/10 pt-6 text-[11px] tracking-wide text-paper/30">
          <a href="/create" className="hover:text-paper/60">
            Make your Nine
          </a>
          <span>·</span>
          <a href="/saved" className="hover:text-paper/60">
            Saved boards
          </a>
          <span>·</span>
          <span>Share · preview · play</span>
        </footer>
      </div>
    </main>
  );
}
