# Site Update Instructions — Additive Changes Only

> **IMPORTANT:** These are incremental changes to the EXISTING site. Do NOT rebuild or erase anything. Apply each change surgically to the current codebase.

---

## Design Reference File

There is a new HTML design reference file at `picks-components.html` that shows the exact styling, markup, and interactivity for the new Picks section. It is in the same folder as this file. Use it as the visual source of truth for the Picks cards, filter tabs, and media type badges.

---

## Change 1 — Update the Navbar

**File:** The navbar component (likely `src/components/shared/Navbar.tsx` or wherever the nav links are defined).

**Current nav links:**
```
ABOUT · NEWS · VIDEOS · BOOKS · ARTICLES
```

**Change to:**
```
ABOUT · NEWS · TALKS · BOOKS · PICKS
```

**What's happening:**
- Rename "VIDEOS" → "TALKS" (same section, just a label change). Update the `href` from `#videos` or `/videos` to `#talks` or `/talks`.
- Add "PICKS" as a new nav item at the end, after "BOOKS". Its `href` should be `#picks` (for the homepage anchor) and its "See More..." link should go to `/picks`.
- Remove "ARTICLES" entirely from the nav — that section is being deleted.

---

## Change 2 — Restructure the Hero Section

**File:** The homepage hero component (likely `src/app/(public)/page.tsx` or `src/components/public/Hero.tsx`).

**Current structure (from localhost:3000):**
```
[CO-FOUNDER & CEO badge]
Pedro Ripper              ← giant 72px heading
Born in Rio de Janeiro, Brazil. Father of three.
Entrepreneur, investor, and co-founder & CEO of Bemobi (BMOB3)...
────────────── (divider)
BMOB3 | 50+ | 3 | 30+
```

**New structure:**
```
[CO-FOUNDER & CEO badge]

Building Bemobi, curating AI,     ← NEW primary heading (Playfair Display, same large size as before)
sharing what I read.

Pedro Ripper                       ← DEMOTED to secondary text (Inter, ~20px, font-weight 500, color #666)
Co-founder & CEO, Bemobi (BMOB3)  ← same line or line below, same secondary styling

Born in Rio de Janeiro, Brazil. Father of three.
Entrepreneur, investor, and technology builder for 30+ years.

────────────── (divider)
BMOB3 | 50+ | 3 | 30+
```

**Detailed changes:**

1. **Replace the giant "Pedro Ripper" heading** with a purpose-driven headline. Use the same Playfair Display font, same large size (72px / `text-7xl`), same weight. The text should be:
   ```
   Building Bemobi, curating AI, sharing what I read.
   ```
   This is now the first thing visitors read — it tells them what the site is about.

2. **Move "Pedro Ripper" below the headline** as secondary identification text. Style it as:
   - Font: Inter (the body font), ~20px / `text-xl`
   - Weight: 500 / `font-medium`
   - Color: `#666666` / same light gray as the existing role description
   - Include the title on the same line or directly below: "Co-founder & CEO, Bemobi (BMOB3)"
   - Add `mt-6 mb-2` spacing (24px top, 8px bottom)

3. **Keep the personal line** ("Born in Rio de Janeiro...") and the role description, but simplify them since the Bemobi info is now in the name/title line. Combine into something like:
   ```
   Born in Rio de Janeiro, Brazil. Father of three. Entrepreneur, investor, and technology builder for 30+ years.
   ```
   Same styling as current: light gray, regular weight, relaxed line height.

4. **Keep the divider and stats row exactly as they are.** No changes to BMOB3, 50+, 3, 30+.

5. **Keep the photo exactly where it is.** No changes to the right column.

---

## Change 3 — Rename "Talks & Interviews" Section

**File:** The Videos/Talks section component.

**Changes:**
1. Rename the section label from `WATCH` → `TALKS`
2. The title "Talks & Interviews" can stay as is, or change to "Talks & Appearances" — either works.
3. Update the section's `id` attribute from `id="videos"` to `id="talks"`
4. Update the "See More..." link from `/videos` to `/talks`
5. If there is a route at `src/app/(public)/videos/page.tsx`, rename the folder to `src/app/(public)/talks/page.tsx`

---

## Change 4 — Add the Picks Section (NEW)

**Insert this new section between the Books section and the Footer.** It goes AFTER Books, BEFORE Footer.

### 4a. Create the data model

**File:** `src/content/picks.json`

The `tags` field is an array that allows multiple topic tags per item. This enables future topic-based filtering (AI, Payments, Fintech, etc.) in addition to the media type filter.

```json
[
  {
    "id": "1",
    "title": "Sam Altman: The Future of AI, OpenAI, and the Meaning of Life",
    "source": "Lex Fridman Podcast",
    "mediaType": "video",
    "tags": ["AI"],
    "date": "2025-11-15",
    "duration": "1:42:08",
    "excerpt": "A deep conversation about the trajectory of artificial intelligence, the challenges of building safe AGI, and how AI will reshape every industry over the next decade.",
    "url": "https://youtube.com/example",
    "thumbnailGradient": "linear-gradient(135deg, #1a1a2e, #16213e)",
    "featured": true,
    "order": 0,
    "createdAt": "2025-11-15T00:00:00Z",
    "updatedAt": "2025-11-15T00:00:00Z"
  },
  {
    "id": "2",
    "title": "AI Agents Are Coming for Enterprise Software",
    "source": "All-In Podcast",
    "mediaType": "podcast",
    "tags": ["AI"],
    "date": "2025-12-01",
    "duration": "58:32",
    "excerpt": "The impact of autonomous AI agents on B2B software and why the current SaaS model is about to be disrupted.",
    "url": "https://example.com",
    "thumbnailGradient": "linear-gradient(135deg, #2d3436, #636e72)",
    "featured": true,
    "order": 1,
    "createdAt": "2025-12-01T00:00:00Z",
    "updatedAt": "2025-12-01T00:00:00Z"
  },
  {
    "id": "3",
    "title": "Generative AI's Act Two",
    "source": "Sequoia Capital",
    "mediaType": "article",
    "tags": ["AI"],
    "date": "2026-01-10",
    "excerpt": "Sequoia's framework for understanding where generative AI is headed after the initial hype cycle — and which companies will capture real value.",
    "url": "https://example.com",
    "thumbnailGradient": "linear-gradient(135deg, #0c3547, #1a6985)",
    "featured": true,
    "order": 2,
    "createdAt": "2026-01-10T00:00:00Z",
    "updatedAt": "2026-01-10T00:00:00Z"
  },
  {
    "id": "4",
    "title": "The Future of Cross-Border Payments in Latin America",
    "source": "a]6z Fintech",
    "mediaType": "article",
    "tags": ["Payments", "Fintech"],
    "date": "2025-10-20",
    "excerpt": "How new payment rails and regulatory shifts are enabling real-time cross-border transactions across Latin American markets.",
    "url": "https://example.com",
    "thumbnailGradient": "linear-gradient(135deg, #44403C, #78716C)",
    "featured": true,
    "order": 3,
    "createdAt": "2025-10-20T00:00:00Z",
    "updatedAt": "2025-10-20T00:00:00Z"
  },
  {
    "id": "5",
    "title": "NVIDIA: The Machine Learning Company",
    "source": "Acquired",
    "mediaType": "podcast",
    "tags": ["AI"],
    "date": "2025-09-15",
    "duration": "1:12:45",
    "excerpt": "The full story of how NVIDIA pivoted from gaming GPUs to becoming the foundational hardware layer for the entire AI revolution.",
    "url": "https://example.com",
    "thumbnailGradient": "linear-gradient(135deg, #1C1917, #57534E)",
    "featured": true,
    "order": 4,
    "createdAt": "2025-09-15T00:00:00Z",
    "updatedAt": "2025-09-15T00:00:00Z"
  }
]
```

### 4b. Add the TypeScript type

**File:** `src/lib/types.ts` (or wherever your existing content types are defined)

Add this alongside the existing types — do NOT replace them:

```typescript
export interface Pick {
  id: string;
  title: string;
  source: string;
  mediaType: 'video' | 'podcast' | 'article';
  tags: string[]; // e.g. ["AI"], ["Payments", "Fintech"]
  date: string;
  duration?: string; // only for video and podcast
  excerpt: string;
  url: string;
  thumbnailGradient: string;
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}
```

### 4c. Add content utility functions

**File:** `src/lib/content.ts` (or wherever your existing content read functions are)

Add these functions alongside the existing ones:

```typescript
import picksData from '@/content/picks.json';

export function getPicks(): Pick[] {
  return (picksData as Pick[]).sort((a, b) => a.order - b.order);
}

export function getFeaturedPicks(): Pick[] {
  return getPicks().filter(pick => pick.featured);
}
```

### 4d. Create the PickCard component

**File:** `src/components/shared/PickCard.tsx` (NEW file)

This card component is used both on the homepage and the dedicated page. Refer to `picks-components.html` for the exact CSS. Key design details:

- Each card has a thumbnail area with a CSS gradient background (from `thumbnailGradient`).
- **Media type badge** in the top-left corner of the thumbnail: pill-shaped, white/translucent background with backdrop-blur, contains a small icon + text ("Video", "Podcast", or "Article"). Icons:
  - Video: play triangle icon
  - Podcast: headphones icon
  - Article: document/file icon
- **Play button overlay**: centered on the thumbnail for video and podcast types only. White circle, becomes gold (#C8A251) on hover.
- **Duration badge**: bottom-right of thumbnail for video and podcast only. Dark semi-transparent background, white text, monospace-ish.
- **Card body**: source (gold, uppercase, small), title (Playfair Display, serif), excerpt (gray, optional — shown when there's room), and a CTA link that says "Watch" / "Listen" / "Read" depending on `mediaType`.
- Standard card styling matching the existing site: `border: 1px solid #E5E5E5`, `border-radius: 16px`, white background, hover shadow `0 16px 48px rgba(0,0,0,0.06)`, hover `translateY(-4px)`, transition `cubic-bezier(0.16, 1, 0.3, 1)`.

### 4e. Add the Picks homepage section

**File:** The homepage (`src/app/(public)/page.tsx`)

Insert a new section **after** the Books section and **before** the Footer. Use the same section structure pattern as News, Talks, and Books:

```
Section label: "CURATED BY PEDRO" (gold, uppercase, with gold line before it)
Title: "Picks" (Playfair Display)
Subtitle: "Podcasts, videos, and articles on AI, payments, and technology that I find worth sharing."
"See More..." link aligned to the right → href="/picks"
```

**Layout:** Asymmetric bento grid. The FIRST featured card spans 2 columns and 2 rows. The remaining 4 cards fill the right column, 2 rows of 2. See the grid in `picks-components.html` for the exact CSS grid structure:

```css
grid-template-columns: 1fr 1fr 1fr;
/* First child: grid-column: span 2; grid-row: span 2; */
```

Load data using `getFeaturedPicks()` — show only featured items (up to 5).

The section id should be `id="picks"`.

### 4f. Create the dedicated /picks page

**File:** `src/app/(public)/picks/page.tsx` (NEW file)

This page shows ALL picks content (not just featured) with filter tabs. Structure:

1. **Back link** — "← Back to home" linking to `/`
2. **Page header** — label "CURATED BY PEDRO", title "Picks" (large, ~56px Playfair), description: "Podcasts, videos, and articles on AI, payments, and technology that I find worth sharing."
3. **Filter tabs** — horizontal row of buttons: "All (N)", "Videos (N)", "Podcasts (N)", "Articles (N)" where N is the count of items per type. Active tab has a gold underline bar (2px). Tabs sit on top of a 1px border-bottom line. See `picks-components.html` for the exact filter tab CSS and JavaScript interactivity.
4. **Grid** — uniform 3-column grid of PickCard components (`grid-template-columns: repeat(3, 1fr); gap: 24px`). No featured/bento layout here — all cards are equal size.
5. **Filtering** — when a tab is clicked, cards that don't match the selected `mediaType` fade out and hide. Cards that match fade in with a slide-up animation. The "All" tab shows everything. This should be a client component (`'use client'`) since it has interactivity.

Responsive: 2 columns on tablet, 1 column on mobile. Tabs should horizontally scroll on mobile.

### 4g. Add the API route for Picks

**File:** `src/app/api/admin/picks/route.ts` (NEW)
**File:** `src/app/api/admin/picks/[id]/route.ts` (NEW)

Follow the exact same pattern as the existing News or Books API routes. Provide GET (list all), POST (create), PUT (update), DELETE (remove) operations that read/write to `src/content/picks.json`. Protect with the same admin auth check as the other routes.

### 4h. Add the admin CRUD pages for Picks

**File:** `src/app/(admin)/admin/picks/page.tsx` (list view — NEW)
**File:** `src/app/(admin)/admin/picks/new/page.tsx` (create — NEW)
**File:** `src/app/(admin)/admin/picks/[id]/page.tsx` (edit — NEW)

Follow the exact same pattern as the existing admin pages for News or Books:
- **List view**: table with columns: Title, Source, Media Type, Tags, Featured (toggle), Actions (edit/delete)
- **Create/Edit form**: fields for all properties in the Pick type. The `mediaType` field should be a dropdown select with options: "video", "podcast", "article". The `tags` field should be a text input where tags are comma-separated (e.g. "AI, Payments") — parse into an array on save. The `duration` field should only be visible/required when mediaType is "video" or "podcast".
- **Featured toggle**: same toggle switch component used in other admin sections

Add "Picks" to the admin sidebar navigation, between Books and Settings (or wherever makes sense in the existing admin nav order).

---

## Change 5 — Delete the Articles Section

### 5a. Remove from homepage

**File:** `src/app/(public)/page.tsx`

Delete the entire "Articles Worth Reading" section (the numbered editorial list with items 01–05). Remove the section, its data loading, and its import.

### 5b. Remove the dedicated page

**File:** Delete `src/app/(public)/articles/page.tsx` (and the `articles/` folder)

### 5c. Remove the API routes

**File:** Delete `src/app/api/admin/articles/route.ts` and `src/app/api/admin/articles/[id]/route.ts`
**File:** Delete `src/app/api/content/articles/route.ts` if it exists

### 5d. Remove from admin

**File:** Delete `src/app/(admin)/admin/articles/` folder entirely
**File:** Remove "Articles" from the admin sidebar navigation

### 5e. Remove the data file

**File:** Delete `src/content/articles.json`

### 5f. Remove the type

**File:** `src/lib/types.ts` — remove the `Article` interface
**File:** `src/lib/content.ts` — remove `getArticles()`, `getFeaturedArticles()`, and the articles import

### 5g. Clean up any imports

Search the codebase for any remaining references to "articles", "Article", or "getArticles" and remove them. Components like `ArticleRow` can be deleted if they exist.

---

## Change 6 — Update Section Order on Homepage

After all changes, the homepage sections should appear in this exact order:

```
1. Hero (restructured: purpose headline first, name/title secondary)
2. About
3. News (press about Pedro and Bemobi) — "See More..." → /news
4. Talks (Pedro's video appearances) — "See More..." → /talks
5. Books (reading list) — "See More..." → /books
6. Picks (curated content: AI, payments, fintech) — "See More..." → /picks
7. Footer
```

**Navbar order:** `ABOUT · NEWS · TALKS · BOOKS · PICKS`

**Section IDs:** `#about`, `#news`, `#talks`, `#books`, `#picks`

---

## Summary Checklist

- [ ] Navbar updated: ABOUT · NEWS · TALKS · BOOKS · PICKS
- [ ] Hero restructured: purpose headline first ("Building Bemobi, curating AI, sharing what I read."), name/title demoted to secondary text below it
- [ ] Videos section renamed to Talks (label, id, route)
- [ ] Picks section added to homepage (bento grid, 5 featured cards)
- [ ] Picks dedicated page created at /picks (filter tabs, 3-col grid)
- [ ] Picks data model created with `tags` field for topic tagging (AI, Payments, Fintech)
- [ ] Picks TypeScript type, content utils added
- [ ] Picks admin CRUD pages added (with mediaType dropdown and tags input)
- [ ] Picks API routes added
- [ ] Picks added to admin sidebar nav
- [ ] Articles section removed from homepage
- [ ] Articles dedicated page deleted
- [ ] Articles API routes deleted
- [ ] Articles admin pages deleted
- [ ] Articles data file deleted
- [ ] Articles type and content utils removed
- [ ] All "articles" references cleaned up from codebase
- [ ] Homepage section order verified: Hero → About → News → Talks → Books → Picks → Footer
