type StoryScrapProps = {
  stage: string;
  mood: string;
  title: string;
  story: string;
  delayMs?: number;
};

export function StoryScrap({
  stage,
  mood,
  title,
  story,
  delayMs = 80,
}: StoryScrapProps) {
  return (
    <aside
      className="masonry-item story-scrap animate-pin-in rounded-sm p-4 sm:p-5"
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-ink-soft/70">
        {stage} · {mood}
      </p>
      <h2 className="mt-2 font-display text-xl leading-snug text-ink-soft sm:text-2xl">
        {title}
      </h2>
      <p className="mt-3 font-body text-sm leading-relaxed text-ink-soft/85 sm:text-[0.95rem]">
        {story}
      </p>
    </aside>
  );
}
