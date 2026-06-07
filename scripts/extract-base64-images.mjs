/**
 * Extracts inline base64 images from a standalone article HTML
 * (public/articles/<slug>.html), writes each to a real file under
 * public/articles/images/<slug>/img-N.<ext>, and rewrites the src to the
 * public URL. This shrinks the HTML (and the generated fragment) massively.
 *
 * Usage: node scripts/extract-base64-images.mjs <slug>
 */
import fs from "fs";
import path from "path";

const MIME_EXT = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/webp": "webp",
  "image/svg+xml": "svg",
};

const slug = process.argv[2];
if (!slug) {
  console.error("Usage: node scripts/extract-base64-images.mjs <slug>");
  process.exit(1);
}

const htmlPath = path.join("public/articles", `${slug}.html`);
const outDir = path.join("public/articles/images", slug);
let html = fs.readFileSync(htmlPath, "utf-8");

fs.mkdirSync(outDir, { recursive: true });

let n = 0;
// Match src="data:image/<mime>;base64,<payload>" (single or double quotes)
const re = /src=(["'])data:(image\/[a-z+]+);base64,([^"']+)\1/g;
html = html.replace(re, (_m, quote, mime, payload) => {
  n += 1;
  const ext = MIME_EXT[mime] || "bin";
  const file = `img-${n}.${ext}`;
  fs.writeFileSync(path.join(outDir, file), Buffer.from(payload, "base64"));
  const url = `/articles/images/${slug}/${file}`;
  console.log(`✓ ${file} (${(payload.length / 1024).toFixed(0)} KB base64 → ${url})`);
  return `src=${quote}${url}${quote}`;
});

if (n === 0) {
  console.log("Nenhuma imagem base64 encontrada.");
} else {
  fs.writeFileSync(htmlPath, html);
  console.log(`\n${n} imagem(ns) extraída(s). ${htmlPath} reescrito.`);
}
