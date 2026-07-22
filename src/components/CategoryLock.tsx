"use client";

import type { Category, CategoryId } from "@/data/categories";

type CategoryLockProps = {
  categories: Category[];
  locked: CategoryId | "all";
  onLock: (id: CategoryId | "all") => void;
  counts: Record<CategoryId | "all", number>;
};

export function CategoryLock({
  categories,
  locked,
  onLock,
  counts,
}: CategoryLockProps) {
  const options: { id: CategoryId | "all"; label: string; blurb: string }[] = [
    {
      id: "all",
      label: "All",
      blurb: "Every board on the wall.",
    },
    ...categories,
  ];

  const active = options.find((o) => o.id === locked) ?? options[0];

  return (
    <div className="space-y-3" role="tablist" aria-label="Board categories">
      <div className="category-rail">
        {options.map((option) => {
          const isActive = locked === option.id;
          return (
            <button
              key={option.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onLock(option.id)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition ${
                isActive
                  ? "border-paper bg-paper text-ink"
                  : "border-paper/15 bg-transparent text-paper/60 hover:border-paper/35 hover:text-paper"
              }`}
            >
              <span className="font-medium">{option.label}</span>
              <span
                className={`text-[11px] tabular-nums ${
                  isActive ? "text-ink/50" : "text-paper/35"
                }`}
              >
                {counts[option.id] ?? 0}
              </span>
            </button>
          );
        })}
      </div>
      <p className="text-[0.8rem] leading-relaxed text-paper/45 sm:text-sm">
        {locked === "all" ? (
          active.blurb
        ) : (
          <>
            <span className="text-paper/75">{active.label}</span>
            {" — "}
            {active.blurb}
          </>
        )}
      </p>
    </div>
  );
}
