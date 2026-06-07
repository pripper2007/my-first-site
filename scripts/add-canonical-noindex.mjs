/**
 * Marks the legacy standalone article HTML files as noindex and points their
 * canonical at the live /insights/<slug> route. These files are directly
 * reachable under /articles/<slug>.html and duplicate the canonical route;
 * this prevents search engines from indexing the duplicates.
 *
 * Idempotent: skips files that already carry the canonical tag.
 *
 * Usage: node scripts/add-canonical-noindex.mjs
 */
import fs from "fs";
import path from "path";

const DIR = "public/articles";
const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".html"));

let changed = 0;
for (const file of files) {
  const slug = file.replace(/\.html$/, "");
  const p = path.join(DIR, file);
  let html = fs.readFileSync(p, "utf-8");

  if (html.includes('rel="canonical"')) {
    console.log(`= ${file} (já tem canonical — pulado)`);
    continue;
  }

  const tags =
    `\n<link rel="canonical" href="https://pedroripper.com/insights/${slug}" />` +
    `\n<meta name="robots" content="noindex, follow" />`;

  if (!html.includes("<head>")) {
    console.warn(`✗ ${file}: sem <head> — pulado`);
    continue;
  }
  html = html.replace("<head>", `<head>${tags}`);
  fs.writeFileSync(p, html);
  changed += 1;
  console.log(`✓ ${file} → canonical /insights/${slug} + noindex`);
}
console.log(`\n${changed}/${files.length} arquivo(s) atualizado(s).`);
