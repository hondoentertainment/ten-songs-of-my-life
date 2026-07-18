"use client";

import { useState } from "react";

type ShareButtonProps = {
  title: string;
  text: string;
  url?: string;
};

export function ShareButton({ title, text, url }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const shareUrl =
      url ?? (typeof window !== "undefined" ? window.location.href : "");

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text, url: shareUrl });
        return;
      } catch {
        // user cancelled or share failed — fall through to copy
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex items-center rounded-sm border border-paper/25 bg-ink-soft/60 px-3.5 py-2 text-sm text-paper/90 transition hover:border-amber-soft/50 hover:text-paper"
    >
      {copied ? "Link copied" : "Share board"}
    </button>
  );
}
