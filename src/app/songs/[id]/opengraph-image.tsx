import { ImageResponse } from "next/og";
import { getChapter } from "@/data/chapters";
import { withMedia } from "@/lib/media";

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
  const accent = chapter?.accent ?? "#e8a317";
  const art = chapter ? withMedia(chapter.seed).imageUrl : undefined;
  const canUseArt = art && !art.startsWith("data:");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#0a0908",
          color: "#f7f2ea",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 630,
            height: 630,
            background: `linear-gradient(145deg, ${accent}, #0a0908)`,
          }}
        >
          {canUseArt ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={art}
              alt=""
              width={630}
              height={630}
              style={{ objectFit: "cover", width: 630, height: 630 }}
            />
          ) : null}
        </div>
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 48,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 16,
              letterSpacing: 5,
              textTransform: "uppercase",
              color: accent,
            }}
          >
            10 Songs of My Life
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 22, color: "#f7f2ea99" }}>
              {stage}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 52,
                lineHeight: 1.05,
                marginTop: 10,
                maxWidth: 480,
              }}
            >
              {title}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 24,
                marginTop: 16,
                color: "#f7f2eacc",
              }}
            >
              {mood}
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 18, color: "#f7f2ea66" }}>
            Preview · Spotify · Apple Music
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
