/**
 * AI-SEO validator — checks the production site for the crawlability
 * contract that makes it legible to search engines and AI agents:
 *
 *  1. Main URLs return 200
 *  2. sitemap.xml, robots.txt, llms.txt and llms-full.txt exist
 *  3. Article pages contain the full text body in the initial HTML
 *  4. Main pages have <title> and meta description
 *  5. JSON-LD is present on home, profile and article pages
 *
 * Usage: node scripts/validate-seo.mjs   (SITE_URL overrides target)
 * Run together with check-og.mjs via: npm run validate:seo
 */
const BASE = (process.env.SITE_URL || "https://pedroripper.com").replace(/\/$/, "");

const MAIN_PAGES = [
  "/", "/about", "/pedro-ripper", "/insights", "/picks", "/books",
  "/talks", "/news", "/base", "/irpf-skill", "/linkedin-analytics", "/newsletter", "/press-kit", "/sources",
  "/topics/ai-agents", "/topics/digital-payments", "/topics/company-building", "/topics/books-and-learning",
];
// canary articles: body marker strings that must appear in the raw HTML
const ARTICLE_BODY_CANARIES = {
  "/insights/base-de-conhecimento": "superpoder de correlação",
  "/insights/tesla-fsd-12-anos": "Software 2.0 na prática",
  "/insights/caminho-seguro-confortavel-errado": "o caminho seguro, confortável e errado",
};
const TEXT_FILES = ["/sitemap.xml", "/robots.txt", "/llms.txt", "/llms-full.txt"];
const JSONLD_PAGES = ["/", "/pedro-ripper", "/insights/base-de-conhecimento"];

const failures = [];
const get = async (path) => {
  // up to 3 attempts — production content reads can hiccup for a moment
  // during blob writes/deploy alias switches; don't fail CI on a blip
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await fetch(`${BASE}${path}`, { redirect: "follow" });
      if (res.ok) return { ok: true, status: res.status, text: await res.text() };
      if (attempt >= 3) return { ok: false, status: res.status, text: "" };
    } catch (e) {
      if (attempt >= 3) return { ok: false, status: 0, text: "" };
    }
    await new Promise((r) => setTimeout(r, 10000));
  }
};

// 1 + 4: main pages 200 with title + description
for (const p of MAIN_PAGES) {
  const r = await get(p);
  if (!r.ok) { failures.push(`${p} → HTTP ${r.status}`); continue; }
  if (!/<title>[^<]+<\/title>/.test(r.text)) failures.push(`${p} → sem <title>`);
  if (!/<meta name="description" content="[^"]+"/.test(r.text))
    failures.push(`${p} → sem meta description`);
  console.log(`  ✓ ${p}`);
}

// 2: machine-readable files
for (const f of TEXT_FILES) {
  const r = await get(f);
  if (!r.ok || r.text.length < 50) failures.push(`${f} → ausente ou vazio (HTTP ${r.status})`);
  else console.log(`  ✓ ${f}`);
}

// 3: article bodies present in initial HTML
for (const [path, canary] of Object.entries(ARTICLE_BODY_CANARIES)) {
  const r = await get(path);
  if (!r.ok) { failures.push(`${path} → HTTP ${r.status}`); continue; }
  if (!r.text.includes(canary))
    failures.push(`${path} → corpo do artigo AUSENTE do HTML inicial (canário "${canary}")`);
  else if (r.text.includes("<iframe"))
    failures.push(`${path} → ainda usa iframe`);
  else console.log(`  ✓ ${path} (corpo presente)`);
}

// 5: JSON-LD presence
for (const p of JSONLD_PAGES) {
  const r = await get(p);
  if (!r.text.includes("application/ld+json"))
    failures.push(`${p} → sem JSON-LD`);
  else console.log(`  ✓ ${p} (JSON-LD)`);
}

if (failures.length) {
  console.error(`\n❌ ${failures.length} problema(s) de AI-SEO:`);
  failures.forEach((f) => console.error("  - " + f));
  process.exit(1);
}
console.log("\n✅ validate-seo: tudo ok.");
