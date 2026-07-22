"use client";

import { useEffect, useState } from "react";
import { track } from "@/lib/analytics";
import { isFavorite, toggleFavorite } from "@/lib/favorites";

type FavoriteButtonProps = {
  id: string;
  compact?: boolean;
};

export function FavoriteButton({ id, compact = false }: FavoriteButtonProps) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    setOn(isFavorite(id));
  }, [id]);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const next = toggleFavorite(id);
        setOn(next);
        track("favorite_toggle", { id, on: next });
      }}
      className={
        compact
          ? `inline-flex h-9 w-9 items-center justify-center rounded-full border text-sm transition ${
              on
                ? "border-amber-soft/60 bg-amber-glow/20 text-amber-soft"
                : "border-paper/20 text-paper/55 hover:border-paper/40 hover:text-paper"
            }`
          : on
            ? "btn-primary"
            : "btn-secondary"
      }
      aria-pressed={on}
      aria-label={on ? "Remove from saved" : "Save board"}
      title={on ? "Saved" : "Save"}
    >
      {compact ? (on ? "♥" : "♡") : on ? "Saved" : "Save"}
    </button>
  );
}
