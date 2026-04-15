# pedroripper.com — Architecture & Developer Guide

> Complete documentation for the Pedro Ripper personal website.
> Last updated: April 2026.

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Getting Started](#getting-started)
4. [Project Structure](#project-structure)
5. [Architecture](#architecture)
6. [Data Model](#data-model)
7. [Content Layer (Storage)](#content-layer)
8. [Authentication](#authentication)
9. [API Reference](#api-reference)
10. [Admin Panel](#admin-panel)
11. [Public Pages](#public-pages)
12. [Design System](#design-system)
13. [Deployment](#deployment)
14. [Common Tasks](#common-tasks)
15. [Troubleshooting](#troubleshooting)

---

## Overview

A personal website and CMS for Pedro Ripper (Co-founder & CEO). The site has two sides:

- **Public site** (`pedroripper.com`) — Homepage with curated content sections (Insights, Picks, Books, Talks, News), plus dedicated pages for each section.
- **Admin panel** (`pedroripper.com/admin`) — Password-protected CMS to manage all content via drag-and-drop lists, forms with metadata auto-fill, and YouTube playlist import.

All content is stored as JSON — locally on the filesystem during development, and in Vercel Blob in production. There is no traditional database.

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.2.2 |
| Language | TypeScript | 5.x |
| UI | React | 19.x |
| Styling | Tailwind CSS | 4.x |
| Storage (prod) | Vercel Blob | 2.3.x |
| Storage (dev) | Local JSON files | — |
| Auth | HMAC-signed cookies | Custom |
| Drag & Drop | @hello-pangea/dnd | 18.x |
| Markdown | react-markdown | 10.x |
| Analytics | @vercel/analytics | 2.x |
| Performance | @vercel/speed-insights | 2.x |
| Testing | Jest + React Testing Library | 30.x |
| Hosting | Vercel | — |

### External APIs

- **YouTube Data API v3** — Video metadata extraction, playlist import
- **Google Books API** — Book search and auto-fill
- **Open Library** — Book cover images

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- Vercel CLI (`npm i -g vercel`)

### Setup

```bash
# Clone the repo
git clone https://github.com/pripper2007/my-first-site.git
cd my-first-site

# Install dependencies
npm install

# Pull environment variables from Vercel
vercel link
vercel env pull

# Or create .env.local manually:
# ADMIN_PASSWORD=<your-password>
# YOUTUBE_API_KEY=<your-youtube-api-key>
# BLOB_READ_WRITE_TOKEN=<your-blob-token>   (optional for local dev)

# Start development server
npm run dev
```

### Available Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server on localhost:3000 |
| `npm run build` | Production build |
| `npm run start` | Start production server locally |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Jest tests |

---

## Project Structure

```
src/
├── app/
│   ├── (public)/              # Public pages (grouped layout)
│   │   ├── page.tsx           # Homepage
│   │   ├── layout.tsx         # Public layout (Navbar, Footer, Particles)
│   │   ├── about/page.tsx
│   │   ├── picks/page.tsx
│   │   ├── books/page.tsx
│   │   ├── news/page.tsx
│   │   ├── talks/page.tsx
│   │   ├── insights/page.tsx
│   │   └── insights/[slug]/page.tsx
│   │
│   ├── admin/                 # Admin panel (protected)
│   │   ├── layout.tsx         # Admin layout (sidebar nav)
│   │   ├── page.tsx           # Dashboard
│   │   ├── login/page.tsx
│   │   ├── picks/             # CRUD pages for each content type
│   │   ├── books/
│   │   ├── news/
│   │   ├── videos/
│   │   └── insights/
│   │
│   ├── api/admin/             # API routes (all require auth)
│   │   ├── login/route.ts
│   │   ├── logout/route.ts
│   │   ├── settings/route.ts
│   │   ├── seed-blob/route.ts
│   │   ├── picks/             # CRUD + fetch-meta + import-playlist
│   │   ├── books/             # CRUD + search + import
│   │   ├── news/              # CRUD + fetch-meta
│   │   ├── videos/            # CRUD
│   │   ├── insights/          # CRUD
│   │   └── bio/               # GET + PUT
│   │
│   ├── layout.tsx             # Root layout (fonts, analytics, metadata)
│   ├── globals.css            # CSS variables, design tokens
│   ├── robots.ts              # SEO robots.txt
│   └── sitemap.ts             # Dynamic XML sitemap
│
├── components/
│   ├── admin/                 # Forms, tables, import UIs
│   ├── public/                # Section components, cards, modals
│   └── shared/                # Navbar, Footer, SectionHeader, etc.
│
├── lib/
│   ├── types.ts               # All TypeScript interfaces
│   ├── content.ts             # Storage layer (Blob + filesystem)
│   ├── auth.ts                # HMAC session auth
│   ├── youtube.ts             # YouTube helpers
│   └── proxy.ts               # Route protection middleware
│
├── content/                   # JSON data files (source of truth for dev)
│   ├── picks.json
│   ├── books.json
│   ├── news.json
│   ├── videos.json
│   ├── insights.json
│   ├── bio.json
│   └── settings.json
│
└── __tests__/                 # Jest tests

public/
├── images/                    # Static images (OG, profile, covers)
├── articles/                  # Pre-rendered HTML articles
└── videos/                    # Hero portrait video
```

---

## Architecture

### Request Flow

```
Browser → Vercel CDN → Next.js App Router
                            │
                ┌───────────┴───────────┐
                │                       │
         Public Pages              Admin Pages
         (Server Components)       (Server Components)
                │                       │
                │                  Auth Check
                │                  (middleware + API)
                │                       │
                └───────────┬───────────┘
                            │
                     Content Layer
                     (content.ts)
                            │
               ┌────────────┴────────────┐
               │                         │
        Vercel Blob                Local Filesystem
        (production)               (development)
```

### Key Design Decisions

1. **JSON storage over a database** — Simple CRUD for a single-admin personal site. No migrations, no ORM, no connection pooling. Content lives as JSON arrays in Vercel Blob (production) or local files (development).

2. **Dual storage backend** — `content.ts` checks for `BLOB_READ_WRITE_TOKEN` at startup. If set, all reads/writes go to Vercel Blob. Otherwise, local filesystem. The rest of the codebase is unaware of the backend.

3. **Server Components by default** — All pages are Server Components. Client Components (`"use client"`) are used only for interactivity: forms, modals, drag-and-drop, animations.

4. **HMAC auth without a database** — Sessions are stateless. A cookie contains `{nonce}.{hmac_signature}`, verified server-side using the admin password as the HMAC key.

5. **Batch reordering** — Drag-and-drop sends all items' order values in a single PATCH to avoid race conditions from concurrent read-modify-write cycles.

---

## Data Model

All content types share common fields:

```typescript
{
  id: string;          // UUID v4, auto-generated
  visible?: boolean;   // Controls public visibility (default: true)
  featured: boolean;   // Shows on homepage featured section
  order: number;       // Sort position (0 = first)
  createdAt: string;   // ISO 8601 timestamp
  updatedAt: string;   // ISO 8601 timestamp
}
```

### Content Types

| Type | File | Key Fields |
|------|------|------------|
| **Pick** | picks.json | title, source, mediaType (`video`/`podcast`/`article`/`channel`), url, excerpt, date, duration, thumbnailUrl, channelName, channelUrl, embedUrl, viewCount, tags[] |
| **BookItem** | books.json | title, author, tag, description, coverImage, amazonUrl, notes, publishedDate |
| **NewsItem** | news.json | title, source, date, excerpt, url, imageUrl, thumbnailUrl, categories[], tags[] |
| **VideoItem** | videos.json | title, description, type (`keynote`/`panel`/`interview`/`podcast`), event, date, duration, youtubeUrl, embedUrl, channelName |
| **Insight** | insights.json | title, titlePt, slug, content (Markdown), contentPt, excerpt, excerptPt, language, coverImage, tags[], date, readingTime |
| **Bio** | bio.json | paragraphs[], highlights[] (icon, title, description), stats[] (value, label) |
| **Settings** | settings.json | name, role, tagline, social (linkedin, x), meta (title, description), youtubePlaylistUrl |

Full type definitions: `src/lib/types.ts`

---

## Content Layer

**File**: `src/lib/content.ts`

### How it works

The content layer provides CRUD functions for each content type. Internally, it uses two low-level helpers:

```
readJsonFile(filename)   → reads from Blob or filesystem
writeJsonFile(filename)  → writes to Blob or filesystem
```

The backend is chosen automatically:

| Environment | `BLOB_READ_WRITE_TOKEN` | Backend |
|-------------|------------------------|---------|
| Production (Vercel) | Set | Vercel Blob |
| Preview (Vercel) | Set | Vercel Blob |
| Local dev | Not set | `src/content/*.json` |
| Local dev | Set (via `vercel env pull`) | Vercel Blob |

### Function naming convention

Each content type has the same set of functions:

| Function | Returns | Used by |
|----------|---------|---------|
| `getAllX()` | All items (including hidden), sorted by order | Admin pages |
| `getX()` | Visible items only | Public pages |
| `getFeaturedX(limit)` | Visible + featured items | Homepage |
| `getXById(id)` | Single item or null | Edit pages |
| `createX(item)` | Created item with id + timestamps | Create form |
| `updateX(id, updates)` | Updated item or null | Edit form |
| `deleteX(id)` | boolean | Delete button |
| `reorderX(orders)` | void | Drag-and-drop |

### Blob storage details

- **Blob paths**: `content/picks.json`, `content/books.json`, etc.
- **Access**: Public (content is already public on the website)
- **Overwrite**: `allowOverwrite: true` (required by Vercel Blob for updates)
- **Reads**: `list()` to find URL + `fetch()` with `cache: "no-store"` for fresh data
- **Writes**: `put()` with `addRandomSuffix: false` for stable paths

### Seeding the Blob store

On first deployment, the Blob store is empty. The seed endpoint uploads local JSON files:

```
POST /api/admin/seed-blob
```

Run from the browser console while logged into the admin:

```javascript
fetch('/api/admin/seed-blob', { method: 'POST' }).then(r => r.json()).then(console.log)
```

This is a one-time operation. After seeding, all reads/writes go through the Blob store.

---

## Authentication

**File**: `src/lib/auth.ts`

### Flow

1. User visits `/admin` → middleware checks for `admin_session` cookie
2. If missing → redirect to `/admin/login`
3. User submits password → `POST /api/admin/login`
4. Server compares password (constant-time) → creates HMAC-signed cookie
5. Cookie format: `{16-byte-nonce-hex}.{hmac-sha256-hex}`
6. On each admin request, `isAuthenticated()` verifies the HMAC signature

### Configuration

| Setting | Value |
|---------|-------|
| Cookie name | `admin_session` |
| Max age | 24 hours |
| HttpOnly | Yes |
| Secure | Yes (production) |
| SameSite | Lax |
| HMAC algorithm | SHA-256 |
| HMAC key | `ADMIN_PASSWORD` env var |

---

## API Reference

All admin API routes require authentication. Unauthorized requests return `401`.

### Authentication

| Endpoint | Method | Body | Response |
|----------|--------|------|----------|
| `/api/admin/login` | POST | `{ password }` | Sets cookie, returns `{ success: true }` |
| `/api/admin/logout` | POST | — | Clears cookie |

### CRUD Routes (same pattern for all content types)

Replace `{type}` with: `picks`, `news`, `videos`, `books`, `insights`
Replace `{path}` with the public path for revalidation.

| Endpoint | Method | Body | Response |
|----------|--------|------|----------|
| `/api/admin/{type}` | GET | — | Array of items |
| `/api/admin/{type}` | POST | Item fields (no id/timestamps) | Created item (201) |
| `/api/admin/{type}` | PATCH | `{ orders: [{id, order}, ...] }` | `{ success: true }` |
| `/api/admin/{type}/{id}` | GET | — | Single item |
| `/api/admin/{type}/{id}` | PUT | Partial fields | Updated item |
| `/api/admin/{type}/{id}` | DELETE | — | `{ success: true }` |

### Metadata Fetching

| Endpoint | Method | Params | Response |
|----------|--------|--------|----------|
| `/api/admin/picks/fetch-meta` | GET | `?url=...` | `{ title, source, excerpt, date, duration, thumbnailUrl, mediaType, channelName, channelUrl, viewCount }` |
| `/api/admin/news/fetch-meta` | GET | `?url=...` | `{ title, excerpt, thumbnailUrl, source, date, mediaType }` |

For YouTube URLs, uses the YouTube Data API v3 (if `YOUTUBE_API_KEY` is set) for full metadata including date, duration, and view count. Falls back to oEmbed for basic title/channel.

For generic URLs, scrapes Open Graph meta tags from the page HTML.

### YouTube Playlist Import

| Endpoint | Method | Body | Response |
|----------|--------|------|----------|
| `/api/admin/picks/import-playlist` | POST | `{ playlistId }` | `{ imported, skipped, total, titles[], message }` |

Accepts a playlist URL or bare playlist ID. Fetches all videos via YouTube Data API, deduplicates by URL, creates new picks at the top of the list (shifts existing picks down). All imported picks are `visible: true` and `featured: true`.

### Books Special Routes

| Endpoint | Method | Params/Body | Response |
|----------|--------|-------------|----------|
| `/api/admin/books/search` | GET | `?q=...` | Google Books search results |
| `/api/admin/books/import` | POST | `{ books: [...] }` | Bulk import from Audible |

### Settings & Bio

| Endpoint | Method | Body | Response |
|----------|--------|------|----------|
| `/api/admin/settings` | GET | — | Settings object |
| `/api/admin/settings` | PUT | Partial settings (merged) | Updated settings |
| `/api/admin/bio` | GET | — | Bio object |
| `/api/admin/bio` | PUT | Full bio object | Updated bio |

### Utilities

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/admin/seed-blob` | POST | One-time migration of local JSON to Vercel Blob |

---

## Admin Panel

### Access

- URL: `pedroripper.com/admin`
- Auth: Password from `ADMIN_PASSWORD` env var
- Session: 24-hour cookie

### Features per content type

| Feature | Picks | Books | News | Videos | Insights |
|---------|-------|-------|------|--------|----------|
| Create/Edit form | Yes | Yes | Yes | Yes | Yes |
| Metadata auto-fill | YouTube + OG | Google Books | OG tags | — | — |
| Drag-and-drop reorder | Yes | Yes | Yes | Yes | Yes |
| Visible toggle | Yes | Yes | Yes | Yes | Yes |
| Featured toggle | Yes | Yes | Yes | Yes | Yes |
| Bulk delete | Yes | Yes | Yes | Yes | Yes |
| YouTube playlist import | Yes | — | — | — | — |
| Audible import | — | Yes | — | — | — |
| Markdown editor | — | — | — | — | Yes |
| Bilingual (EN/PT) | — | — | — | — | Yes |

### ContentListTable

The core admin component (`src/components/admin/ContentListTable.tsx`) powers all list views:

- Drag-and-drop reordering via `@hello-pangea/dnd`
- Visible/Featured toggle switches
- Bulk selection and delete
- Configurable columns via `Column[]` prop
- Syncs with server data after external mutations (e.g. playlist import)
- Batch PATCH for reordering (avoids race conditions)

---

## Public Pages

### Homepage (`/`)

Fetches featured items from all content types via `Promise.all`:

```
Hero → Insights → Picks → Books → Talks → News → Content Atlas
```

Each section shows a limited number of featured items with a "See all" link.

### Section Pages

| Page | Route | Data Source | Client Features |
|------|-------|-------------|-----------------|
| Picks | `/picks` | `getPicks()` | Filter by type (Video, Podcast, Article, Channel) |
| Books | `/books` | `getBooks()` | Filter by tag |
| News | `/news` | `getNews()` | Grid layout |
| Talks | `/talks` | `getVideos()` | Video list with modals |
| Insights | `/insights` | `getInsights()` | Article list |
| Insight Detail | `/insights/[slug]` | `getInsightBySlug()` | Markdown rendering, EN/PT toggle |
| About | `/about` | `getBio()` | Highlights, stats |

### SEO

- `robots.ts` — Allows all crawlers, disallows `/admin` and `/api`
- `sitemap.ts` — Dynamic sitemap with all public routes
- Root layout sets OpenGraph, Twitter Card, and JSON-LD (Person + WebSite)
- Each page sets canonical URLs and descriptive metadata

---

## Design System

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-accent` | `#C8A251` | Gold accent — links, buttons, hover states |
| `--color-accent-light` | `rgba(200,162,81,0.12)` | Light gold backgrounds |
| `--color-bg` | `#ECECEC` | Page background |
| `--color-bg-alt` | `#FFFFFF` | Card/section backgrounds |
| `--color-surface` | `#F2F2F2` | Subtle surface |
| `--color-text` | `#1A1A1A` | Primary text |
| `--color-text-secondary` | `#6B6B6B` | Muted text |
| `--color-border` | `#E5E5E5` | Default borders |
| `--color-border-hover` | `#CCCCCC` | Hover border |

### Typography

| Token | Font | Weights | Usage |
|-------|------|---------|-------|
| `--font-display` | Playfair Display | 600, 700 | Headings, hero, section titles |
| `--font-body` | Inter | 400, 500, 600 | Body text, UI elements |

### Border Radius

| Token | Value |
|-------|-------|
| `--radius-sm` | 8px |
| `--radius-md` | 16px |
| `--radius-lg` | 24px |

### Animations

- **Scroll reveal**: Elements animate in with `opacity: 0→1` and `translateY(40px→0)` over 0.8s
- **Hover transitions**: 400ms for color, border, and underline changes
- **Particle canvas**: Animated floating dots in the background (client-side canvas)

### Responsive Breakpoints

Standard Tailwind breakpoints. Mobile-first approach:
- Default: mobile
- `md:` (768px): tablet
- `lg:` (1024px): desktop
- Content max-width: `1200px`

---

## Deployment

### Platform

Vercel, deployed via CLI (`vercel deploy --prod`) or git push to `master`.

### Domain

`pedroripper.com` (aliased automatically on production deploys)

### Environment Variables (Vercel)

| Variable | Environments | Purpose |
|----------|-------------|---------|
| `ADMIN_PASSWORD` | Production | Admin panel login |
| `YOUTUBE_API_KEY` | Production | YouTube Data API v3 |
| `BLOB_READ_WRITE_TOKEN` | Production, Preview | Vercel Blob storage access |

### Deploying

```bash
# Preview deploy (for testing)
vercel deploy

# Production deploy
vercel deploy --prod
```

### First-time setup for a new Vercel project

1. `vercel link` — Link local repo to Vercel project
2. Create a Blob store: Vercel Dashboard → Project → Storage → Create Database → Blob
3. Add env vars: `ADMIN_PASSWORD`, `YOUTUBE_API_KEY`
4. `vercel env pull` — Pull env vars locally
5. `vercel deploy --prod` — Deploy
6. Seed the Blob store (see [Seeding the Blob store](#seeding-the-blob-store))

---

## Common Tasks

### Adding a new content type

1. Add the TypeScript interface to `src/lib/types.ts`
2. Create a JSON file in `src/content/{type}.json` (start with `[]`)
3. Add CRUD functions to `src/lib/content.ts` (follow the existing pattern)
4. Create API routes in `src/app/api/admin/{type}/route.ts` (GET, POST, PATCH)
5. Create API routes for `src/app/api/admin/{type}/[id]/route.ts` (GET, PUT, DELETE)
6. Create admin pages: list (`admin/{type}/page.tsx`), create (`admin/{type}/new/page.tsx`), edit (`admin/{type}/[id]/page.tsx`)
7. Create a form component in `src/components/admin/{Type}Form.tsx`
8. Create public page(s) in `src/app/(public)/`
9. Add to homepage if needed (featured section)
10. Re-seed the Blob store to upload the new JSON file

### Importing picks from a YouTube playlist

1. Go to `/admin/picks`
2. Click "Import from Playlist"
3. Paste the playlist URL (saved for future use)
4. Click "Import"

The playlist URL is stored in site settings. New videos are added at the top; duplicates are skipped.

### Changing site settings (name, tagline, social links)

```
PUT /api/admin/settings
Body: { "name": "New Name", "tagline": "New tagline" }
```

Or edit `src/content/settings.json` locally and re-seed.

### Re-seeding the Blob store

If local JSON files have been updated and need to be pushed to production:

1. Deploy the code: `vercel deploy --prod`
2. Log into the admin panel
3. Open browser console and run:
   ```javascript
   fetch('/api/admin/seed-blob', { method: 'POST' }).then(r => r.json()).then(console.log)
   ```

Note: The seed endpoint **skips** files that already exist in the Blob store. To force overwrite, delete the blob first or update through the CMS.

---

## Troubleshooting

### "Failed to save" errors in the CMS

- **In production**: Check that `BLOB_READ_WRITE_TOKEN` is set in Vercel env vars
- **Locally**: If using Blob locally, run `vercel env pull` to get the token
- Check the browser console and Network tab for the actual API error response

### Content not showing on public pages

- Check that the item has `visible: true` (or `visible` is not set — defaults to true)
- For homepage: check that `featured: true` is set
- Check the `order` field — items are sorted ascending by order

### Reorder not persisting

- The PATCH endpoint sends all items' orders in one request to avoid race conditions
- After reordering, refresh the page to confirm persistence
- Check the Network tab to verify the PATCH request succeeded

### Blob store out of sync

If production data diverges from local files, use the CMS to make changes (it writes directly to Blob). The local JSON files are only used as seed data and for local development without a Blob token.

### YouTube metadata not filling

- Check that `YOUTUBE_API_KEY` is set
- Verify the key is enabled for YouTube Data API v3 in Google Cloud Console
- Check the API quota (10,000 units/day on the free tier)
