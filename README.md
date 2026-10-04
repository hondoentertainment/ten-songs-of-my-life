# 9 Songs of My Life

A shareable **3×3 mood board** for music lovers: preview 30s clips, open Spotify / Apple Music, lock categories, save boards, embed chapters, and **make your own Nine**.

**Live:** https://ten-songs-of-my-life.vercel.app

## Quick start

```bash
npm install
npm run enrich:itunes   # album art + 30s previews (public iTunes API)
npm run dev
```

## What you can do

| Feature | Where |
| --- | --- |
| 3×3 The Nine + category locks | `/` and `/?cat=energy` |
| Weekly mood drop | Banner on home (flag `weeklyDrop` in chapters) |
| 30s previews + Spotify / Apple | Pins + chapter pages |
| Save boards (local) | Heart → `/saved` |
| Make your own Nine | `/create` → `/my-nine` |
| Embed a board | `/embed/[id]` |
| Local listening stats | `/stats` |

## Content

Edit [`src/data/chapters.ts`](src/data/chapters.ts). Then refresh media:

```bash
npm run enrich:itunes
```

Writes [`src/data/media-cache.json`](src/data/media-cache.json) (artwork, preview URLs, Apple links).

Optional Spotify playlist creation (owner tooling):

```bash
npm run spotify:auth
npm run enrich -- --create-playlists
```

## Deploy

Push to GitHub; Vercel auto-deploys. Set `NEXT_PUBLIC_SITE_URL` to your production URL for OG tags.

## Project map

| Path | Role |
| --- | --- |
| `src/app/page.tsx` | Home board |
| `src/app/create/page.tsx` | Build your Nine |
| `src/app/embed/[id]/page.tsx` | Embeddable board |
| `src/app/api/itunes/search` | Catalog search |
| `scripts/enrich-itunes.ts` | Media cache builder |
| `PRD.md` | Product requirements |
