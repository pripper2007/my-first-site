# Pedro Ripper Personal Website — Implementation Plan

## 1. Project Overview

Build a modern, performant personal website for Pedro Ripper showcasing his professional work, insights, and leadership. The site features:
- Public-facing pages with featured content from news, videos, books, and articles
- Full-featured admin panel for content management (behind password authentication)
- File-based JSON CMS for easy deployment and content persistence
- Next.js 14+ with App Router, TypeScript, Tailwind CSS
- Particle animation background on key pages
- Responsive design matching the provided HTML reference
- Deployed to Vercel with zero-configuration hosting

---

## 2. Project Setup

### Step-by-Step Commands

```bash
# 1. Create new Next.js 14 project
npx create-next-app@latest pedro-ripper-site \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --no-git

cd pedro-ripper-site

# 2. Install additional dependencies
npm install uuid
npm install --save-dev @types/uuid

# 3. Create environment file
echo 'ADMIN_PASSWORD=your-secure-password-here' > .env.local

# 4. Create folder structure
mkdir -p src/content
mkdir -p src/components/{shared,public,admin}
mkdir -p src/app/{public,admin}
mkdir -p public/assets
```

### Environment Variables (.env.local)

```
ADMIN_PASSWORD=your-secure-password-here
NEXT_PUBLIC_SITE_NAME=Pedro Ripper
```

### .gitignore Additions

Add these lines to the existing `.gitignore`:

```
.env.local
.env.*.local
.vercel
node_modules/
.next/
dist/
build/
*.log
```

---

## 3. Complete Folder Structure

```
pedro-ripper-site/
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx (homepage)
│   │   │   ├── news/
│   │   │   │   └── page.tsx
│   │   │   ├── videos/
│   │   │   │   └── page.tsx
│   │   │   ├── books/
│   │   │   │   └── page.tsx
│   │   │   └── articles/
│   │   │       └── page.tsx
│   │   ├── (admin)/
│   │   │   ├── layout.tsx
│   │   │   ├── admin/
│   │   │   │   ├── page.tsx (dashboard)
│   │   │   │   ├── login/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── news/
│   │   │   │   │   ├── page.tsx (list)
│   │   │   │   │   ├── new/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx (edit)
│   │   │   │   ├── videos/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── new/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── books/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── new/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── articles/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── new/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── bio/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── settings/
│   │   │   │       └── page.tsx
│   │   │   └── middleware.ts (auth check)
│   │   └── api/
│   │       ├── admin/
│   │       │   ├── news/
│   │       │   │   ├── route.ts (POST, GET)
│   │       │   │   └── [id]/
│   │       │   │       └── route.ts (PUT, DELETE)
│   │       │   ├── videos/
│   │       │   │   ├── route.ts
│   │       │   │   └── [id]/
│   │       │   │       └── route.ts
│   │       │   ├── books/
│   │       │   │   ├── route.ts
│   │       │   │   └── [id]/
│   │       │   │       └── route.ts
│   │       │   ├── articles/
│   │       │   │   ├── route.ts
│   │       │   │   └── [id]/
│   │       │   │       └── route.ts
│   │       │   ├── bio/
│   │       │   │   └── route.ts (GET, PUT)
│   │       │   ├── settings/
│   │       │   │   └── route.ts (GET, PUT)
│   │       │   └── login/
│   │       │       └── route.ts (POST)
│   │       └── content/
│   │           ├── news/
│   │           │   └── route.ts (GET all news)
│   │           ├── videos/
│   │           │   └── route.ts (GET all videos)
│   │           ├── books/
│   │           │   └── route.ts (GET all books)
│   │           ├── articles/
│   │           │   └── route.ts (GET all articles)
│   │           ├── bio/
│   │           │   └── route.ts (GET bio)
│   │           └── settings/
│   │               └── route.ts (GET settings)
│   ├── components/
│   │   ├── shared/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── ParticleCanvas.tsx
│   │   │   ├── SectionHeader.tsx
│   │   │   └── ScrollReveal.tsx
│   │   ├── public/
│   │   │   ├── Hero.tsx
│   │   │   ├── Bio.tsx
│   │   │   ├── NewsCard.tsx
│   │   │   ├── VideoCard.tsx
│   │   │   ├── BookCard.tsx
│   │   │   ├── ArticleRow.tsx
│   │   │   ├── NewsGrid.tsx
│   │   │   ├── VideosGrid.tsx
│   │   │   ├── BooksGrid.tsx
│   │   │   └── ArticlesList.tsx
│   │   └── admin/
│   │       ├── AdminLayout.tsx
│   │       ├── AdminSidebar.tsx
│   │       ├── AdminTable.tsx
│   │       ├── AdminForm.tsx
│   │       ├── ToggleSwitch.tsx
│   │       ├── DragHandle.tsx
│   │       └── DeleteConfirmation.tsx
│   ├── lib/
│   │   ├── content.ts (read/write JSON files)
│   │   ├── auth.ts (password verification)
│   │   ├── types.ts (TypeScript interfaces)
│   │   └── utils.ts (helpers)
│   ├── content/
│   │   ├── news.json
│   │   ├── videos.json
│   │   ├── books.json
│   │   ├── articles.json
│   │   ├── bio.json
│   │   └── settings.json
│   ├── styles/
│   │   └── globals.css
│   └── middleware.ts
├── public/
│   ├── assets/
│   │   └── (images, icons if needed)
│   └── favicon.ico
├── .env.local
├── .gitignore
├── next.config.js
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
└── package.json
```

---

## 4. Design System & Tokens

### Color Palette (from HTML reference)

Primary colors:
- **Background Dark**: `#0a0e27` (dark navy, main background)
- **Background Light**: `#1a1f3a` (slightly lighter navy)
- **Accent Primary**: `#00d4ff` (bright cyan/blue)
- **Accent Secondary**: `#ff006e` (hot pink/magenta)
- **Accent Tertiary**: `#8338ec` (purple)
- **Text Primary**: `#ffffff` (white)
- **Text Secondary**: `#b0b0b0` (light gray)
- **Text Tertiary**: `#808080` (medium gray)
- **Border Color**: `#2a2f4a` (subtle border)
- **Success**: `#06d6a0` (teal/green)
- **Warning**: `#ffc914` (yellow/gold)
- **Error**: `#ff006e` (magenta for errors)

### Typography

- **Font Family**: `'Segoe UI', Trebuchet MS, sans-serif` (system fonts)
- **Headings**: Use Tailwind `font-semibold` or `font-bold`
  - `H1`: 48px / 56px (3.5rem), `font-bold`, letter-spacing -0.02em
  - `H2`: 36px / 44px (2.25rem), `font-bold`
  - `H3`: 28px / 36px (1.75rem), `font-semibold`
  - `H4`: 20px / 28px (1.25rem), `font-semibold`
- **Body**:
  - Large: 18px / 28px (1.125rem)
  - Regular: 16px / 24px (1rem)
  - Small: 14px / 22px (0.875rem)
- **Monospace** (for dates, metadata): `'Monaco', 'Courier New', monospace, 13px`

### Spacing Scale

Tailwind's default scale (4px base):
- `2xs`: 0.5rem (8px)
- `xs`: 0.75rem (12px)
- `sm`: 1rem (16px)
- `md`: 1.5rem (24px)
- `lg`: 2rem (32px)
- `xl`: 3rem (48px)
- `2xl`: 4rem (64px)
- `3xl`: 6rem (96px)

### Border Radius

- **Subtle**: `2px` (small UI elements, cards)
- **Moderate**: `6px` (buttons, inputs)
- **Generous**: `12px` (large cards, sections)
- **Full**: `9999px` (pill buttons, badges)

### Shadows

- **Subtle**: `0 2px 4px rgba(0, 0, 0, 0.1)`
- **Card**: `0 10px 30px rgba(0, 0, 0, 0.2)`
- **Glow**: `0 0 20px rgba(0, 212, 255, 0.2)` (cyan glow)

### Transitions

- **Fast**: `150ms` (micro-interactions, hover states)
- **Normal**: `250ms` (button clicks, modal opens)
- **Slow**: `400ms` (page transitions, complex animations)
- **Easing**: `cubic-bezier(0.4, 0, 0.2, 1)` (Tailwind's default ease-in-out)

### Tailwind Config Extensions

Add to `tailwind.config.ts`:

```typescript
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0a0e27',
        'dark-bg-light': '#1a1f3a',
        'cyan': '#00d4ff',
        'pink': '#ff006e',
        'purple': '#8338ec',
        'teal': '#06d6a0',
        'gold': '#ffc914',
      },
      fontSize: {
        'display-lg': ['48px', { lineHeight: '56px', letterSpacing: '-0.02em' }],
        'display-md': ['36px', { lineHeight: '44px' }],
        'heading-lg': ['28px', { lineHeight: '36px' }],
        'heading-md': ['20px', { lineHeight: '28px' }],
        'body-lg': ['18px', { lineHeight: '28px' }],
        'body-sm': ['14px', { lineHeight: '22px' }],
      },
      fontFamily: {
        'mono': ['Monaco', 'Courier New', 'monospace'],
      },
      borderRadius: {
        'subtle': '2px',
        'moderate': '6px',
        'generous': '12px',
      },
      boxShadow: {
        'subtle': '0 2px 4px rgba(0, 0, 0, 0.1)',
        'card': '0 10px 30px rgba(0, 0, 0, 0.2)',
        'glow-cyan': '0 0 20px rgba(0, 212, 255, 0.2)',
        'glow-pink': '0 0 20px rgba(255, 0, 110, 0.2)',
      },
      transitionDuration: {
        'fast': '150ms',
        'normal': '250ms',
        'slow': '400ms',
      },
    },
  },
  plugins: [],
}
```

---

## 5. Content Layer (JSON CMS)

### TypeScript Types

Create `src/lib/types.ts`:

```typescript
export interface NewsItem {
  id: string;
  title: string;
  source: string;
  date: string; // YYYY-MM-DD
  excerpt: string;
  url: string;
  imageGradient: string; // CSS gradient
  featured: boolean;
  order: number;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  type: 'keynote' | 'panel' | 'interview' | 'podcast';
  event: string;
  date: string; // YYYY-MM-DD
  duration: string; // e.g., "32:14"
  youtubeUrl: string;
  thumbnailGradient: string; // CSS gradient
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface BookItem {
  id: string;
  title: string;
  author: string;
  tag: string; // Innovation, Leadership, etc.
  coverGradient: string; // CSS gradient
  amazonUrl?: string;
  notes?: string;
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleItem {
  id: string;
  title: string;
  source: string;
  date: string; // YYYY-MM-DD
  excerpt: string;
  url: string;
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface BioHighlight {
  icon: 'chart' | 'globe' | 'book' | 'star' | 'rocket' | 'users';
  title: string;
  description: string;
}

export interface BioStat {
  value: string;
  label: string;
}

export interface Bio {
  paragraphs: string[];
  highlights: BioHighlight[];
  stats: BioStat[];
}

export interface Settings {
  name: string;
  role: string;
  tagline: string;
  social: {
    linkedin: string;
    x: string;
  };
  meta: {
    title: string;
    description: string;
  };
}
```

### Content Reading/Writing Utilities

Create `src/lib/content.ts`:

```typescript
import { promises as fs } from 'fs';
import path from 'path';
import {
  NewsItem,
  VideoItem,
  BookItem,
  ArticleItem,
  Bio,
  Settings,
} from './types';

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content');

async function readJsonFile<T>(filename: string): Promise<T> {
  const filepath = path.join(CONTENT_DIR, filename);
  const data = await fs.readFile(filepath, 'utf-8');
  return JSON.parse(data);
}

async function writeJsonFile<T>(filename: string, data: T): Promise<void> {
  const filepath = path.join(CONTENT_DIR, filename);
  await fs.writeFile(filepath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getNews(): Promise<NewsItem[]> {
  try {
    const data = await readJsonFile<NewsItem[]>('news.json');
    return data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch {
    return [];
  }
}

export async function getFeaturedNews(limit: number = 3): Promise<NewsItem[]> {
  const news = await getNews();
  return news.filter((n) => n.featured).slice(0, limit);
}

export async function getNewsById(id: string): Promise<NewsItem | null> {
  const news = await getNews();
  return news.find((n) => n.id === id) || null;
}

export async function createNews(item: Omit<NewsItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<NewsItem> {
  const { v4: uuidv4 } = await import('uuid');
  const news = await getNews();
  const newItem: NewsItem = {
    ...item,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  news.push(newItem);
  await writeJsonFile('news.json', news);
  return newItem;
}

export async function updateNews(id: string, updates: Partial<Omit<NewsItem, 'id' | 'createdAt'>>): Promise<NewsItem | null> {
  let news = await getNews();
  const index = news.findIndex((n) => n.id === id);
  if (index === -1) return null;
  news[index] = {
    ...news[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  await writeJsonFile('news.json', news);
  return news[index];
}

export async function deleteNews(id: string): Promise<boolean> {
  let news = await getNews();
  const filtered = news.filter((n) => n.id !== id);
  if (filtered.length === news.length) return false;
  await writeJsonFile('news.json', filtered);
  return true;
}

// Similar functions for videos, books, articles...
// (Implement getVideos, createVideo, updateVideo, deleteVideo, etc.)
// (Implement getBooks, createBook, updateBook, deleteBook, etc.)
// (Implement getArticles, createArticle, updateArticle, deleteArticle, etc.)

export async function getBio(): Promise<Bio> {
  try {
    return await readJsonFile<Bio>('bio.json');
  } catch {
    return {
      paragraphs: [],
      highlights: [],
      stats: [],
    };
  }
}

export async function updateBio(bio: Bio): Promise<Bio> {
  await writeJsonFile('bio.json', bio);
  return bio;
}

export async function getSettings(): Promise<Settings> {
  try {
    return await readJsonFile<Settings>('settings.json');
  } catch {
    return {
      name: 'Pedro Ripper',
      role: 'Co-founder & CEO',
      tagline: '',
      social: { linkedin: '', x: '' },
      meta: { title: '', description: '' },
    };
  }
}

export async function updateSettings(settings: Settings): Promise<Settings> {
  await writeJsonFile('settings.json', settings);
  return settings;
}
```

### Initial Seed Data

Create `src/content/news.json`:

```json
[
  {
    "id": "news-001",
    "title": "Bemobi launches new mobile innovation platform",
    "source": "TechCrunch",
    "date": "2025-03-15",
    "excerpt": "After years of development, Bemobi's latest platform enables seamless mobile-first experiences across enterprise systems.",
    "url": "https://techcrunch.com/...",
    "imageGradient": "linear-gradient(135deg, #00d4ff 0%, #8338ec 100%)",
    "featured": true,
    "order": 0,
    "createdAt": "2025-03-15T10:00:00Z",
    "updatedAt": "2025-03-15T10:00:00Z"
  },
  {
    "id": "news-002",
    "title": "Pedro Ripper speaks on AI and enterprise transformation",
    "source": "Forbes",
    "date": "2025-02-20",
    "excerpt": "In an exclusive interview, the Bemobi CEO discusses how AI is reshaping the mobile technology landscape.",
    "url": "https://forbes.com/...",
    "imageGradient": "linear-gradient(135deg, #ff006e 0%, #ffc914 100%)",
    "featured": true,
    "order": 1,
    "createdAt": "2025-02-20T08:30:00Z",
    "updatedAt": "2025-02-20T08:30:00Z"
  },
  {
    "id": "news-003",
    "title": "Bemobi expands operations to 15 new markets",
    "source": "Business Insider",
    "date": "2025-01-10",
    "excerpt": "The mobile solutions provider announces significant geographic expansion across Asia and Latin America.",
    "url": "https://businessinsider.com/...",
    "imageGradient": "linear-gradient(135deg, #06d6a0 0%, #00d4ff 100%)",
    "featured": true,
    "order": 2,
    "createdAt": "2025-01-10T14:15:00Z",
    "updatedAt": "2025-01-10T14:15:00Z"
  }
]
```

Create `src/content/videos.json`:

```json
[
  {
    "id": "video-001",
    "title": "Building Global Technology Companies",
    "description": "A deep dive into the challenges and opportunities of scaling technology companies across multiple continents.",
    "type": "keynote",
    "event": "Web Summit 2024",
    "date": "2024-11-15",
    "duration": "45:30",
    "youtubeUrl": "https://www.youtube.com/embed/...",
    "thumbnailGradient": "linear-gradient(135deg, #00d4ff 0%, #8338ec 100%)",
    "featured": true,
    "order": 0,
    "createdAt": "2024-11-15T09:00:00Z",
    "updatedAt": "2024-11-15T09:00:00Z"
  },
  {
    "id": "video-002",
    "title": "The Future of Mobile Innovation",
    "description": "Panel discussion on emerging trends in mobile technology and enterprise solutions.",
    "type": "panel",
    "event": "Mobile World Congress 2024",
    "date": "2024-10-20",
    "duration": "38:45",
    "youtubeUrl": "https://www.youtube.com/embed/...",
    "thumbnailGradient": "linear-gradient(135deg, #ff006e 0%, #ffc914 100%)",
    "featured": true,
    "order": 1,
    "createdAt": "2024-10-20T11:20:00Z",
    "updatedAt": "2024-10-20T11:20:00Z"
  },
  {
    "id": "video-003",
    "title": "Leadership in the Digital Age",
    "description": "Pedro discusses transformational leadership and navigating rapid technological change.",
    "type": "interview",
    "event": "TechTalk Podcast",
    "date": "2024-09-05",
    "duration": "32:14",
    "youtubeUrl": "https://www.youtube.com/embed/...",
    "thumbnailGradient": "linear-gradient(135deg, #06d6a0 0%, #00d4ff 100%)",
    "featured": true,
    "order": 2,
    "createdAt": "2024-09-05T16:00:00Z",
    "updatedAt": "2024-09-05T16:00:00Z"
  }
]
```

Create `src/content/books.json`:

```json
[
  {
    "id": "book-001",
    "title": "Zero to One",
    "author": "Peter Thiel",
    "tag": "Innovation",
    "coverGradient": "linear-gradient(135deg, #00d4ff 0%, #8338ec 100%)",
    "amazonUrl": "https://amazon.com/...",
    "notes": "Essential reading on creating unique value and thinking differently.",
    "featured": true,
    "order": 0,
    "createdAt": "2024-08-01T12:00:00Z",
    "updatedAt": "2024-08-01T12:00:00Z"
  },
  {
    "id": "book-002",
    "title": "The Lean Startup",
    "author": "Eric Ries",
    "tag": "Business",
    "coverGradient": "linear-gradient(135deg, #ff006e 0%, #ffc914 100%)",
    "amazonUrl": "https://amazon.com/...",
    "notes": "Practical methodology for building scalable organizations with rapid iteration.",
    "featured": true,
    "order": 1,
    "createdAt": "2024-07-15T10:30:00Z",
    "updatedAt": "2024-07-15T10:30:00Z"
  },
  {
    "id": "book-003",
    "title": "Good to Great",
    "author": "Jim Collins",
    "tag": "Leadership",
    "coverGradient": "linear-gradient(135deg, #06d6a0 0%, #00d4ff 100%)",
    "amazonUrl": "https://amazon.com/...",
    "notes": "Comprehensive analysis of what makes organizations truly excel.",
    "featured": true,
    "order": 2,
    "createdAt": "2024-06-20T14:45:00Z",
    "updatedAt": "2024-06-20T14:45:00Z"
  },
  {
    "id": "book-004",
    "title": "Thinking, Fast and Slow",
    "author": "Daniel Kahneman",
    "tag": "Psychology",
    "coverGradient": "linear-gradient(135deg, #8338ec 0%, #ff006e 100%)",
    "amazonUrl": "https://amazon.com/...",
    "featured": true,
    "order": 3,
    "createdAt": "2024-05-10T09:15:00Z",
    "updatedAt": "2024-05-10T09:15:00Z"
  },
  {
    "id": "book-005",
    "title": "Sapiens",
    "author": "Yuval Noah Harari",
    "tag": "History",
    "coverGradient": "linear-gradient(135deg, #ffc914 0%, #ff006e 100%)",
    "amazonUrl": "https://amazon.com/...",
    "featured": true,
    "order": 4,
    "createdAt": "2024-04-05T11:00:00Z",
    "updatedAt": "2024-04-05T11:00:00Z"
  },
  {
    "id": "book-006",
    "title": "Principles",
    "author": "Ray Dalio",
    "tag": "Business",
    "coverGradient": "linear-gradient(135deg, #00d4ff 0%, #06d6a0 100%)",
    "amazonUrl": "https://amazon.com/...",
    "featured": true,
    "order": 5,
    "createdAt": "2024-03-20T13:30:00Z",
    "updatedAt": "2024-03-20T13:30:00Z"
  },
  {
    "id": "book-007",
    "title": "The Innovators",
    "author": "Walter Isaacson",
    "tag": "Innovation",
    "coverGradient": "linear-gradient(135deg, #ff006e 0%, #8338ec 100%)",
    "amazonUrl": "https://amazon.com/...",
    "featured": true,
    "order": 6,
    "createdAt": "2024-02-28T15:45:00Z",
    "updatedAt": "2024-02-28T15:45:00Z"
  },
  {
    "id": "book-008",
    "title": "The Hard Thing About Hard Things",
    "author": "Ben Horowitz",
    "tag": "Leadership",
    "coverGradient": "linear-gradient(135deg, #ffc914 0%, #06d6a0 100%)",
    "amazonUrl": "https://amazon.com/...",
    "featured": true,
    "order": 7,
    "createdAt": "2024-01-15T10:20:00Z",
    "updatedAt": "2024-01-15T10:20:00Z"
  }
]
```

Create `src/content/articles.json`:

```json
[
  {
    "id": "article-001",
    "title": "The Future of Enterprise Mobility",
    "source": "Harvard Business Review",
    "date": "2025-02-10",
    "excerpt": "How companies are leveraging mobile-first strategies to gain competitive advantage in emerging markets.",
    "url": "https://hbr.org/...",
    "featured": true,
    "order": 0,
    "createdAt": "2025-02-10T09:00:00Z",
    "updatedAt": "2025-02-10T09:00:00Z"
  },
  {
    "id": "article-002",
    "title": "Building Resilient Global Technology Teams",
    "source": "MIT Sloan Management Review",
    "date": "2025-01-25",
    "excerpt": "Lessons learned from scaling distributed teams across five continents and multiple time zones.",
    "url": "https://mitsloan.mit.edu/...",
    "featured": true,
    "order": 1,
    "createdAt": "2025-01-25T11:30:00Z",
    "updatedAt": "2025-01-25T11:30:00Z"
  },
  {
    "id": "article-003",
    "title": "Navigating Regulatory Complexity in Global Markets",
    "source": "The Economist",
    "date": "2024-12-15",
    "excerpt": "A strategic approach to compliance and market entry in rapidly evolving regulatory environments.",
    "url": "https://economist.com/...",
    "featured": true,
    "order": 2,
    "createdAt": "2024-12-15T14:00:00Z",
    "updatedAt": "2024-12-15T14:00:00Z"
  },
  {
    "id": "article-004",
    "title": "Digital Transformation: Beyond the Hype",
    "source": "McKinsey & Company",
    "date": "2024-11-20",
    "excerpt": "Practical frameworks for driving meaningful technology adoption across enterprise organizations.",
    "url": "https://mckinsey.com/...",
    "featured": false,
    "order": 3,
    "createdAt": "2024-11-20T08:45:00Z",
    "updatedAt": "2024-11-20T08:45:00Z"
  },
  {
    "id": "article-005",
    "title": "The Role of CEO in an AI-Driven Future",
    "source": "Stanford Business",
    "date": "2024-10-10",
    "excerpt": "How executive leadership must evolve to harness artificial intelligence while managing organizational change.",
    "url": "https://stanfordbusiness.com/...",
    "featured": false,
    "order": 4,
    "createdAt": "2024-10-10T16:20:00Z",
    "updatedAt": "2024-10-10T16:20:00Z"
  }
]
```

Create `src/content/bio.json`:

```json
{
  "paragraphs": [
    "Pedro Ripper is the Co-founder and CEO of Bemobi, a leading provider of mobile technology solutions serving enterprises across more than 50 countries. With over 20 years of experience building and scaling global technology companies, Pedro has established himself as a thought leader in mobile innovation and enterprise transformation.",
    "Under his leadership, Bemobi has grown from a regional startup to a publicly listed company on B3 (São Paulo Stock Exchange, ticker: BMOB3), delivering critical infrastructure and solutions to some of the world's largest telecommunications and financial services organizations.",
    "Pedro is a frequent speaker at international conferences, sharing insights on leadership, innovation, and the future of technology. He is committed to advancing digital transformation across emerging markets and fostering the next generation of technology entrepreneurs."
  ],
  "highlights": [
    {
      "icon": "chart",
      "title": "Public Company CEO",
      "description": "Leading Bemobi (BMOB3) on São Paulo Stock Exchange with a market presence across 50+ countries."
    },
    {
      "icon": "globe",
      "title": "Global Impact",
      "description": "20+ years building and scaling international technology companies serving millions of enterprises."
    },
    {
      "icon": "book",
      "title": "Thought Leadership",
      "description": "Regular speaker at Web Summit, Mobile World Congress, and other leading industry conferences."
    }
  ],
  "stats": [
    { "value": "50+", "label": "Countries" },
    { "value": "BMOB3", "label": "B3 Listed" },
    { "value": "20+", "label": "Years in Tech" }
  ]
}
```

Create `src/content/settings.json`:

```json
{
  "name": "Pedro Ripper",
  "role": "Co-founder & CEO of Bemobi",
  "tagline": "Building global technology solutions",
  "social": {
    "linkedin": "https://linkedin.com/in/pedroripper",
    "x": "https://x.com/pedroripper"
  },
  "meta": {
    "title": "Pedro Ripper — Co-founder & CEO, Bemobi",
    "description": "Technology entrepreneur, thought leader, and CEO with 20+ years building global companies. Leading Bemobi across 50+ countries."
  }
}
```

---

## 6. Shared Components

### ParticleCanvas.tsx

Create `src/components/shared/ParticleCanvas.tsx`:

```typescript
'use client';

import React, { useEffect, useRef } from 'react';

export const ParticleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      color: string;
    }> = [];

    const colors = ['#00d4ff', '#ff006e', '#8338ec', '#06d6a0'];

    // Create particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(10, 14, 39, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 opacity-20"
      style={{ background: '#0a0e27' }}
    />
  );
};
```

### Navbar.tsx

Create `src/components/shared/Navbar.tsx`:

```typescript
'use client';

import React from 'react';
import Link from 'next/link';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-dark-bg/95 backdrop-blur border-b border-dark-bg-light">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-lg font-bold text-cyan hover:text-cyan transition">
          Pedro Ripper
        </Link>

        <div className="hidden md:flex gap-8">
          <Link href="/news" className="text-text-secondary hover:text-cyan transition">News</Link>
          <Link href="/videos" className="text-text-secondary hover:text-cyan transition">Videos</Link>
          <Link href="/books" className="text-text-secondary hover:text-cyan transition">Books</Link>
          <Link href="/articles" className="text-text-secondary hover:text-cyan transition">Articles</Link>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-cyan"
        >
          ☰
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 bg-dark-bg-light border-b border-dark-bg-light flex flex-col gap-4 p-6 md:hidden">
            <Link href="/news">News</Link>
            <Link href="/videos">Videos</Link>
            <Link href="/books">Books</Link>
            <Link href="/articles">Articles</Link>
          </div>
        )}
      </div>
    </nav>
  );
};
```

### Footer.tsx

Create `src/components/shared/Footer.tsx`:

```typescript
'use client';

import React from 'react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Settings } from '@/lib/types';

export const Footer: React.FC = () => {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    fetch('/api/content/settings')
      .then((res) => res.json())
      .then(setSettings);
  }, []);

  if (!settings) return null;

  return (
    <footer className="bg-dark-bg-light border-t border-dark-bg-light mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
          <div>
            <h3 className="text-white font-bold mb-4">{settings.name}</h3>
            <p className="text-text-secondary text-sm">{settings.role}</p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Navigation</h4>
            <div className="flex flex-col gap-2">
              <Link href="/news" className="text-text-secondary hover:text-cyan transition text-sm">News</Link>
              <Link href="/videos" className="text-text-secondary hover:text-cyan transition text-sm">Videos</Link>
              <Link href="/books" className="text-text-secondary hover:text-cyan transition text-sm">Books</Link>
              <Link href="/articles" className="text-text-secondary hover:text-cyan transition text-sm">Articles</Link>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Social</h4>
            <div className="flex gap-4">
              <a href={settings.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-cyan hover:text-pink transition">LinkedIn</a>
              <a href={settings.social.x} target="_blank" rel="noopener noreferrer" className="text-cyan hover:text-pink transition">X</a>
            </div>
          </div>
        </div>

        <div className="border-t border-dark-bg pt-8">
          <p className="text-text-tertiary text-sm text-center">
            © {new Date().getFullYear()} {settings.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
```

### SectionHeader.tsx

Create `src/components/shared/SectionHeader.tsx`:

```typescript
import React from 'react';
import Link from 'next/link';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  viewAllLink?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  viewAllLink,
}) => {
  return (
    <div className="flex justify-between items-start mb-12">
      <div>
        <h2 className="text-4xl font-bold text-white mb-2">{title}</h2>
        {subtitle && <p className="text-text-secondary">{subtitle}</p>}
      </div>
      {viewAllLink && (
        <Link
          href={viewAllLink}
          className="text-cyan hover:text-pink transition font-semibold"
        >
          View all →
        </Link>
      )}
    </div>
  );
};
```

### ScrollReveal.tsx

Create `src/components/shared/ScrollReveal.tsx`:

```typescript
'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-10'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};
```

### NewsCard.tsx

Create `src/components/public/NewsCard.tsx`:

```typescript
import React from 'react';
import { NewsItem } from '@/lib/types';
import Link from 'next/link';

interface NewsCardProps {
  item: NewsItem;
}

export const NewsCard: React.FC<NewsCardProps> = ({ item }) => {
  const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Link href={item.url} target="_blank" rel="noopener noreferrer">
      <div
        className="group cursor-pointer h-64 rounded-generous overflow-hidden relative"
        style={{ background: item.imageGradient }}
      >
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-300" />

        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <p className="text-xs font-mono text-text-secondary mb-2 uppercase tracking-wide">
            {item.source}
          </p>
          <h3 className="text-xl font-bold text-white group-hover:text-cyan transition mb-2">
            {item.title}
          </h3>
          <p className="text-sm text-text-secondary">{formattedDate}</p>
        </div>
      </div>
    </Link>
  );
};
```

### VideoCard.tsx

Create `src/components/public/VideoCard.tsx`:

```typescript
import React from 'react';
import { VideoItem } from '@/lib/types';

interface VideoCardProps {
  item: VideoItem;
}

export const VideoCard: React.FC<VideoCardProps> = ({ item }) => {
  const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <a href={item.youtubeUrl} target="_blank" rel="noopener noreferrer">
      <div
        className="group cursor-pointer h-64 rounded-generous overflow-hidden relative"
        style={{ background: item.thumbnailGradient }}
      >
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-300" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-cyan/20 rounded-full flex items-center justify-center group-hover:bg-cyan/40 transition">
            <svg className="w-8 h-8 text-cyan ml-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
          </div>
        </div>

        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <p className="text-xs font-mono text-text-secondary mb-2 uppercase tracking-wide">
            {item.event} • {item.duration}
          </p>
          <h3 className="text-lg font-bold text-white group-hover:text-cyan transition">
            {item.title}
          </h3>
          <p className="text-xs text-text-secondary mt-2">{formattedDate}</p>
        </div>
      </div>
    </a>
  );
};
```

### BookCard.tsx

Create `src/components/public/BookCard.tsx`:

```typescript
import React from 'react';
import { BookItem } from '@/lib/types';

interface BookCardProps {
  item: BookItem;
}

export const BookCard: React.FC<BookCardProps> = ({ item }) => {
  return (
    <a href={item.amazonUrl || '#'} target="_blank" rel="noopener noreferrer" className="group">
      <div
        className="h-80 rounded-moderate overflow-hidden relative shadow-card hover:shadow-glow-cyan transition-shadow duration-300"
        style={{ background: item.coverGradient }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-end p-4">
          <h3 className="text-lg font-bold text-white mb-1 group-hover:text-cyan transition">
            {item.title}
          </h3>
          <p className="text-sm text-text-secondary mb-3">{item.author}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs bg-cyan/20 text-cyan px-3 py-1 rounded-full">
              {item.tag}
            </span>
          </div>
        </div>
      </div>
      {item.notes && <p className="text-xs text-text-tertiary mt-2 line-clamp-2">{item.notes}</p>}
    </a>
  );
};
```

### ArticleRow.tsx

Create `src/components/public/ArticleRow.tsx`:

```typescript
import React from 'react';
import { ArticleItem } from '@/lib/types';
import Link from 'next/link';

interface ArticleRowProps {
  item: ArticleItem;
}

export const ArticleRow: React.FC<ArticleRowProps> = ({ item }) => {
  const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Link
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block p-6 border border-dark-bg-light rounded-moderate hover:border-cyan transition-colors"
    >
      <div className="flex justify-between items-start mb-2">
        <p className="text-xs font-mono text-text-secondary uppercase tracking-wide">
          {item.source}
        </p>
        <p className="text-xs text-text-tertiary">{formattedDate}</p>
      </div>

      <h3 className="text-lg font-bold text-white group-hover:text-cyan transition mb-2">
        {item.title}
      </h3>

      <p className="text-text-secondary text-sm line-clamp-2">{item.excerpt}</p>

      <p className="text-cyan text-sm font-semibold mt-4 group-hover:translate-x-1 transition">
        Read article →
      </p>
    </Link>
  );
};
```

### Admin Components (Brief Summary)

Create these admin components with basic structure:

- **AdminLayout.tsx**: Sidebar + main content area, logout button
- **AdminTable.tsx**: Reusable table for lists with featured toggle, edit/delete actions
- **AdminForm.tsx**: Reusable form builder for create/edit pages
- **ToggleSwitch.tsx**: Simple switch component for featured status
- **DeleteConfirmation.tsx**: Modal dialog for deletion confirmation

---

## 7. Public Pages — Implementation Order

### Homepage (`src/app/(public)/page.tsx`)

```typescript
import React from 'react';
import { ParticleCanvas } from '@/components/shared/ParticleCanvas';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { Hero } from '@/components/public/Hero';
import { Bio } from '@/components/public/Bio';
import { NewsGrid } from '@/components/public/NewsGrid';
import { VideosGrid } from '@/components/public/VideosGrid';
import { BooksGrid } from '@/components/public/BooksGrid';
import { ArticlesList } from '@/components/public/ArticlesList';
import { getFeaturedNews, getFeaturedVideos, getFeaturedBooks, getFeaturedArticles } from '@/lib/content';

export default async function Home() {
  const [news, videos, books, articles] = await Promise.all([
    getFeaturedNews(3),
    getFeaturedVideos(3),
    getFeaturedBooks(8),
    getFeaturedArticles(5),
  ]);

  return (
    <>
      <ParticleCanvas />
      <Navbar />

      <main className="min-h-screen bg-dark-bg">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center">
          <Hero />
        </section>

        {/* Bio Section */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <ScrollReveal>
            <Bio />
          </ScrollReveal>
        </section>

        {/* News Section */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <ScrollReveal>
            <SectionHeader title="Featured News" viewAllLink="/news" />
            <NewsGrid items={news} />
          </ScrollReveal>
        </section>

        {/* Videos Section */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <ScrollReveal>
            <SectionHeader title="Featured Videos" viewAllLink="/videos" />
            <VideosGrid items={videos} />
          </ScrollReveal>
        </section>

        {/* Books Section */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <ScrollReveal>
            <SectionHeader title="Featured Books" viewAllLink="/books" />
            <BooksGrid items={books} />
          </ScrollReveal>
        </section>

        {/* Articles Section */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <ScrollReveal>
            <SectionHeader title="Featured Articles" viewAllLink="/articles" />
            <ArticlesList items={articles} />
          </ScrollReveal>
        </section>
      </main>

      <Footer />
    </>
  );
}
```

### News Page (`src/app/(public)/news/page.tsx`)

Displays all news items sorted by date (newest first), with filtering and search capabilities.

### Videos Page (`src/app/(public)/videos/page.tsx`)

Displays all videos with type filtering (keynote, panel, interview, podcast).

### Books Page (`src/app/(public)/books/page.tsx`)

Displays all books with tag-based filtering (Innovation, Leadership, Business, etc.).

### Articles Page (`src/app/(public)/articles/page.tsx`)

Displays all articles in a list format, sorted by date.

---

## 8. Admin Panel — Implementation Strategy

### Authentication Middleware (`src/middleware.ts`)

Protects `/admin` routes with password verification via cookie or session.

### Admin Layout (`src/app/(admin)/layout.tsx`)

Contains sidebar navigation linking to:
- Dashboard
- News
- Videos
- Books
- Articles
- Bio
- Settings

### Admin Pages Structure

Each admin section (news, videos, books, articles) includes:
- **List page**: Table showing all items with title, date, featured status, and action buttons
- **Create page**: Form to add new items
- **Edit page**: Form to update existing items
- **Delete action**: Confirmation modal before permanent deletion

Key features:
- Toggle featured status with immediate visual feedback
- Drag-to-reorder functionality (or numeric order field)
- Pagination for large lists
- Search/filter capability
- Success/error toast notifications

---

## 9. API Routes

All API routes under `/api/admin/*` require password authentication.

### Authentication Endpoint

`POST /api/admin/login`
- Accept password in request body
- Return JWT token or set secure HTTP-only cookie
- Include token validation middleware for all other endpoints

### News Endpoints

- `GET /api/admin/news` — List all news
- `POST /api/admin/news` — Create new news item
- `PUT /api/admin/news/[id]` — Update news item
- `DELETE /api/admin/news/[id]` — Delete news item

### Similar endpoints for videos, books, articles

### Bio Endpoint

- `GET /api/admin/bio` — Get bio
- `PUT /api/admin/bio` — Update bio

### Settings Endpoint

- `GET /api/admin/settings` — Get settings
- `PUT /api/admin/settings` — Update settings

---

## 10. Deployment to Vercel

### Pre-Deployment Checklist

1. Ensure all environment variables are set in `.env.local`
2. Run `npm run build` locally to verify no errors
3. Test admin authentication with the ADMIN_PASSWORD
4. Verify content JSON files exist and are valid

### Vercel Deployment Steps

```bash
# 1. Push code to GitHub (assuming GitHub is your git host)
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourname/pedro-ripper-site.git
git push -u origin main

# 2. Connect to Vercel via dashboard or CLI
vercel

# 3. Set environment variables in Vercel dashboard
# Navigate to Settings > Environment Variables
# Add: ADMIN_PASSWORD=your-secure-password-here
```

### Custom Domain Setup

1. Go to Vercel project settings
2. Under Domains, add custom domain
3. Follow Vercel's DNS configuration instructions
4. Point domain registrar DNS to Vercel nameservers

### Content Persistence Strategy

**Current approach**: JSON files in repository
- Pro: Simple, version-controlled
- Con: Requires git commits to persist changes

**Future upgrade**: Vercel KV or Blob Storage
- Store JSON in Vercel KV for fast reads
- Use Vercel Blob for file uploads (images, PDFs)

---

## 11. Future Enhancements

### Phase 2 Features

1. **Image Upload Support**
   - Integrate Vercel Blob for image storage
   - Replace CSS gradients with actual images
   - Add image cropping/optimization

2. **RSS Feed**
   - Generate RSS feed at `/api/rss`
   - Include news, articles, and videos
   - Submit to feed aggregators

3. **SEO Optimization**
   - Structured data (JSON-LD) for articles, videos
   - Open Graph meta tags for social sharing
   - Dynamic sitemap generation
   - Meta tags per page

4. **Analytics**
   - Vercel Analytics for performance monitoring
   - Plausible or Fathom for privacy-friendly analytics
   - Track most popular content

5. **Dark/Light Mode**
   - Toggle in navbar
   - Persist preference in localStorage
   - Current design is dark-first

6. **Internationalization (i18n)**
   - Portuguese language version
   - Use next-intl for routing
   - Translate all content and UI

7. **Newsletter Signup**
   - Subscribe form in footer
   - Integrate with Mailchimp or ConvertKit
   - Welcome email automation

8. **Comment System**
   - Add Disqus or native comments on articles
   - Moderate comments in admin

9. **Related Content**
   - Show related news/articles on detail pages
   - Tag-based recommendations

---

## 12. Styling Guide & Tailwind Classes

### Color Utilities

```css
/* Background colors */
bg-dark-bg        /* #0a0e27 */
bg-dark-bg-light  /* #1a1f3a */

/* Text colors */
text-cyan          /* #00d4ff */
text-pink          /* #ff006e */
text-purple        /* #8338ec */
text-teal          /* #06d6a0 */
text-gold          /* #ffc914 */
text-white         /* #ffffff */
text-text-secondary /* #b0b0b0 */
text-text-tertiary  /* #808080 */

/* Border and dividers */
border-dark-bg-light
```

### Reusable Component Classes

```css
/* Cards */
rounded-generous shadow-card hover:shadow-glow-cyan

/* Buttons */
px-6 py-2 rounded-moderate font-semibold transition
hover:bg-cyan hover:text-dark-bg

/* Inputs */
bg-dark-bg-light border border-dark-bg-light rounded-moderate
px-4 py-2 text-white focus:outline-none focus:border-cyan

/* Badges */
px-3 py-1 rounded-full bg-cyan/20 text-cyan text-xs font-semibold
```

---

## 13. Important Implementation Notes

### Server vs. Client Components

- **Server Components**: Homepage, news/videos/books/articles list pages
  - Fetch data at build/request time
  - No hydration overhead
  - Use `async` functions directly

- **Client Components**:
  - ParticleCanvas (animation)
  - Navbar (dropdown menu)
  - All admin pages (forms, interactivity)
  - Include `'use client'` directive at top

### Data Flow

1. **Public pages**: Fetch from `/api/content/*` routes or directly from JSON
2. **Admin pages**: Fetch from `/api/admin/*` routes (with auth)
3. **Real-time updates**: Admin actions trigger API calls that rewrite JSON files

### Password Authentication Flow

1. User enters password on `/admin/login`
2. Sends POST to `/api/admin/login` with password
3. Server validates against `ADMIN_PASSWORD` env var
4. Returns JWT token or sets HTTP-only cookie
5. Include token in subsequent admin API requests
6. Middleware verifies token before allowing writes

### File Operations

All JSON file read/write must use:
- `fs.promises` for async file operations
- Absolute paths with `path.join(process.cwd(), ...)`
- JSON.parse() and JSON.stringify() for serialization
- Error handling for missing files (return empty arrays/objects)

---

## 14. Step-by-Step Execution Order for Claude Code

### Phase 1: Foundation (Days 1-2)

1. Run setup commands from Section 2
2. Create folder structure
3. Create TypeScript types in `src/lib/types.ts`
4. Create content utility functions in `src/lib/content.ts`
5. Create all JSON seed data files
6. Configure Tailwind with design tokens

### Phase 2: Shared Components (Day 2-3)

7. Build ParticleCanvas component
8. Build Navbar component
9. Build Footer component
10. Build SectionHeader component
11. Build ScrollReveal component

### Phase 3: Public Components (Day 3-4)

12. Build Hero component
13. Build Bio component
14. Build NewsCard, VideoCard, BookCard, ArticleRow components
15. Build grid/list wrapper components

### Phase 4: Public Pages (Day 4-5)

16. Create public layout (`(public)/layout.tsx`)
17. Build homepage
18. Build /news page
19. Build /videos page
20. Build /books page (with tag filtering)
21. Build /articles page

### Phase 5: Admin Panel (Day 5-7)

22. Create admin authentication middleware
23. Build admin layout and sidebar
24. Build admin table component
25. Build admin form component
26. Build admin dashboard
27. Build CRUD pages for each content type (news, videos, books, articles)
28. Build bio editor page
29. Build settings editor page

### Phase 6: API Routes (Day 7-8)

30. Create auth endpoint (`/api/admin/login`)
31. Create CRUD endpoints for each content type
32. Create auth middleware for route protection
33. Implement file operations in API routes

### Phase 7: Testing & Deployment (Day 8)

34. Test all public pages locally
35. Test admin authentication
36. Test CRUD operations
37. Build and deploy to Vercel
38. Verify deployed site functionality
39. Set up custom domain

---

## 15. Testing Checklist

### Public Pages

- [ ] Homepage loads correctly with all sections
- [ ] Featured content displays (3 news, 3 videos, 8 books, 5 articles)
- [ ] Particle animation renders without lag
- [ ] Responsive design on mobile (320px, 768px, 1024px)
- [ ] All internal links work
- [ ] External links open in new tab

### News Page

- [ ] All news items display
- [ ] Sorted by date (newest first)
- [ ] Click opens external URL in new tab
- [ ] Gradients display correctly

### Admin Panel

- [ ] Password auth required to access
- [ ] Login page validates password
- [ ] Dashboard overview shows counts
- [ ] News list displays all items
- [ ] Can create new news item
- [ ] Can edit existing news item
- [ ] Can delete item with confirmation
- [ ] Can toggle featured status
- [ ] Can reorder items
- [ ] Similar tests for videos, books, articles

### API Routes

- [ ] POST /api/admin/login returns token on correct password
- [ ] POST /api/admin/login rejects incorrect password
- [ ] Protected routes reject requests without auth token
- [ ] POST /api/admin/news creates new file entry
- [ ] PUT /api/admin/news/[id] updates entry
- [ ] DELETE /api/admin/news/[id] removes entry
- [ ] Content changes persist after page reload

---

## 16. Git Workflow

```bash
# Initial setup
git init
git add .
git commit -m "Initial Next.js setup with design system"

# After each phase
git add .
git commit -m "Phase X: [Feature description]"

# Before final deployment
git log --oneline  # Review commits
```

---

## 17. Environment Variables Reference

```
# .env.local
ADMIN_PASSWORD=choose-a-strong-password
NEXT_PUBLIC_SITE_NAME=Pedro Ripper

# .env.production (Vercel)
ADMIN_PASSWORD=production-password
```

---

## Summary

This comprehensive plan provides:

- Clear folder structure with purpose
- Reusable component library
- File-based JSON CMS with TypeScript safety
- Password-protected admin panel with CRUD operations
- Public-facing pages with featured content
- Particle animation background
- Tailwind CSS design system
- API routes for authentication and content management
- Vercel deployment instructions
- Step-by-step execution guide

Follow the 17 phases in the execution order, testing after each phase. All code should be written from scratch based on this specification—no external templates required. The design tokens and component patterns are extracted from the provided HTML reference and can be implemented exactly as specified using Tailwind CSS utilities.
