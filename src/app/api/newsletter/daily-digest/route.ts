/**
 * GET /api/newsletter/daily-digest
 *
 * Daily ops digest for Pedro: lists the "Diário de Bordo" audience, compares it
 * against the last snapshot stored in Blob, and emails Pedro ONLY when something
 * changed since the last run (new sign-ups or unsubscribes/removals). No change
 * → no email. The snapshot is then updated so the next run starts fresh.
 *
 * Triggered daily by the Vercel cron in vercel.json (08h BRT). Vercel attaches
 * `Authorization: Bearer ${CRON_SECRET}`; the same bearer allows a manual run.
 */
import { timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { put, list } from "@vercel/blob";

const DIGEST_TO = "pripper2007@gmail.com";
const FROM = "Pedro Ripper <diario@pedroripper.com>";
const STATE_PATH = "content/newsletter-digest-state.json";

type Contact = { email: string; created_at?: string; unsubscribed?: boolean };

async function readState(): Promise<{ emails: string[] } | null> {
  try {
    const { blobs } = await list({ prefix: STATE_PATH, limit: 1 });
    if (!blobs.length) return null;
    const res = await fetch(blobs[0].url, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as { emails: string[] };
  } catch {
    return null;
  }
}

function fmtDate(iso?: string): string {
  if (!iso) return "—";
  // "2026-06-09 10:26:22.36+00" → "09/jun 10:26 UTC"
  const m = iso.match(/(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/);
  if (!m) return iso;
  const months = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  return `${m[3]}/${months[+m[2] - 1]} ${m[4]}:${m[5]} UTC`;
}

function buildEmail(opts: {
  firstRun: boolean;
  total: number;
  added: Contact[];
  removed: string[];
}): { subject: string; html: string } {
  const { firstRun, total, added, removed } = opts;
  const accent = "#c8a251";
  const list = (items: string[]) =>
    `<ul style="margin:6px 0 0;padding-left:18px;color:#1a1a1a;font-size:14px;line-height:1.7">${items
      .map((i) => `<li>${i}</li>`)
      .join("")}</ul>`;

  let subject: string;
  if (firstRun) {
    subject = `📬 Diário de Bordo · estado inicial: ${total} assinante${total === 1 ? "" : "s"}`;
  } else {
    const parts: string[] = [];
    if (added.length) parts.push(`+${added.length}`);
    if (removed.length) parts.push(`−${removed.length}`);
    subject = `📬 Diário de Bordo · ${parts.join(" / ")} (total ${total})`;
  }

  const blocks: string[] = [];
  blocks.push(
    `<p style="margin:0 0 16px;font-size:15px;color:#1a1a1a">Total de assinantes ativos: <b style="color:${accent}">${total}</b></p>`,
  );
  if (added.length) {
    blocks.push(
      `<p style="margin:0 0 4px;font-size:14px;font-weight:600;color:#1a1a1a">${
        firstRun ? "Assinantes atuais" : `Novos desde o último envio (${added.length})`
      }</p>`,
      list(added.map((c) => `${c.email} <span style="color:#6b6b6b">· ${fmtDate(c.created_at)}</span>`)),
    );
  }
  if (removed.length) {
    blocks.push(
      `<p style="margin:16px 0 4px;font-size:14px;font-weight:600;color:#1a1a1a">Saíram (${removed.length})</p>`,
      list(removed),
    );
  }

  const html = `<div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:520px;margin:0 auto;padding:8px 4px">
    <p style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:${accent};font-weight:600;margin:0 0 14px">Diário de Bordo · status</p>
    ${blocks.join("")}
    <p style="margin:24px 0 0;font-size:12px;color:#9a9a9a">Você recebe este e-mail só quando há mudança nos cadastros.</p>
  </div>`;
  return { subject, html };
}

export async function GET(req: NextRequest) {
  const { RESEND_API_KEY, RESEND_AUDIENCE_ID, CRON_SECRET } = process.env;

  if (CRON_SECRET) {
    const auth = Buffer.from(req.headers.get("authorization") ?? "");
    const expected = Buffer.from(`Bearer ${CRON_SECRET}`);
    if (auth.length !== expected.length || !timingSafeEqual(auth, expected)) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }
  if (!RESEND_API_KEY || !RESEND_AUDIENCE_ID) {
    return NextResponse.json({ error: "missing env" }, { status: 500 });
  }

  const resend = new Resend(RESEND_API_KEY);
  const { data, error } = await resend.contacts.list({ audienceId: RESEND_AUDIENCE_ID });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 502 });
  }

  const contacts: Contact[] = (data?.data ?? []).filter((c) => !c.unsubscribed);
  const current = contacts.map((c) => c.email);
  const currentSet = new Set(current);

  const prev = await readState();
  const firstRun = prev === null;
  const knownSet = new Set(prev?.emails ?? []);

  const added = firstRun
    ? [...contacts].sort((a, b) => String(a.created_at).localeCompare(String(b.created_at)))
    : contacts
        .filter((c) => !knownSet.has(c.email))
        .sort((a, b) => String(a.created_at).localeCompare(String(b.created_at)));
  const removed = firstRun ? [] : [...knownSet].filter((e) => !currentSet.has(e));

  if (!firstRun && added.length === 0 && removed.length === 0) {
    return NextResponse.json({ sent: false, reason: "no change", total: current.length });
  }

  const { subject, html } = buildEmail({ firstRun, total: current.length, added, removed });
  const sent = await resend.emails.send({ from: FROM, to: DIGEST_TO, subject, html });
  if (sent.error) {
    return NextResponse.json({ error: sent.error.message }, { status: 502 });
  }

  await put(STATE_PATH, JSON.stringify({ emails: current }), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });

  return NextResponse.json({ sent: true, firstRun, total: current.length, added: added.length, removed: removed.length });
}
