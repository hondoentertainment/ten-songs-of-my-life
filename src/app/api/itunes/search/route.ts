import { NextResponse } from "next/server";
import { searchItunesSongs, toMediaHit } from "@/lib/itunes";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const songs = await searchItunesSongs(q, 10);
    return NextResponse.json({
      results: songs.map(toMediaHit),
    });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message, results: [] },
      { status: 502 },
    );
  }
}
