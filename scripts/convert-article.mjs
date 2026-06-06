/**
 * Converts standalone article HTML (public/articles/<slug>.html) into
 * server-renderable fragments (src/content/articles/<slug>.html) so the
 * canonical /insights/[slug] route can inline the FULL article body in the
 * initial HTML (crawlable by search engines and AI agents) instead of an
 * iframe.
 *
 * The fragment = scoped <style> + the <article>…</article> markup.
 * CSS scoping: every selector is prefixed with `.article-doc`; `:root`,
 * `html`/`body` rules become `.article-doc` itself. One level of @media
 * nesting is supported (matches our templates).
 *
 * Usage: node scripts/convert-article.mjs [slug…]   (no args = all)
 */
import fs from "fs";
import path from "path";

const SRC = "public/articles";
const OUT = "src/content/articles";

function scopeSelector(sel) {
  const s = sel.trim();
  if (!s) return s;
  if (s === ":root" || s === "html" || s === "body" || s === "html, body")
    return ".article-doc";
  // html, body split combos
  return s
    .split(",")
    .map((part) => {
      const p = part.trim();
      if (p === "html" || p === "body" || p === ":root") return ".article-doc";
      return `.article-doc ${p}`;
    })
    .join(", ");
}

function scopeCss(css) {
  let out = "";
  let i = 0;
  while (i < css.length) {
    const open = css.indexOf("{", i);
    if (open === -1) break;
    const sel = css.slice(i, open).trim();
    if (sel.startsWith("@media")) {
      // find matching closing brace for the media block
      let depth = 1;
      let j = open + 1;
      while (j < css.length && depth > 0) {
        if (css[j] === "{") depth++;
        else if (css[j] === "}") depth--;
        j++;
      }
      const inner = css.slice(open + 1, j - 1);
      out += `${sel} {\n${scopeCss(inner)}\n}\n`;
      i = j;
    } else {
      const close = css.indexOf("}", open);
      const body = css.slice(open + 1, close);
      out += `${scopeSelector(sel)} { ${body.trim()} }\n`;
      i = close + 1;
    }
  }
  return out;
}

function convert(slug) {
  const srcPath = path.join(SRC, `${slug}.html`);
  const html = fs.readFileSync(srcPath, "utf-8");

  const styleM = html.match(/<style>([\s\S]*?)<\/style>/);
  const articleM = html.match(/<article[\s\S]*?<\/article>/);
  if (!styleM || !articleM) {
    console.warn(`✗ ${slug}: estrutura inesperada (sem <style> ou <article>) — pulado`);
    return false;
  }

  let scoped = scopeCss(styleM[1]);
  // Map literal font families to the site's next/font CSS variables
  scoped = scoped
    .replaceAll('"Playfair Display", Georgia, serif', "var(--font-playfair-display), Georgia, serif")
    .replaceAll('"Inter", -apple-system', "var(--font-inter), -apple-system");
  const fragment = `<style>\n${scoped}</style>\n${articleM[0]}\n`;

  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, `${slug}.html`), fragment);
  console.log(`✓ ${slug} (${(fragment.length / 1024).toFixed(0)} KB)`);
  return true;
}

const args = process.argv.slice(2);
const slugs = args.length
  ? args
  : fs
      .readdirSync(SRC)
      .filter((f) => f.endsWith(".html"))
      .map((f) => f.replace(/\.html$/, ""));

let ok = 0;
for (const slug of slugs) ok += convert(slug) ? 1 : 0;
console.log(`\n${ok}/${slugs.length} convertidos para ${OUT}/`);
