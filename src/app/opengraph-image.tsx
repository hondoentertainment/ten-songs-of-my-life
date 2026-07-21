import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "9 Songs of My Life";
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
          justifyContent: "flex-end",
          padding: 64,
          background:
            "radial-gradient(ellipse 80% 60% at 40% 20%, #d9770666, transparent 55%), linear-gradient(160deg, #1c1917 0%, #0c0a09 100%)",
          color: "#f5efe6",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#f59e0b",
            marginBottom: 18,
          }}
        >
          Visual mood board
        </div>
        <div style={{ display: "flex", fontSize: 84, lineHeight: 0.95 }}>
          9 Songs of My Life
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontSize: 28,
            color: "#f5efe6aa",
            maxWidth: 720,
          }}
        >
          Ten stages. Ten moods. Tap a pin. Play the board.
        </div>
      </div>
    ),
    { ...size },
  );
}
