import { ImageResponse } from "next/og";
import { getChapter } from "@/data/chapters";

export const runtime = "edge";
export const alt = "Chapter mood board";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ChapterOgImage({ params }: Props) {
  const { id } = await params;
  const chapter = getChapter(id);

  const stage = chapter?.stage ?? "Mood board";
  const mood = chapter?.mood ?? "10 Songs of My Life";
  const title = chapter?.title ?? "A chapter of sound";
  const accent = chapter?.accent ?? "#d97706";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 56,
          background: `radial-gradient(ellipse 70% 55% at 70% 15%, ${accent}66, transparent 50%), linear-gradient(145deg, #1c1917 0%, #0c0a09 100%)`,
          color: "#f5efe6",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 20,
            letterSpacing: 5,
            textTransform: "uppercase",
            color: accent,
          }}
        >
          10 Songs of My Life
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 28, color: "#f5efe6aa" }}>
            {stage}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 72,
              lineHeight: 1,
              marginTop: 12,
              maxWidth: 900,
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              marginTop: 20,
              color: "#f5efe6cc",
            }}
          >
            {mood}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
