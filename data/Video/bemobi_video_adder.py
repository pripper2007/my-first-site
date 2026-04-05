#!/usr/bin/env python3
"""
Bemobi Video Adder
==================
Add YouTube videos to the bemobi_videos_database.json by pasting a URL.
Automatically fetches metadata (title, thumbnail, duration, channel, date)
from YouTube and creates a structured entry.

Usage:
    python bemobi_video_adder.py <youtube_url>
    python bemobi_video_adder.py <youtube_url> --featured
    python bemobi_video_adder.py --batch urls.txt
    python bemobi_video_adder.py --list

Requirements:
    pip install requests beautifulsoup4 python-dateutil

For Claude Code integration:
    Claude can call this script to add new videos to the database.
    Example: python bemobi_video_adder.py "https://www.youtube.com/watch?v=XXXXX"
"""

import json
import re
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

DATABASE_PATH = Path(__file__).parent / "bemobi_videos_database.json"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                  "AppleWebKit/537.36 (KHTML, like Gecko) "
                  "Chrome/120.0.0.0 Safari/537.36",
    "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
}

# Known channels for auto-matching
KNOWN_CHANNELS = {
    "CNN Brasil": {"url": "https://www.youtube.com/@CNNbrasil", "tier": 1, "type": "news_media"},
    "VEJA": {"url": "https://www.youtube.com/@ABORREVEJA", "tier": 1, "type": "magazine"},
    "InfoMoney": {"url": "https://www.youtube.com/@InfoMoney", "tier": 1, "type": "financial_media"},
    "Expert XP": {"url": "https://www.youtube.com/@ExpertXP", "tier": 1, "type": "financial_media"},
    "NeoFeed": {"url": "https://www.youtube.com/@NeoFeed", "tier": 1, "type": "business_media"},
    "Brazil Journal": {"url": "https://www.youtube.com/@BrazilJournal", "tier": 1, "type": "business_media"},
    "Exame": {"url": "https://www.youtube.com/@exaborreveja", "tier": 1, "type": "business_media"},
    "Bloomberg Línea": {"url": "https://www.youtube.com/@BloombergLinea", "tier": 1, "type": "financial_media"},
    "Valor Econômico": {"url": "https://www.youtube.com/@ValorEconomico", "tier": 1, "type": "business_media"},
    "B3": {"url": "https://www.youtube.com/@B3oficial", "tier": 1, "type": "exchange"},
}

# Category inference from title/description keywords
CATEGORY_KEYWORDS = {
    "interview": ["entrevista", "interview", "conversa com", "na mesa com", "é negócio"],
    "earnings": ["balanço", "resultado", "lucro", "receita", "earnings", "trimestre", "1t", "2t", "3t", "4t"],
    "payments": ["pagamento", "payment", "pix", "checkout", "tpv", "fintech"],
    "technology": ["tecnologia", "technology", "digital", "ai", "ia", "plataforma"],
    "company_history": ["história", "fundador", "origem", "do zero", "jornada"],
    "strategy": ["estratégia", "crescimento", "growth", "planos futuros", "avenidas"],
    "leadership": ["ceo", "presidente", "líder", "gestão"],
    "games": ["games", "jogos", "gaming"],
    "entrepreneurship": ["empreendedor", "entrepreneur", "startup"],
    "podcast": ["podcast", "episódio", "ep.", "#"],
    "panel": ["painel", "panel", "mesa redonda", "debate"],
    "media_appearance": ["cnn", "veja", "globo", "tv"],
}


# ─── Utility Functions ───────────────────────────────────────────────────────

def extract_video_id(url: str) -> str:
    """Extract YouTube video ID from various URL formats."""
    parsed = urlparse(url)

    # Standard: youtube.com/watch?v=ID
    if "youtube.com" in parsed.netloc:
        params = parse_qs(parsed.query)
        if "v" in params:
            return params["v"][0]
        # youtube.com/embed/ID
        if "/embed/" in parsed.path:
            return parsed.path.split("/embed/")[1].split("?")[0]
        # youtube.com/v/ID
        if "/v/" in parsed.path:
            return parsed.path.split("/v/")[1].split("?")[0]

    # Short: youtu.be/ID
    if "youtu.be" in parsed.netloc:
        return parsed.path.lstrip("/").split("?")[0]

    raise ValueError(f"Could not extract video ID from: {url}")


def parse_iso_duration(duration: str) -> tuple:
    """Parse ISO 8601 duration (PT1H30M45S) to (seconds, display_string)."""
    match = re.match(r'PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?', duration)
    if not match:
        return (0, "0min")

    hours = int(match.group(1) or 0)
    minutes = int(match.group(2) or 0)
    seconds = int(match.group(3) or 0)

    total_seconds = hours * 3600 + minutes * 60 + seconds

    if hours > 0:
        display = f"{hours}h {minutes:02d}min"
    else:
        display = f"{minutes}min"

    return (total_seconds, display)


def generate_slug(title: str) -> str:
    """Generate a URL-safe slug from a title."""
    slug = title.lower().strip()
    # Remove common Portuguese accents
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


def infer_categories(title: str, description: str = "") -> list:
    """Auto-categorize based on title and description keywords."""
    text = f"{title} {description}".lower()
    categories = []
    for cat, keywords in CATEGORY_KEYWORDS.items():
        if any(kw in text for kw in keywords):
            categories.append(cat)
    return categories if categories else ["general"]


def infer_content_type(title: str, description: str = "", channel: str = "") -> str:
    """Infer the content type from context."""
    text = f"{title} {description} {channel}".lower()
    if any(kw in text for kw in ["podcast", "episódio", "#", "ep."]):
        return "podcast"
    if any(kw in text for kw in ["painel", "panel", "mesa redonda"]):
        return "panel"
    if any(kw in text for kw in ["cnn", "globo", "band"]):
        return "tv_interview"
    if any(kw in text for kw in ["veja", "exame", "forbes"]):
        return "magazine_interview"
    return "interview"


def extract_people(description: str) -> list:
    """Try to extract mentioned people from description."""
    people = []
    if "pedro ripper" in description.lower():
        people.append("Pedro Ripper")
    # Look for common patterns like "Nome Sobrenome, cargo"
    patterns = [
        r'(?:com|participante[s]?)\s+([A-ZÀ-Ü][a-zà-ü]+\s+[A-ZÀ-Ü][a-zà-ü]+)',
    ]
    for pattern in patterns:
        matches = re.findall(pattern, description)
        for m in matches:
            if m not in people and m != "Pedro Ripper":
                people.append(m)
    return people if people else ["Pedro Ripper"]


# ─── YouTube Metadata Fetcher ────────────────────────────────────────────────

def fetch_youtube_metadata(video_id: str) -> dict:
    """Fetch metadata from a YouTube video page."""
    url = f"https://www.youtube.com/watch?v={video_id}"
    print(f"  Fetching: {url}")

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

        description = meta(name="description") or ""
        date_raw = meta(itemprop="datePublished") or meta(itemprop="uploadDate")
        duration_raw = meta(itemprop="duration") or ""
        thumbnail = None

        # Get thumbnail from link tag
        link_tag = soup.find("link", rel="image_src")
        if link_tag:
            thumbnail = link_tag.get("href")
        if not thumbnail:
            thumbnail = meta(prop="og:image")

        # Get channel name
        channel_link = soup.find("link", itemprop="name")
        channel_name = channel_link.get("content") if channel_link else None

        # Parse date
        published_at = None
        if date_raw:
            try:
                published_at = dateparser.parse(date_raw).strftime("%Y-%m-%d")
            except Exception:
                pass

        return {
            "title": title,
            "description": description[:500],
            "published_at": published_at,
            "duration": duration_raw,
            "thumbnail": thumbnail,
            "channel_name": channel_name,
        }

    except Exception as e:
        print(f"  Error fetching metadata: {e}")
        print("  You can manually enter metadata when prompted.")
        return {}


# ─── Database Operations ─────────────────────────────────────────────────────

def load_database(path: Path) -> dict:
    """Load existing database or create a new empty one."""
    if path.exists():
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {
        "metadata": {
            "database_name": "Bemobi Videos Database",
            "version": "1.0.0",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "last_updated": datetime.now(timezone.utc).isoformat(),
            "total_videos": 0,
            "content_filter": "videos_only",
            "platforms": ["youtube"],
            "description": "Curated database of YouTube videos about Bemobi and Pedro Ripper.",
        },
        "videos": [],
        "categories_taxonomy": [],
        "channels_registry": [],
    }


def save_database(db: dict, path: Path):
    """Save database to JSON file."""
    db["metadata"]["last_updated"] = datetime.now(timezone.utc).isoformat()
    db["metadata"]["total_videos"] = len(db["videos"])
    with open(path, "w", encoding="utf-8") as f:
        json.dump(db, f, ensure_ascii=False, indent=2)
    print(f"\nDatabase saved: {path} ({db['metadata']['total_videos']} videos)")


def video_exists(db: dict, video_id: str) -> bool:
    """Check if a video already exists in the database."""
    return any(v["id"] == video_id for v in db.get("videos", []))


def create_video_entry(video_id: str, meta: dict, featured: bool = False) -> dict:
    """Create a structured video entry from metadata."""
    title = meta.get("title", "")
    description = meta.get("description", "")
    channel_name = meta.get("channel_name", "Unknown")
    duration_raw = meta.get("duration", "")
    published_at = meta.get("published_at", datetime.now(timezone.utc).strftime("%Y-%m-%d"))

    duration_seconds, duration_display = parse_iso_duration(duration_raw)

    # Look up channel in known channels
    channel_info = KNOWN_CHANNELS.get(channel_name, {})
    channel_url = channel_info.get("url")

    return {
        "id": video_id,
        "title": title,
        "slug": generate_slug(title),
        "url": f"https://www.youtube.com/watch?v={video_id}",
        "embed_url": f"https://www.youtube.com/embed/{video_id}",
        "platform": "youtube",
        "channel": {
            "name": channel_name,
            "url": channel_url,
        },
        "published_at": published_at,
        "discovered_at": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        "duration": duration_raw,
        "duration_seconds": duration_seconds,
        "duration_display": duration_display,
        "thumbnail": {
            "default": f"https://i.ytimg.com/vi/{video_id}/default.jpg",
            "medium": f"https://i.ytimg.com/vi/{video_id}/mqdefault.jpg",
            "high": f"https://i.ytimg.com/vi/{video_id}/hqdefault.jpg",
            "maxres": f"https://i.ytimg.com/vi/{video_id}/maxresdefault.jpg",
        },
        "description": description[:500],
        "categories": infer_categories(title, description),
        "tags": [],
        "language": "pt-BR",
        "content_type": infer_content_type(title, description, channel_name),
        "featured": featured,
        "people": extract_people(f"{title} {description}"),
    }


def add_video(url: str, db_path: Path = DATABASE_PATH, featured: bool = False, dry_run: bool = False) -> dict:
    """Add a single video to the database. Returns the video entry."""
    video_id = extract_video_id(url)
    db = load_database(db_path)

    if video_exists(db, video_id):
        print(f"  Video already exists: {video_id}")
        return None

    meta = fetch_youtube_metadata(video_id)
    entry = create_video_entry(video_id, meta, featured=featured)

    print(f"\n  Title:    {entry['title']}")
    print(f"  Channel:  {entry['channel']['name']}")
    print(f"  Date:     {entry['published_at']}")
    print(f"  Duration: {entry['duration_display']}")
    print(f"  Type:     {entry['content_type']}")
    print(f"  Featured: {entry['featured']}")

    if not dry_run:
        db["videos"].append(entry)
        # Sort by date (newest first)
        db["videos"].sort(
            key=lambda v: v.get("published_at", "1900-01-01"),
            reverse=True,
        )
        save_database(db, db_path)

    return entry


def list_videos(db_path: Path = DATABASE_PATH):
    """List all videos currently in the database."""
    db = load_database(db_path)
    videos = db.get("videos", [])

    if not videos:
        print("No videos in database.")
        return

    print(f"\n{'='*70}")
    print(f"Bemobi Videos Database — {len(videos)} videos")
    print(f"{'='*70}\n")

    for i, v in enumerate(videos, 1):
        star = " ★" if v.get("featured") else ""
        print(f"  {i:2d}. [{v['published_at']}] {v['title'][:55]}...")
        print(f"      {v['duration_display']} | {v['channel']['name']} | {v['content_type']}{star}")
        print(f"      {v['url']}")
        print()


# ─── CLI Entrypoint ──────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="Add YouTube videos to the Bemobi videos database."
    )
    parser.add_argument(
        "url",
        nargs="?",
        help="YouTube video URL to add",
    )
    parser.add_argument(
        "--featured",
        action="store_true",
        help="Mark the video as featured",
    )
    parser.add_argument(
        "--batch",
        type=Path,
        help="Path to a text file with one YouTube URL per line",
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
    parser.add_argument(
        "--list",
        action="store_true",
        help="List all videos in the database",
    )

    args = parser.parse_args()

    if args.list:
        list_videos(args.output)
        return

    if args.batch:
        if not args.batch.exists():
            print(f"File not found: {args.batch}")
            sys.exit(1)
        urls = [line.strip() for line in args.batch.read_text().splitlines() if line.strip() and not line.startswith("#")]
        print(f"Processing {len(urls)} URLs from {args.batch}...")
        added = 0
        for url in urls:
            result = add_video(url, db_path=args.output, featured=args.featured, dry_run=args.dry_run)
            if result:
                added += 1
        print(f"\nDone. Added {added} new videos.")
        return

    if args.url:
        add_video(args.url, db_path=args.output, featured=args.featured, dry_run=args.dry_run)
        return

    # Interactive mode: prompt for URL
    print("Bemobi Video Adder — Interactive Mode")
    print("Enter a YouTube URL (or 'q' to quit):\n")
    while True:
        url = input("  URL: ").strip()
        if url.lower() in ("q", "quit", "exit", ""):
            break
        try:
            featured_input = input("  Featured? (y/N): ").strip().lower()
            featured = featured_input in ("y", "yes")
            add_video(url, db_path=args.output, featured=featured, dry_run=args.dry_run)
        except Exception as e:
            print(f"  Error: {e}")
        print()


if __name__ == "__main__":
    main()
