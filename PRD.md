# Product Requirements Document  
**9 Songs of My Life**

| Field | Value |
| --- | --- |
| Status | Shipped (v0.1) — iterate |
| Owner | Kyle |
| Live URL | https://ten-songs-of-my-life.vercel.app |
| Repo | https://github.com/hondoentertainment/ten-songs-of-my-life |
| Last updated | 2026-07-19 |

---

## 1. Summary

**9 Songs of My Life** is a shareable personal website that presents life stages and moods as a **3×3 square mood board** (nine core songs), with extra lockable category boards beyond the nine. Each board is anchored by a seed song, expanded with related tracks as album-art pins, and opens for listening on **Spotify** or **Apple Music**.

Visitors do not create accounts. The owner curates content; the site is built for browsing, locking into a mood category, and sharing chapters on social media.

---

## 2. Problem

People already have “songs of their life,” but those songs usually live as:

- Private playlists with no story
- Scattered memories with no visual form
- Hard-to-share lists that don’t look good in a social preview

There is no lightweight way to turn a life soundtrack into a **beautiful, shareable collage** that still connects to real listening apps.

---

## 3. Goals

### Primary goals

1. Let the owner express **nine core life-stage songs** (plus extra mood boards) as a visual product.
2. Make each board **instantly playable** on Spotify and Apple Music.
3. Make every chapter **shareable** with intentional Open Graph / social cards.
4. Let visitors **lock into a category** (The Nine, Heart, Energy, Places, Rituals) and go deep.

### Non-goals (v0.x)

- Visitor accounts, comments, or social graph
- In-browser full streaming player (beyond deep links / overlays)
- Multi-user “create your own board” SaaS (may be later)
- Real-time collaborative playlist editing
- Relying on Spotify’s deprecated `/v1/recommendations` API

---

## 4. Target users

| Persona | Need | Success looks like |
| --- | --- | --- |
| **Owner (Kyle)** | Curate life/mood boards and share them | Edits content, enriches art/links, posts a chapter URL |
| **Friend / follower** | Feel the story and listen quickly | Opens shared link → browses pins → plays on Spotify/Apple Music |
| **Casual social visitor** | Understand the brand in one glance | Hero + board reads clearly; OG card looks intentional |

---

## 5. Product principles

1. **Board first, playlist second** — The UI is a collage of pins, not a track list.
2. **Brand first** — “9 Songs of My Life” is the hero signal on first viewport.
3. **One composition** — Home is one atmospheric experience, not a dashboard.
4. **Listen without friction** — No visitor login; deep links only.
5. **Share-ready** — Every chapter has unique title, description, and OG image.
6. **Lock to focus** — Categories narrow the board so moods don’t compete.

---

## 6. Core concepts

| Concept | Definition |
| --- | --- |
| **Seed song** | The defining track for a chapter; hero pin on home and chapter boards |
| **Chapter / board** | A stage + mood + story + seed + related pins |
| **Pin** | Visual tile (album art) for a track; opens listen overlay |
| **Category lock** | Filter that shows only boards in a chosen lane |
| **The Nine** | Core life-stage chapters in a 3×3 square grid (category: `timeline`) |
| **Enrich** | Owner-side script that resolves catalog IDs, artwork, and optional playlists |

---

## 7. Information architecture

```
/                          Home: hero + category lock + masonry board
/songs/[id]                Chapter board: story scrap + pins + listen/share
/opengraph-image           Home share card
/songs/[id]/opengraph-image Chapter share card
```

**Content source of truth:** `src/data/chapters.ts`  
**Category taxonomy:** `src/data/categories.ts`

---

## 8. Feature requirements

### 8.1 Home — brand + board (shipped)

| ID | Requirement | Priority |
| --- | --- | --- |
| H1 | Full-bleed atmospheric hero with brand name dominant | P0 |
| H2 | One supporting line + primary CTA to the board | P0 |
| H3 | Native share / copy-link control | P0 |
| H4 | 3×3 square grid of nine core chapter pins (image-first) | P0 |
| H5 | Pin caption = stage; subcaption = mood | P0 |
| H6 | Tap pin → navigate to chapter board | P0 |

### 8.2 Category lock (shipped)

| ID | Requirement | Priority |
| --- | --- | --- |
| C1 | Categories: All, The Nine, Heart, Energy, Places, Rituals | P0 |
| C2 | Locking filters visible pins to that category | P0 |
| C3 | Show count per category | P0 |
| C4 | Locked state shows short blurb for the lane | P0 |
| C5 | Chapters may belong to multiple categories | P0 |

### 8.3 Chapter board (shipped)

| ID | Requirement | Priority |
| --- | --- | --- |
| B1 | Story scrap mixed into the masonry board | P0 |
| B2 | Seed + related tracks as pins | P0 |
| B3 | Pin overlay with Spotify + Apple Music actions | P0 |
| B4 | Board-level “Play on Spotify / Apple Music” | P0 |
| B5 | Share board control | P0 |
| B6 | Prev / next chapter navigation | P0 |
| B7 | Show pin index + category labels | P1 |

### 8.4 Listening & playlists (shipped / owner tooling)

| ID | Requirement | Priority |
| --- | --- | --- |
| L1 | Per-pin deep links (track URL or search fallback) | P0 |
| L2 | Prefer stored playlist URLs when present | P0 |
| L3 | Owner enrich script: resolve Spotify tracks + artwork | P0 |
| L4 | Owner enrich: Apple Music match by ISRC / title+artist | P1 |
| L5 | Optional Spotify playlist create via OAuth refresh token | P1 |
| L6 | Optional Apple library playlist create via Music User Token | P2 |
| L7 | Expand related tracks without Spotify Recommendations API | P0 |

### 8.5 Social / SEO (shipped)

| ID | Requirement | Priority |
| --- | --- | --- |
| S1 | Unique metadata per chapter | P0 |
| S2 | Generated OG images (home + chapter) | P0 |
| S3 | `NEXT_PUBLIC_SITE_URL` for absolute OG URLs | P0 |

### 8.6 Content model (shipped)

Each chapter includes:

- Identity: `id`, `number`, `stage`, `mood`, `title`, `story`, `accent`
- Taxonomy: `categories[]`, `moodTags[]`
- Media: `seed`, `pins[]` (title, artist, optional IDs, `imageUrl`, `pinHeight`, listen URLs)
- Listen board: optional `spotifyPlaylistUrl`, `appleMusicPlaylistUrl`
- Art direction: optional `coverHint`

**Current content volume (v0.1):** 20 chapters (9 core timeline squares + expanded mood boards).

---

## 9. User journeys

### Journey A — Owner publishes a personal board

1. Edit `chapters.ts` with real seed songs, stories, and pins  
2. Run `npm run enrich` (optional `--create-playlists`)  
3. Merge enriched art/IDs/URLs  
4. Deploy / push to main  
5. Share home or chapter URL on social

### Journey B — Visitor locks into a mood

1. Lands on home from a shared link  
2. Locks **Energy** (or another category)  
3. Opens a pin (e.g. Late night)  
4. Reads story scrap, taps a pin, opens Spotify  
5. Shares the chapter with a friend

### Journey C — Social preview

1. Owner posts `/songs/first-love`  
2. Preview shows chapter OG image + title/mood  
3. Tap opens chapter board directly

---

## 10. UX & visual requirements

| Area | Spec |
| --- | --- |
| Layout metaphor | 3×3 square grid for The Nine; square tiles for other locks — not playlist tables |
| First viewport | Brand, one line, one CTA group, atmospheric background |
| Typography | Expressive display + readable body (Fraunces + Outfit) |
| Palette | Deep ink, warm paper, amber accent, grain overlay |
| Motion | Hero fade-up, pin cascade, subtle hover lift (2–3 motions) |
| Mobile | Usable masonry (2 columns), large tap targets, overlay works on small screens |
| Avoid | Purple-gradient AI look, cream/serif/terracotta cliché, broadsheet density, hero card stacks |

---

## 11. Technical requirements

| Area | Spec |
| --- | --- |
| Stack | Next.js App Router, TypeScript, Tailwind |
| Hosting | Vercel production; GitHub source of truth |
| Auth (visitors) | None |
| Auth (owner tools) | Spotify OAuth refresh token; Apple MusicKit developer + user tokens for enrich only |
| Secrets | Never ship enrich credentials to the client; keep in `.env.local` / local scripts |
| Images | Remote patterns for Spotify + Apple CDN; SVG placeholders until enrich |
| Performance | Static generation for chapter routes; light client components for lock + overlays |

---

## 12. Success metrics

| Metric | Target (directional) |
| --- | --- |
| Time-to-first-listen | Visitor reaches Spotify/Apple within 2 taps from a chapter |
| Share quality | OG preview shows brand + chapter mood (manual check) |
| Category engagement | ≥40% of home sessions use a non-All lock (when analytics added) |
| Owner publish time | Replace placeholder Nine + redeploy in &lt;1 hour |
| Mobile usability | Full journey completable on phone without horizontal scroll bugs |

---

## 13. Risks & constraints

| Risk | Mitigation |
| --- | --- |
| Spotify Recommendations / related-artists deprecated | Use curated pins + search + artist top tracks |
| Apple playlist create needs Music User Token | Allow manual playlist URL paste; enrich remains optional |
| Placeholder art looks unfinished | Run enrich or paste real `imageUrl` before major shares |
| Content quality depends on owner | Clear schema + README; keep stories short (2–4 sentences) |
| Brand says “9” and core visual is 9 squares | Brand and board stay aligned |

---

## 14. Roadmap

### Now (v0.1) — done

- [x] Mood-board home + chapter boards  
- [x] Category lock (5 lanes)  
- [x] Spotify / Apple listen deep links  
- [x] Share + OG images  
- [x] Enrich / playlist owner scripts  
- [x] Deploy to GitHub + Vercel  

### Next (v0.2) — shipped in app

- [x] iTunes enrich for artwork + 30s previews (`npm run enrich:itunes`)  
- [x] Play-first pins (preview + Spotify)  
- [x] Category lock in URL (`?cat=energy`)  
- [x] Similar boards on chapter pages  
- [x] Favorites (local) + `/saved`  
- [x] Embed mode `/embed/[id]`  
- [x] Make your own Nine `/create` → `/my-nine`  
- [x] Weekly mood drop banner  
- [x] Local analytics `/stats`  
- [ ] Replace curated Nine with Kyle’s personal songs + stories  
- [ ] Custom domain  

### Later (v1)

- [ ] Accounts / sync My Nine across devices  
- [ ] CMS or admin UI instead of editing TypeScript  
- [ ] Accessibility audit pass (focus order, reduced motion, alt text)  

---

## 15. Acceptance criteria (v0.1)

1. Visitor can open production site and see brand-forward hero.  
2. Visitor can lock each category and see a filtered board.  
3. Visitor can open any chapter, read the story, and launch Spotify or Apple Music from a pin.  
4. Sharing home or chapter produces a distinct OG image preview.  
5. Owner can edit chapters in `chapters.ts` and redeploy without code changes beyond content.  
6. Owner can run enrich locally with documented env vars.

---

## 16. Open questions

1. Should “The Nine” remain exactly nine forever, or become “my core set” of N?  
2. Do expanded boards (11–20) stay owner-curated only, or become templates others fork?  
3. Is in-page MusicKit / Spotify embed playback desirable, or are deep links enough?  
4. Should category-locked views be first-class share URLs?

---

## 17. Appendix — category definitions

| ID | Label | Intent |
| --- | --- | --- |
| `timeline` | The Nine | Core life-stage soundtrack (3×3) |
| `heart` | Heart | Love, loss, people, tenderness |
| `energy` | Energy | Drive, fire, nights, catharsis |
| `places` | Places | Rooms, roads, cities, travel |
| `rituals` | Rituals | Recurring moods and daily loops |

---

## 18. Appendix — key files

| Path | Role |
| --- | --- |
| `src/app/page.tsx` | Home hero |
| `src/components/HomeBoard.tsx` | Category lock + masonry |
| `src/components/CategoryLock.tsx` | Lock UI |
| `src/app/songs/[id]/page.tsx` | Chapter board |
| `src/components/SongPin.tsx` | Pin + listen overlay |
| `src/data/chapters.ts` | Content |
| `src/data/categories.ts` | Taxonomy |
| `scripts/enrich-board.ts` | Catalog enrich + optional playlists |
| `README.md` | Operator docs |
