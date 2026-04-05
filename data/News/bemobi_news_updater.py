#!/usr/bin/env python3
"""
Bemobi News Database Updater
=============================
Searches Google News for new Bemobi articles and incrementally updates
the JSON database. Designed to be run regularly (manually or via cron/scheduler)
and only adds articles not already present (deduplication by URL).

Usage:
    python bemobi_news_updater.py                    # Run update
    python bemobi_news_updater.py --dry-run           # Preview without saving
    python bemobi_news_updater.py --output custom.json # Custom output path

Requirements:
    pip install requests beautifulsoup4 python-dateutil

For Claude Code integration:
    This script is designed to be called by Claude Code to refresh the
    bemobi_news_database.json file. Claude can also enrich the results
    with AI-generated categories and excerpts after the initial scrape.
"""

import json
import hashlib
import re
import argparse
import sys
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse, quote_plus

try:
    import requests
    from bs4 import BeautifulSoup
    from dateutil import parser as dateparser
except ImportError:
    print("Missing dependencies. Install with:")
    print("  pip install requests beautifulsoup4 python-dateutil")
    sys.exit(1)


# ─── Configuration ───────────────────────────────────────────────────────────

DATABASE_PATH = Path(__file__).parent / "bemobi_news_database.json"

SEARCH_QUERIES = [
    "Bemobi Mobile Tech",
    "Bemobi BMOB3",
    "Bemobi pagamentos fintech",
    "Bemobi Pedro Ripper",
    "Bemobi aquisição",
    "Bemobi earnings results",
]

# Sources we trust (tier 1 and 2). Articles from unknown domains are flagged.
KNOWN_SOURCES = {
    "braziljournal.com": {"name": "Brazil Journal", "type": "business_media", "tier": 1},
    "mobiletime.com.br": {"name": "Mobile Time", "type": "tech_media", "tier": 1},
    "investing.com": {"name": "Investing.com", "type": "financial_media", "tier": 1},
    "br.investing.com": {"name": "Investing.com Brasil", "type": "financial_media", "tier": 1},
    "finance.yahoo.com": {"name": "Yahoo Finance", "type": "financial_media", "tier": 1},
    "ca.finance.yahoo.com": {"name": "Yahoo Finance", "type": "financial_media", "tier": 1},
    "bloomberg.com": {"name": "Bloomberg", "type": "financial_media", "tier": 1},
    "finsidersbrasil.com.br": {"name": "Finsiders Brasil", "type": "fintech_media", "tier": 1},
    "infomoney.com.br": {"name": "InfoMoney", "type": "financial_media", "tier": 1},
    "teletime.com.br": {"name": "Teletime", "type": "telecom_media", "tier": 1},
    "bemobi.com": {"name": "Bemobi (Pressroom)", "type": "corporate_media", "tier": 1},
    "entrepreneur.com": {"name": "Entrepreneur", "type": "business_media", "tier": 1},
    "tiinside.com.br": {"name": "TI Inside", "type": "tech_media", "tier": 2},
    "br.advfn.com": {"name": "ADVFN", "type": "financial_media", "tier": 2},
    "advfn.com": {"name": "ADVFN", "type": "financial_media", "tier": 2},
    "financenews.com.br": {"name": "Finance News", "type": "financial_media", "tier": 2},
    "nordinvestimentos.com.br": {"name": "Nord Investimentos", "type": "financial_media", "tier": 2},
    "fincatch.com.br": {"name": "FinCatch", "type": "fintech_media", "tier": 2},
    "fusoesaquisicoes.com": {"name": "Portal Fusões & Aquisições", "type": "business_media", "tier": 2},
    "valor.globo.com": {"name": "Valor Econômico", "type": "business_media", "tier": 1},
    "exame.com": {"name": "Exame", "type": "business_media", "tier": 1},
    "startups.com.br": {"name": "Startups", "type": "tech_media", "tier": 2},
    "neofeed.com.br": {"name": "NeoFeed", "type": "business_media", "tier": 1},
    "cnnbrasil.com.br": {"name": "CNN Brasil", "type": "news_media", "tier": 1},
    "reuters.com": {"name": "Reuters", "type": "news_media", "tier": 1},
    "forbes.com": {"name": "Forbes", "type": "business_media", "tier": 1},
    "forbes.com.br": {"name": "Forbes Brasil", "type": "business_media", "tier": 1},
    "stockanalysis.com": {"name": "Stock Analysis", "type": "financial_media", "tier": 2},
    "tradingview.com": {"name": "TradingView", "type": "financial_media", "tier": 2},
    "morningstar.com": {"name": "Morningstar", "type": "financial_media", "tier": 1},
    "seekingalpha.com": {"name": "Seeking Alpha", "type": "financial_media", "tier": 1},
    "appdevelopermagazine.com": {"name": "App Developer Magazine", "type": "tech_media", "tier": 2},
    "bnamericas.com": {"name": "BNamericas", "type": "business_media", "tier": 1},
    "investidor10.com.br": {"name": "Investidor10", "type": "financial_media", "tier": 2},
}

# Domains to always skip (aggregators, SEO spam, video platforms, etc.)
# IMPORTANT: Video content (YouTube, Vimeo, etc.) goes in a SEPARATE database.
# This updater is for written articles only.
BLOCKED_DOMAINS = {
    # Social media
    "facebook.com", "twitter.com", "x.com", "linkedin.com", "instagram.com",
    "reddit.com", "pinterest.com", "tiktok.com",
    # Video platforms (handled in bemobi_videos_database.json)
    "youtube.com", "youtu.be", "vimeo.com", "dailymotion.com",
    # Audio/podcast platforms
    "soundcloud.com", "spotify.com", "open.spotify.com", "podcasts.apple.com",
    # Search engines
    "google.com", "bing.com", "duckduckgo.com",
}

# Additional URL patterns that indicate video content (even on article domains)
VIDEO_URL_PATTERNS = [
    "youtube.com", "youtu.be", "vimeo.com", "/video/", "/videos/",
    "dailymotion.com", "twitch.tv",
]

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                  "AppleWebKit/537.36 (KHTML, like Gecko) "
                  "Chrome/120.0.0.0 Safari/537.36",
    "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
}

# Category inference rules (keyword -> category)
CATEGORY_KEYWORDS = {
    "earnings": ["lucro", "receita", "resultado", "ebitda", "earnings", "revenue", "profit", "4t", "3t", "2t", "1t", "trimestre", "quarter"],
    "acquisition": ["aquisição", "compra", "acquisition", "acquire", "m&a", "fusão", "merger"],
    "payments": ["pagamento", "payment", "pix", "checkout", "tpv", "pay", "fintech"],
    "AI": ["inteligência artificial", "ai", "machine learning", "grace", "ml"],
    "leadership": ["ceo", "pedro ripper", "vp", "diretor", "executivo", "nomeia"],
    "stock": ["ação", "bmob3", "bolsa", "stock", "cotação", "valorização", "dispara"],
    "partnerships": ["parceria", "partnership", "acordo", "contrato"],
    "product": ["lança", "launch", "produto", "product", "plataforma", "smart checkout", "open gateway"],
    "international": ["internacional", "global", "américa latina", "england", "spain", "latam"],
    "telecom": ["telecom", "operadora", "tele", "carrier"],
    "strategy": ["estratégia", "strategy", "crescimento", "growth", "expansão"],
    "media_appearance": ["cnn", "entrevista", "interview", "podcast"],
}


# ─── Core Functions ──────────────────────────────────────────────────────────

def load_database(path: Path) -> dict:
    """Load existing database or create a new empty one."""
    if path.exists():
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {
        "metadata": {
            "database_name": "Bemobi News Database",
            "version": "1.0.0",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "last_updated": datetime.now(timezone.utc).isoformat(),
            "total_articles": 0,
            "description": "Curated database of news articles about Bemobi Mobile Tech.",
        },
        "articles": [],
        "categories_taxonomy": [],
        "sources_registry": [],
    }


def save_database(db: dict, path: Path):
    """Save database to JSON file."""
    db["metadata"]["last_updated"] = datetime.now(timezone.utc).isoformat()
    db["metadata"]["total_articles"] = len(db["articles"])
    with open(path, "w", encoding="utf-8") as f:
        json.dump(db, f, ensure_ascii=False, indent=2)
    print(f"Database saved: {path} ({db['metadata']['total_articles']} articles)")


def get_existing_urls(db: dict) -> set:
    """Extract all URLs already in the database for deduplication."""
    return {article["url"] for article in db.get("articles", [])}


def generate_article_id(url: str, title: str, date_str: str) -> str:
    """Generate a deterministic ID for an article."""
    slug = re.sub(r'[^a-z0-9]+', '-', title.lower().strip())[:60].strip('-')
    date_prefix = date_str[:10] if date_str else "undated"
    domain = urlparse(url).netloc.replace("www.", "").split(".")[0]
    return f"bemobi-{date_prefix}-{domain}-{slug[:40]}"


def identify_source(url: str) -> dict:
    """Identify the source publication from the URL domain."""
    parsed = urlparse(url)
    domain = parsed.netloc.replace("www.", "")

    if domain in KNOWN_SOURCES:
        info = KNOWN_SOURCES[domain]
        return {
            "name": info["name"],
            "domain": domain,
            "type": info["type"],
            "language": "pt-BR" if domain.endswith(".br") or domain.endswith(".com.br") else "en",
            "logo_url": None,
            "tier": info["tier"],
        }

    # Check parent domain
    parts = domain.split(".")
    if len(parts) > 2:
        parent = ".".join(parts[-2:])
        if parent in KNOWN_SOURCES:
            info = KNOWN_SOURCES[parent]
            return {
                "name": info["name"],
                "domain": domain,
                "type": info["type"],
                "language": "pt-BR" if "br" in domain else "en",
                "logo_url": None,
                "tier": info["tier"],
            }

    return {
        "name": domain,
        "domain": domain,
        "type": "unknown",
        "language": "pt-BR" if "br" in domain else "en",
        "logo_url": None,
        "tier": 3,
    }


def infer_categories(title: str, excerpt: str = "") -> list:
    """Auto-categorize an article based on its title and excerpt."""
    text = f"{title} {excerpt}".lower()
    categories = []
    for cat, keywords in CATEGORY_KEYWORDS.items():
        if any(kw in text for kw in keywords):
            categories.append(cat)
    return categories if categories else ["general"]


def generate_slug(title: str) -> str:
    """Generate a URL-safe slug from a title."""
    slug = title.lower().strip()
    slug = re.sub(r'[àáâãäå]', 'a', slug)
    slug = re.sub(r'[èéêë]', 'e', slug)
    slug = re.sub(r'[ìíîï]', 'i', slug)
    slug = re.sub(r'[òóôõö]', 'o', slug)
    slug = re.sub(r'[ùúûü]', 'u', slug)
    slug = re.sub(r'[ç]', 'c', slug)
    slug = re.sub(r'[^a-z0-9]+', '-', slug)
    return slug[:80].strip('-')


def is_blocked_domain(url: str) -> bool:
    """Check if a URL belongs to a blocked domain."""
    domain = urlparse(url).netloc.replace("www.", "")
    return domain in BLOCKED_DOMAINS


def is_video_url(url: str) -> bool:
    """Check if a URL points to video content. Videos go in a separate DB."""
    url_lower = url.lower()
    return any(pattern in url_lower for pattern in VIDEO_URL_PATTERNS)


def fetch_article_metadata(url: str, timeout: int = 10) -> dict:
    """
    Fetch Open Graph and meta tag metadata from an article URL.
    Returns dict with image_url, excerpt, published_at if available.
    """
    try:
        resp = requests.get(url, headers=HEADERS, timeout=timeout, allow_redirects=True)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "html.parser")

        metadata = {}

        # OG Image
        og_image = soup.find("meta", property="og:image")
        if og_image and og_image.get("content"):
            metadata["image_url"] = og_image["content"]

        # OG Description
        og_desc = soup.find("meta", property="og:description")
        if og_desc and og_desc.get("content"):
            metadata["excerpt"] = og_desc["content"][:300]

        # Published date
        for prop in ["article:published_time", "og:article:published_time", "datePublished"]:
            tag = soup.find("meta", property=prop) or soup.find("meta", attrs={"name": prop})
            if tag and tag.get("content"):
                try:
                    metadata["published_at"] = dateparser.parse(tag["content"]).strftime("%Y-%m-%d")
                except Exception:
                    pass
                break

        # Author
        author_tag = soup.find("meta", attrs={"name": "author"})
        if author_tag and author_tag.get("content"):
            metadata["author"] = author_tag["content"]

        return metadata

    except Exception as e:
        print(f"  Warning: Could not fetch metadata for {url}: {e}")
        return {}


def create_article_entry(
    url: str,
    title: str,
    excerpt: str = "",
    published_at: str = None,
    image_url: str = None,
    enrich: bool = False,
) -> dict:
    """Create a structured article entry for the database."""
    source = identify_source(url)
    categories = infer_categories(title, excerpt)
    date_str = published_at or datetime.now(timezone.utc).strftime("%Y-%m-%d")

    entry = {
        "id": generate_article_id(url, title, date_str),
        "title": title,
        "slug": generate_slug(title),
        "url": url,
        "source": {
            "name": source["name"],
            "domain": source["domain"],
            "type": source["type"],
            "language": source["language"],
            "logo_url": source.get("logo_url"),
        },
        "published_at": date_str,
        "discovered_at": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        "image_url": image_url,
        "thumbnail_url": None,
        "excerpt": excerpt[:300] if excerpt else None,
        "categories": categories,
        "tags": [],
        "language": source["language"],
        "content_type": "news",
        "relevance": "high" if source.get("tier", 3) == 1 else "medium",
        "featured": False,
    }

    # Optionally enrich with metadata from the page itself
    if enrich:
        print(f"  Enriching: {url[:80]}...")
        meta = fetch_article_metadata(url)
        if meta.get("image_url") and not entry["image_url"]:
            entry["image_url"] = meta["image_url"]
        if meta.get("excerpt") and not entry["excerpt"]:
            entry["excerpt"] = meta["excerpt"]
        if meta.get("published_at") and entry["published_at"] == datetime.now(timezone.utc).strftime("%Y-%m-%d"):
            entry["published_at"] = meta["published_at"]
        if meta.get("author"):
            entry["author"] = meta["author"]

    return entry


def search_google_news(query: str, num_results: int = 10) -> list:
    """
    Search Google for news articles about a query.
    Returns list of dicts with url, title, and snippet.

    NOTE: This uses Google's regular search. For production use,
    consider using Google Custom Search API or a news API like
    NewsAPI, GNews, or similar for more reliable results.
    """
    encoded_query = quote_plus(query)
    search_url = f"https://www.google.com/search?q={encoded_query}&tbm=nws&num={num_results}"

    try:
        resp = requests.get(search_url, headers=HEADERS, timeout=15)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "html.parser")

        results = []

        # Parse Google News results
        for item in soup.select("div.SoaBEf, div.dbsr, div.xuvV6b"):
            link = item.find("a", href=True)
            if not link:
                continue

            url = link["href"]
            if url.startswith("/url?q="):
                url = url.split("/url?q=")[1].split("&")[0]

            title_el = item.find("div", class_="MBeuO") or item.find("div", role="heading")
            title = title_el.get_text(strip=True) if title_el else ""

            snippet_el = item.find("div", class_="GI74Re") or item.find("span", class_="xBbh9")
            snippet = snippet_el.get_text(strip=True) if snippet_el else ""

            if url and title and not is_blocked_domain(url):
                results.append({"url": url, "title": title, "snippet": snippet})

        return results

    except Exception as e:
        print(f"  Search error for '{query}': {e}")
        return []


def run_update(
    db_path: Path = DATABASE_PATH,
    enrich: bool = False,
    dry_run: bool = False,
) -> dict:
    """
    Main update routine. Searches for new articles and adds them to the DB.
    Returns summary of changes.
    """
    print(f"\n{'='*60}")
    print(f"Bemobi News Database Updater")
    print(f"{'='*60}")
    print(f"Database: {db_path}")
    print(f"Enrich metadata: {enrich}")
    print(f"Dry run: {dry_run}")
    print(f"Time: {datetime.now(timezone.utc).isoformat()}")
    print(f"{'='*60}\n")

    db = load_database(db_path)
    existing_urls = get_existing_urls(db)
    print(f"Existing articles: {len(existing_urls)}")

    new_articles = []
    skipped = 0

    for query in SEARCH_QUERIES:
        print(f"\nSearching: '{query}'...")
        results = search_google_news(query)
        print(f"  Found {len(results)} results")

        for result in results:
            url = result["url"]

            # Skip if already in database
            if url in existing_urls:
                skipped += 1
                continue

            # Skip blocked domains and video URLs
            if is_blocked_domain(url):
                continue
            if is_video_url(url):
                print(f"  Skipping video URL (separate DB): {url[:60]}...")
                continue

            # Skip unknown low-tier sources
            source = identify_source(url)
            if source["type"] == "unknown" and source.get("tier", 3) >= 3:
                print(f"  Skipping unknown source: {source['domain']}")
                continue

            article = create_article_entry(
                url=url,
                title=result["title"],
                excerpt=result.get("snippet", ""),
                enrich=enrich,
            )

            new_articles.append(article)
            existing_urls.add(url)  # Prevent duplicates within this run
            print(f"  + New: {result['title'][:70]}...")

    # Add new articles to database
    if new_articles and not dry_run:
        db["articles"].extend(new_articles)
        # Sort by date (newest first)
        db["articles"].sort(
            key=lambda a: a.get("published_at", "1900-01-01"),
            reverse=True,
        )
        save_database(db, db_path)

    summary = {
        "new_articles": len(new_articles),
        "skipped_duplicates": skipped,
        "total_articles": len(db["articles"]) + (len(new_articles) if dry_run else 0),
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }

    print(f"\n{'='*60}")
    print(f"Summary:")
    print(f"  New articles found: {summary['new_articles']}")
    print(f"  Duplicates skipped: {summary['skipped_duplicates']}")
    print(f"  Total in database:  {summary['total_articles']}")
    if dry_run:
        print(f"  (DRY RUN - no changes saved)")
    print(f"{'='*60}\n")

    return summary


# ─── CLI entrypoint ──────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="Update the Bemobi news database with new articles from Google News."
    )
    parser.add_argument(
        "--output", "-o",
        type=Path,
        default=DATABASE_PATH,
        help="Path to the JSON database file",
    )
    parser.add_argument(
        "--enrich",
        action="store_true",
        help="Fetch metadata (OG image, description) from each article URL",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Preview changes without saving to the database",
    )

    args = parser.parse_args()
    run_update(db_path=args.output, enrich=args.enrich, dry_run=args.dry_run)


if __name__ == "__main__":
    main()
