type StoryScrapProps = {
  stage: string;
  mood: string;
  title: string;
  story: string;
};

export function StoryScrap({ stage, mood, title, story }: StoryScrapProps) {
  return (
    <aside className="story-block animate-fade-up rounded-sm p-5 sm:p-7">
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink/45">
        {stage} · {mood}
      </p>
      <h2 className="mt-2.5 font-display text-[1.55rem] leading-[1.15] tracking-tight text-ink sm:text-[1.85rem] text-balance">
        {title}
      </h2>
      <p className="mt-3 max-w-2xl text-[0.95rem] leading-relaxed text-ink/75 sm:text-base">
        {story}
      </p>
    </aside>
  );
}
