#!/usr/bin/env python3
"""
Bemobi Tips Adder
=================
Add content tips (articles, videos, podcast episodes, channels) to
bemobi_tips_database.json by pasting a URL. Auto-detects content type,
fetches metadata, and appends to the database.

Usage:
    python bemobi_tips_adder.py <url>
    python bemobi_tips_adder.py <url> --note "Why I love this"
    python bemobi_tips_adder.py <url> --type channel
    python bemobi_tips_adder.py <url> --featured
    python bemobi_tips_adder.py --batch urls.txt
    python bemobi_tips_adder.py --list

Requirements:
    pip install requests beautifulsoup4 python-dateutil
"""

import json
import re
import hashlib
import argparse
import sys
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse, parse_qs

try:
    import requests
    from bs4 import BeautifulSoup
    from dateutil import parser as dateparser
except ImportError:
    print("Missing dependencies. Install with:")
    print("  pip install requests beautifulsoup4 python-dateutil")
    sys.exit(1)


# ─── Configuration ───────────────────────────────────────────────────────────

DATABASE_PATH = Path(__file__).parent / "bemobi_tips_database.json"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                  "AppleWebKit/537.36 (KHTML, like Gecko) "
                  "Chrome/120.0.0.0 Safari/537.36",
    "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
}

# Platform detection patterns
PLATFORM_PATTERNS = {
    "youtube": ["youtube.com/watch", "youtu.be/", "youtube.com/embed"],
    "spotify": ["open.spotify.com/", "spotify.com/"],
    "apple_podcasts": ["podcasts.apple.com/"],
    "soundcloud": ["soundcloud.com/"],
    "substack": ["substack.com/"],
}

# Patterns that indicate a "channel" type (not individual content)
CHANNEL_PATTERNS = [
    r"youtube\.com/@",
    r"youtube\.com/channel/",
    r"youtube\.com/c/",
    r"open\.spotify\.com/show/",
    r"podcasts\.apple\.com/.*podcast/",
    r"soundcloud\.com/[^/]+$",
]

# Patterns for podcast episodes
PODCAST_EPISODE_PATTERNS = [
    r"open\.spotify\.com/episode/",
    r"podcasts\.apple\.com/.*/episode/",
    r"soundcloud\.com/.+/.+",
    r"pod/profile/.*/episodes/",
]

# Category inference
CATEGORY_KEYWORDS = {
    "artificial-intelligence": ["ai", "artificial intelligence", "machine learning", "deep learning", "neural", "llm", "gpt", "claude", "gemini"],
    "agentic-AI": ["agentic", "ai agent", "agent", "autonomous"],
    "payments": ["payment", "pagamento", "checkout", "fintech", "visa", "mastercard", "pix"],
    "fintech": ["fintech", "neobank", "banking", "financial technology"],
    "engineering": ["engineering", "production", "rag", "infrastructure", "deploy", "build"],
    "education": ["intro", "introduction", "learn", "tutorial", "explained", "guide"],
    "strategy": ["strategy", "trend", "forecast", "prediction", "future"],
    "entrepreneurship": ["startup", "founder", "entrepreneur", "venture"],
}


# ─── Type Detection ──────────────────────────────────────────────────────────

def detect_pick_type(url: str, force_type: str = None) -> str:
    """Auto-detect the pick type from the URL."""
    if force_type:
        return force_type

    url_lower = url.lower()

    # Check channel patterns first
    for pattern in CHANNEL_PATTERNS:
        if re.search(pattern, url_lower):
            return "channel"

    # Check podcast episode patterns
    for pattern in PODCAST_EPISODE_PATTERNS:
        if re.search(pattern, url_lower):
            return "podcast_episode"

    # Check if YouTube video
    if any(p in url_lower for p in PLATFORM_PATTERNS["youtube"]):
        return "video"

    # Default to article
    return "article"


def detect_platform(url: str) -> str:
    """Detect the platform from the URL."""
    url_lower = url.lower()
    for platform, patterns in PLATFORM_PATTERNS.items():
        if any(p in url_lower for p in patterns):
            return platform
    return "web"


# ─── YouTube Metadata ────────────────────────────────────────────────────────

def extract_youtube_video_id(url: str) -> str:
    """Extract YouTube video ID from various URL formats."""
    parsed = urlparse(url)
    if "youtube.com" in parsed.netloc:
        params = parse_qs(parsed.query)
        if "v" in params:
            return params["v"][0]
        if "/embed/" in parsed.path:
            return parsed.path.split("/embed/")[1].split("?")[0]
    if "youtu.be" in parsed.netloc:
        return parsed.path.lstrip("/").split("?")[0]
    return None


def fetch_youtube_metadata(url: str) -> dict:
    """Fetch metadata from a YouTube video page."""
    try:
        resp = requests.get(url, headers=HEADERS, timeout=15)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "html.parser")

        def meta(name=None, prop=None, itemprop=None):
            if name:
                tag = soup.find("meta", attrs={"name": name})
            elif prop:
                tag = soup.find("meta", property=prop)
            elif itemprop:
                tag = soup.find("meta", itemprop=itemprop)
            else:
                return None
            return tag.get("content") if tag else None

        title = meta(name="title") or soup.title.string or ""
        title = title.replace(" - YouTube", "").strip()

        # View count from page scripts
        view_count = None
        for sc in soup.find_all("script"):
            m = re.search(r'"viewCount":"(\d+)"', sc.text)
            if m:
                view_count = int(m.group(1))
                break

        # Channel name
        channel_link = soup.find("link", itemprop="name")
        channel_name = channel_link.get("content") if channel_link else None

        # Thumbnail
        thumb = None
        link_tag = soup.find("link", rel="image_src")
        if link_tag:
            thumb = link_tag.get("href")
        if not thumb:
            thumb = meta(prop="og:image")

        return {
            "title": title,
            "description": (meta(name="description") or "")[:500],
            "published_at": None,
            "date_raw": meta(itemprop="datePublished"),
            "duration": meta(itemprop="duration"),
            "thumbnail": thumb,
            "channel_name": channel_name,
            "view_count": view_count,
        }
    except Exception as e:
        print(f"  Warning: YouTube fetch error: {e}")
        return {}


# ─── Web Article Metadata ────────────────────────────────────────────────────

def fetch_article_metadata(url: str) -> dict:
    """Fetch Open Graph metadata from a web article."""
    try:
        resp = requests.get(url, headers=HEADERS, timeout=15, allow_redirects=True)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "html.parser")

        def meta(name=None, prop=None):
            if name:
                tag = soup.find("meta", attrs={"name": name})
            elif prop:
                tag = soup.find("meta", property=prop)
            else:
                return None
            return tag.get("content") if tag else None

        title = meta(prop="og:title") or meta(name="title") or ""
        if not title and soup.title:
            title = soup.title.string or ""

        image = meta(prop="og:image")
        description = meta(prop="og:description") or meta(name="description") or ""

        # Try to find published date
        published_at = None
        for prop_name in ["article:published_time", "og:article:published_time", "datePublished"]:
            tag = soup.find("meta", property=prop_name) or soup.find("meta", attrs={"name": prop_name})
            if tag and tag.get("content"):
                try:
                    published_at = dateparser.parse(tag["content"]).strftime("%Y-%m-%d")
                except Exception:
                    pass
                break

        # Site name
        site_name = meta(prop="og:site_name") or urlparse(url).netloc.replace("www.", "")

        return {
            "title": title.strip(),
            "description": description[:500],
            "published_at": published_at,
            "image_url": image,
            "site_name": site_name,
        }
    except Exception as e:
        print(f"  Warning: Article fetch error: {e}")
        return {}


# ─── Utility Functions ───────────────────────────────────────────────────────

def generate_slug(title: str) -> str:
    """Generate a URL-safe slug."""
    slug = title.lower().strip()
    replacements = {
        'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a',
        'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e',
        'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',
        'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o',
        'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u',
        'ç': 'c', 'ñ': 'n',
    }
    for old, new in replacements.items():
        slug = slug.replace(old, new)
    slug = re.sub(r'[^a-z0-9]+', '-', slug)
    return slug[:80].strip('-')


def generate_pick_id(pick_type: str, title: str) -> str:
    """Generate a deterministic ID for a pick."""
    slug = generate_slug(title)[:40]
    return f"pick-{pick_type}-{slug}"


def infer_categories(title: str, description: str = "") -> list:
    """Auto-categorize based on keywords."""
    text = f"{title} {description}".lower()
    categories = []
    for cat, keywords in CATEGORY_KEYWORDS.items():
        if any(kw in text for kw in keywords):
            categories.append(cat)
    return categories if categories else ["general"]


def parse_iso_duration(duration: str) -> tuple:
    """Parse ISO 8601 duration to (seconds, display_string)."""
    if not duration:
        return (None, None)
    match = re.match(r'PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?', duration)
    if not match:
        return (None, None)
    h, m, s = int(match.group(1) or 0), int(match.group(2) or 0), int(match.group(3) or 0)
    total = h * 3600 + m * 60 + s
    display = f"{h}h {m:02d}min" if h > 0 else f"{m}min"
    return (total, display)


def detect_language(title: str, url: str) -> str:
    """Guess language from title and URL."""
    pt_indicators = ['à', 'ã', 'ç', 'ê', 'ó', 'ú', '.com.br', '.br/']
    text = f"{title} {url}".lower()
    return "pt-BR" if any(ind in text for ind in pt_indicators) else "en"


# ─── Database Operations ─────────────────────────────────────────────────────

def load_database(path: Path) -> dict:
    """Load existing database or create a new empty one."""
    if path.exists():
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {
        "metadata": {
            "database_name": "Pedro's Picks",
            "version": "1.0.0",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "last_updated": datetime.now(timezone.utc).isoformat(),
            "total_picks": 0,
            "description": "Curated collection of picks by Pedro.",
        },
        "picks": [],
        "pick_types": [
            {"id": "article", "label": "Artigo", "label_en": "Article", "icon": "newspaper"},
            {"id": "video", "label": "Vídeo", "label_en": "Video", "icon": "play-circle"},
            {"id": "podcast_episode", "label": "Episódio de Podcast", "label_en": "Podcast Episode", "icon": "headphones"},
            {"id": "channel", "label": "Canal / Podcast para Seguir", "label_en": "Channel / Podcast to Follow", "icon": "rss"},
        ],
        "categories_taxonomy": [],
    }


def save_database(db: dict, path: Path):
    """Save database to JSON file."""
    db["metadata"]["last_updated"] = datetime.now(timezone.utc).isoformat()
    db["metadata"]["total_picks"] = len(db["picks"])
    with open(path, "w", encoding="utf-8") as f:
        json.dump(db, f, ensure_ascii=False, indent=2)
    print(f"\nDatabase saved: {path} ({db['metadata']['total_picks']} picks)")


def pick_exists(db: dict, url: str) -> bool:
    """Check if a URL already exists in the database."""
    # Normalize YouTube URLs for comparison
    vid = extract_youtube_video_id(url)
    for p in db.get("picks", []):
        if p["url"] == url:
            return True
        if vid and extract_youtube_video_id(p["url"]) == vid:
            return True
    return False


# ─── Main Add Function ───────────────────────────────────────────────────────

def add_pick(
    url: str,
    note: str = None,
    force_type: str = None,
    featured: bool = False,
    db_path: Path = DATABASE_PATH,
    dry_run: bool = False,
) -> dict:
    """Add a single pick to the database."""
    db = load_database(db_path)

    if pick_exists(db, url):
        print(f"  Already exists: {url[:60]}...")
        return None

    pick_type = detect_pick_type(url, force_type)
    platform = detect_platform(url)

    print(f"  Type: {pick_type}")
    print(f"  Platform: {platform}")
    print(f"  Fetching metadata...")

    # Fetch metadata based on type
    meta = {}
    video_id = None

    if pick_type == "video" and platform == "youtube":
        video_id = extract_youtube_video_id(url)
        meta = fetch_youtube_metadata(url)
    elif pick_type == "channel" and "youtube.com" in url:
        # For YouTube channels, use limited metadata
        meta = {"title": url.split("@")[-1] if "@" in url else "", "description": ""}
    else:
        meta = fetch_article_metadata(url)

    title = meta.get("title", "")
    description = meta.get("description", "")
    duration_raw = meta.get("duration")
    duration_seconds, duration_display = parse_iso_duration(duration_raw) if duration_raw else (None, None)

    # Parse date
    published_at = meta.get("published_at")
    if not published_at and meta.get("date_raw"):
        try:
            published_at = dateparser.parse(meta["date_raw"]).strftime("%Y-%m-%d")
        except Exception:
            pass

    # Build thumbnail URLs for YouTube
    image_url = meta.get("image_url") or meta.get("thumbnail")
    thumbnail_url = None
    if video_id:
        image_url = f"https://i.ytimg.com/vi/{video_id}/maxresdefault.jpg"
        thumbnail_url = f"https://i.ytimg.com/vi/{video_id}/hqdefault.jpg"

    # Build embed URL for YouTube
    embed_url = None
    if video_id:
        embed_url = f"https://www.youtube.com/embed/{video_id}"

    # Channel info
    channel = None
    if meta.get("channel_name"):
        channel = {"name": meta["channel_name"], "url": None}
    elif meta.get("site_name"):
        channel = None  # Articles don't have channels

    # Source
    domain = urlparse(url).netloc.replace("www.", "")
    source_name = meta.get("site_name") or meta.get("channel_name") or domain

    entry = {
        "id": generate_pick_id(pick_type, title or domain),
        "pick_type": pick_type,
        "title": title,
        "slug": generate_slug(title) if title else generate_slug(domain),
        "url": url,
        "platform": platform,
        "source": {
            "name": source_name,
            "domain": domain,
            "logo_url": None,
        },
        "published_at": published_at,
        "added_at": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        "image_url": image_url,
        "thumbnail_url": thumbnail_url,
        "excerpt": description[:300] if description else None,
        "categories": infer_categories(title, description),
        "tags": [],
        "language": detect_language(title, url),
        "note": note,
        "duration": duration_raw,
        "duration_display": duration_display,
        "view_count": meta.get("view_count"),
        "embed_url": embed_url,
        "channel": channel,
        "feed_url": None,
        "featured": featured,
    }

    print(f"\n  Title:    {entry['title'][:60]}")
    print(f"  Type:     {entry['pick_type']}")
    print(f"  Source:   {entry['source']['name']}")
    print(f"  Date:     {entry['published_at'] or 'N/A'}")
    if entry['duration_display']:
        print(f"  Duration: {entry['duration_display']}")
    if entry['view_count']:
        print(f"  Views:    {entry['view_count']:,}")
    if note:
        print(f"  Note:     {note}")
    print(f"  Featured: {entry['featured']}")

    if not dry_run:
        db["picks"].append(entry)
        # Sort: featured first, then by added_at desc
        db["picks"].sort(
            key=lambda p: (not p.get("featured", False), -(datetime.strptime(p.get("added_at", "1900-01-01"), "%Y-%m-%d").timestamp())),
        )
        save_database(db, db_path)

    return entry


def list_picks(db_path: Path = DATABASE_PATH):
    """List all picks in the database."""
    db = load_database(db_path)
    picks = db.get("picks", [])

    if not picks:
        print("No picks in database.")
        return

    type_icons = {"article": "📄", "video": "🎬", "podcast_episode": "🎧", "channel": "📡"}

    print(f"\n{'='*70}")
    print(f"Pedro's Picks — {len(picks)} items")
    print(f"{'='*70}\n")

    current_type = None
    for i, p in enumerate(picks, 1):
        pt = p.get("pick_type", "unknown")
        icon = type_icons.get(pt, "❓")
        star = " ★" if p.get("featured") else ""

        if pt != current_type:
            current_type = pt
            print(f"  --- {pt.upper().replace('_', ' ')} ---\n")

        print(f"  {i:2d}. {icon} {p['title'][:55]}{star}")
        print(f"      {p['source']['name']} | {p.get('added_at', 'N/A')}")
        if p.get("note"):
            print(f"      → {p['note'][:60]}")
        print()


def remove_pick(url_or_id: str, db_path: Path = DATABASE_PATH) -> bool:
    """Remove a pick by URL or ID."""
    db = load_database(db_path)
    original_count = len(db["picks"])

    db["picks"] = [
        p for p in db["picks"]
        if p["url"] != url_or_id and p["id"] != url_or_id
    ]

    if len(db["picks"]) < original_count:
        save_database(db, db_path)
        print(f"  Removed 1 pick.")
        return True
    else:
        print(f"  Pick not found: {url_or_id}")
        return False


# ─── CLI Entrypoint ──────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="Add content tips to Pedro's Picks database."
    )
    parser.add_argument(
        "url",
        nargs="?",
        help="URL of the content to add",
    )
    parser.add_argument(
        "--note", "-n",
        type=str,
        help="Personal note about why you picked this",
    )
    parser.add_argument(
        "--type", "-t",
        choices=["article", "video", "podcast_episode", "channel"],
        help="Force a specific pick type (auto-detected if omitted)",
    )
    parser.add_argument(
        "--featured",
        action="store_true",
        help="Mark as featured pick",
    )
    parser.add_argument(
        "--batch",
        type=Path,
        help="Path to a text file with one URL per line",
    )
    parser.add_argument(
        "--list",
        action="store_true",
        help="List all picks in the database",
    )
    parser.add_argument(
        "--remove",
        type=str,
        help="Remove a pick by URL or ID",
    )
    parser.add_argument(
        "--output", "-o",
        type=Path,
        default=DATABASE_PATH,
        help="Path to the JSON database file",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Preview without saving",
    )

    args = parser.parse_args()

    if args.list:
        list_picks(args.output)
        return

    if args.remove:
        remove_pick(args.remove, args.output)
        return

    if args.batch:
        if not args.batch.exists():
            print(f"File not found: {args.batch}")
            sys.exit(1)
        urls = [line.strip() for line in args.batch.read_text().splitlines()
                if line.strip() and not line.startswith("#")]
        print(f"Processing {len(urls)} URLs from {args.batch}...")
        added = 0
        for url in urls:
            result = add_pick(url, note=args.note, force_type=args.type,
                            featured=args.featured, db_path=args.output,
                            dry_run=args.dry_run)
            if result:
                added += 1
        print(f"\nDone. Added {added} new picks.")
        return

    if args.url:
        add_pick(args.url, note=args.note, force_type=args.type,
                featured=args.featured, db_path=args.output,
                dry_run=args.dry_run)
        return

    # Interactive mode
    print("Pedro's Tips Adder — Interactive Mode")
    print("Paste a URL (or 'q' to quit):\n")
    while True:
        url = input("  URL: ").strip()
        if url.lower() in ("q", "quit", "exit", ""):
            break
        try:
            note = input("  Note (optional): ").strip() or None
            featured_input = input("  Featured? (y/N): ").strip().lower()
            featured = featured_input in ("y", "yes")
            add_pick(url, note=note, featured=featured, db_path=args.output,
                    dry_run=args.dry_run)
        except Exception as e:
            print(f"  Error: {e}")
        print()


if __name__ == "__main__":
    main()
