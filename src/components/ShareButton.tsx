"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";

type ShareButtonProps = {
  title: string;
  text: string;
  url?: string;
  compact?: boolean;
};

export function ShareButton({
  title,
  text,
  url,
  compact = false,
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const shareUrl =
      url ?? (typeof window !== "undefined" ? window.location.href : "");

    track("share", { title });

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text, url: shareUrl });
        return;
      } catch {
        // cancelled
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
      className={
        compact ? "btn-secondary shrink-0 px-3.5 text-xs" : "btn-secondary"
      }
      aria-label={copied ? "Link copied" : "Share"}
    >
      {copied ? "Copied" : "Share"}
    </button>
  );
}
