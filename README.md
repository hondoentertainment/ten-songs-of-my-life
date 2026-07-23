# 9 Songs of My Life

A shareable **Pinterest-style mood board** of ten life-stage songs. Visitors browse visual pins, open a chapter board, and listen on Spotify or Apple Music. No visitor login.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Edit your ten songs

Content lives in [`src/data/chapters.ts`](src/data/chapters.ts).

For each chapter, set:

- `stage`, `mood`, `title`, `story`
- `seed` — the defining song
- `pins` — related tracks that appear on that mood board
- `moodTags` — keywords used by the enrich script
- optional `spotifyPlaylistUrl` / `appleMusicPlaylistUrl` for “Play this board”

Placeholder album art is generated as SVG until you run enrich (or paste real `imageUrl` values).

## Enrich pins (album art + listen links)

1. Copy `.env.example` → `.env.local` and fill Spotify credentials (Apple Music optional).
2. Run:

```bash
npm run enrich
```

This writes `src/data/chapters.enriched.json` with resolved Spotify/Apple IDs, artwork, and listen URLs. Review it, then merge fields into `chapters.ts`.

### Create backing playlists

```bash
npm run spotify:auth   # once — saves SPOTIFY_REFRESH_TOKEN
npm run enrich -- --create-playlists
```

Spotify playlist URLs are written into the enriched JSON. Apple Music playlist creation also needs `APPLE_MUSIC_USER_TOKEN` (from MusicKit authorize in a browser).

> Note: Spotify’s `/v1/recommendations` endpoint is unavailable for new apps. Enrich expands boards via catalog search, artist top tracks, and your curated pins instead.

## Deploy (Vercel)

1. Push this repo to GitHub.
2. Import the project in Vercel.
3. Set `NEXT_PUBLIC_SITE_URL` to your production URL (for OG tags).
4. Deploy. Enrich credentials are **not** required on Vercel unless you later add server routes that call the APIs.

## Project map

| Path | Role |
| --- | --- |
| `src/app/page.tsx` | Hero + home masonry board |
| `src/app/songs/[id]/page.tsx` | Chapter pin board |
| `src/components/SongPin.tsx` | Image pin + listen overlay |
| `src/components/MasonryBoard.tsx` | Pinterest-style columns |
| `scripts/enrich-board.ts` | Expand tracks, fetch art, optional playlists |
| `scripts/spotify-auth.ts` | One-time Spotify OAuth helper |

## Social sharing

Homepage and each chapter generate Open Graph images. After deploy, share a chapter URL in iMessage / X / Slack to preview the card. Set `NEXT_PUBLIC_SITE_URL` so absolute OG URLs resolve correctly.

## SEO

`sitemap.xml` (home + every chapter) and `robots.txt` are generated automatically from `src/app/sitemap.ts` and `src/app/robots.ts`. Both read `NEXT_PUBLIC_SITE_URL`, so set it in production for absolute URLs.

## Browsing

- **All songs** (`/all`) — the full track list across every chapter, each with Spotify/Apple links and per-board play links.
- **Keyboard navigation** — on a chapter page, `←` / `→` move to the previous/next chapter.
- **In-modal players** — when a pin has a resolved `spotifyId` or `appleId` (via enrich), the pin modal shows an embedded Spotify/Apple mini-player. Until then it falls back to the album art and listen buttons.

## Accessibility

- The pin modal closes on `Esc`, locks background scroll while open, and returns focus to the pin that opened it.
- Animations and smooth scrolling are disabled when the visitor sets `prefers-reduced-motion`.
