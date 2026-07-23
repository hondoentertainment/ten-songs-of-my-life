"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

type ChapterKeyboardNavProps = {
  prevHref?: string;
  nextHref?: string;
};

/**
 * Left/Right arrow keys move between chapters. Ignores keystrokes while the
 * user is typing in a field so it never hijacks form input.
 */
export function ChapterKeyboardNav({
  prevHref,
  nextHref,
}: ChapterKeyboardNavProps) {
  const router = useRouter();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable) {
        return;
      }

      if (event.key === "ArrowLeft" && prevHref) {
        router.push(prevHref);
      } else if (event.key === "ArrowRight" && nextHref) {
        router.push(nextHref);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router, prevHref, nextHref]);

  return null;
}
