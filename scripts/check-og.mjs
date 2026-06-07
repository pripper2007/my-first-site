/**
 * OG tags guard — fails (exit 1) if any public page is shipping the
 * generic homepage Open Graph card instead of its own.
 *
 * Why: child pages that set only title/description inherit the root
 * layout's openGraph block wholesale, so shared links (LinkedIn/WhatsApp)
 * render the homepage card. This script catches that regression.
 *
 * Checks every URL in the production sitemap (plus a hardcoded must-check
 * list as a safety net) and asserts:
 *   1. og:title exists and, for non-home pages, is NOT the generic one
 *   2. og:url matches the page's own URL (not the homepage)
 *
 * Usage: node scripts/check-og.mjs   (SITE_URL env overrides the target)
 */
const BASE = (process.env.SITE_URL || "https://pedroripper.com").replace(/\/$/, "");
const GENERIC_TITLE = "Pedro Ripper — Co-fundador & CEO da Bemobi";
const MUST_CHECK = ["/", "/base", "/irpf-skill", "/insights"];

function og(html, prop) {
  const m = html.match(
    new RegExp(`<meta property="og:${prop}" content="([^"]*)"`)
  );
  return m ? m[1].replace(/&amp;/g, "&") : null;
}

async function main() {
  // Collect URLs: sitemap + must-check list
  const urls = new Set(MUST_CHECK.map((p) => `${BASE}${p === "/" ? "" : p}`));
  try {
    const sm = await (await fetch(`${BASE}/sitemap.xml`)).text();
    for (const m of sm.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      urls.add(m[1].replace(/\/$/, "") || BASE);
    }
  } catch {
    console.warn("⚠ sitemap.xml unreachable — checking must-list only");
  }

  const failures = [];
  for (const url of urls) {
    let html = null;
    // up to 3 attempts — content reads can blip during blob writes/bursts
    for (let attempt = 1; attempt <= 3 && html === null; attempt++) {
      try {
        const res = await fetch(url, { redirect: "follow" });
        if (res.ok) { html = await res.text(); break; }
        if (attempt === 3) failures.push(`${url} → HTTP ${res.status}`);
      } catch (e) {
        if (attempt === 3) failures.push(`${url} → fetch failed (${e.message})`);
      }
      if (html === null && attempt < 3) await new Promise((r) => setTimeout(r, 10000));
    }
    if (html === null) continue;

    const title = og(html, "title");
    const ogUrl = og(html, "url");
    const isHome = url === BASE;

    if (!title) {
      failures.push(`${url} → sem og:title`);
    } else if (!isHome && title === GENERIC_TITLE) {
      failures.push(`${url} → og:title GENÉRICO (herdou o da home)`);
    }
    if (!isHome && ogUrl && ogUrl.replace(/\/$/, "") === BASE) {
      failures.push(`${url} → og:url aponta para a home`);
    }
    console.log(`  ${failures.some((f) => f.startsWith(url)) ? "✗" : "✓"} ${url}`);
  }

  if (failures.length) {
    console.error(`\n❌ ${failures.length} problema(s) de Open Graph:`);
    failures.forEach((f) => console.error("  - " + f));
    process.exit(1);
  }
  console.log(`\n✅ OG ok em ${urls.size} páginas.`);
}

main();
