/**
 * Diário de Bordo — monthly draft generator.
 * Builds the newsletter draft automatically from the site's own content
 * (production Blob store): new insights, new picks/books notes and new
 * talks since a given date. The human adds/edits the opening note and
 * sends via Resend Broadcasts.
 *
 * Usage: node scripts/newsletter-draft.mjs 2026-06-01   (default: 1st of current month)
 * Output: prints Markdown draft to stdout (pipe to a file if wanted).
 */
import fs from "fs";

// load env (.env.local) for the blob token
for (const line of fs.readFileSync(".env.local", "utf-8").split("\n")) {
  const m = line.match(/^([A-Z_]+)="?([^"\n]+)"?$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

const { list } = await import("@vercel/blob");
const SITE = "https://pedroripper.com";

const sinceArg = process.argv[2];
const now = new Date();
const since = sinceArg
  ? new Date(sinceArg)
  : new Date(now.getFullYear(), now.getMonth(), 1);

async function fromBlob(name) {
  const { blobs } = await list({ prefix: `content/${name}`, limit: 1 });
  if (!blobs.length) return [];
  return (await fetch(blobs[0].url, { cache: "no-store" })).json();
}

const isNew = (d) => d && new Date(d) >= since;

const [insights, picks, books, videos] = await Promise.all([
  fromBlob("insights.json"),
  fromBlob("picks.json"),
  fromBlob("books.json"),
  fromBlob("videos.json"),
]);

const newInsights = insights.filter((i) => i.visible !== false && isNew(i.date));
const newPicks = picks.filter((p) => p.visible !== false && isNew(p.createdAt));
const newBooks = books.filter((b) => b.visible !== false && isNew(b.createdAt));
const newTalks = videos.filter((v) => v.visible !== false && isNew(v.createdAt));

const monthName = now.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
const lines = [];

lines.push(`# Diário de Bordo — ${monthName}`);
lines.push("");
lines.push(`> ✍️ NOTA DE ABERTURA (3-4 frases do Pedro — editar antes de enviar):`);
lines.push(`> [rascunho da nota vem aqui — gerado pelo agente com base no mês]`);
lines.push("");

if (newInsights.length) {
  const [destaque, ...resto] = newInsights;
  lines.push(`## 🌟 Destaque do mês`);
  lines.push("");
  lines.push(`**${destaque.title}**`);
  lines.push(`${destaque.excerpt}`);
  lines.push(`→ ${SITE}/insights/${destaque.slug}`);
  lines.push("");
  if (resto.length) {
    lines.push(`## 📝 Também publiquei`);
    lines.push("");
    for (const i of resto) {
      lines.push(`- **${i.title}** — ${i.excerpt} → ${SITE}/insights/${i.slug}`);
    }
    lines.push("");
  }
}

if (newPicks.length) {
  lines.push(`## 🎯 Picks do mês`);
  lines.push("");
  for (const p of newPicks.slice(0, 3)) {
    lines.push(`- **${p.title}** (${p.source})${p.note ? ` — ${p.note}` : ""} → ${p.url}`);
  }
  lines.push("");
}

if (newBooks.length) {
  lines.push(`## 📚 Na estante`);
  lines.push("");
  for (const b of newBooks.slice(0, 2)) {
    lines.push(`- **${b.title}** — ${b.author}${b.notes ? ` — ${b.notes}` : ""}`);
  }
  lines.push("");
}

if (newTalks.length) {
  lines.push(`## 🎙️ Apareci por aí`);
  lines.push("");
  for (const v of newTalks) {
    lines.push(`- **${v.title}** (${v.event || v.channelName}) → ${v.youtubeUrl}`);
  }
  lines.push("");
}

lines.push(`---`);
lines.push(`Todos os kits: ${SITE}/#projects · Arquivo: ${SITE}/insights`);
lines.push(`Você recebe isto porque se inscreveu em ${SITE}/newsletter. Descadastre-se em 1 clique no rodapé do Resend.`);

console.log(lines.join("\n"));
console.error(
  `\n[draft] desde ${since.toISOString().slice(0, 10)}: ${newInsights.length} artigos, ${newPicks.length} picks, ${newBooks.length} livros, ${newTalks.length} talks`
);
