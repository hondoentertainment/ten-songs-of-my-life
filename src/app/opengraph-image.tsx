import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "10 Songs of My Life";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
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
          background: "#0a0908",
          color: "#f7f2ea",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 18,
            letterSpacing: 7,
            textTransform: "uppercase",
            color: "#e8a317",
          }}
        >
          Mood board
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              display: "flex",
              fontSize: 72,
              lineHeight: 0.95,
              letterSpacing: -1,
            }}
          >
            10 Songs of My Life
          </div>
          <div style={{ display: "flex", fontSize: 28, color: "#f7f2ea99" }}>
            Nine squares. Tap a mood. Play the board.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            width: 180,
          }}
        >
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 56,
                height: 56,
                background:
                  i % 2 === 0
                    ? "linear-gradient(135deg, #e8a317, #2a241f)"
                    : "linear-gradient(135deg, #2a241f, #0a0908)",
              }}
            />
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
