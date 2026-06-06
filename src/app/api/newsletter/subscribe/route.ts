/**
 * Newsletter double opt-in — step 1.
 * POST { email } → sends a confirmation email (Resend) with an
 * HMAC-signed link. No contact is stored until the link is clicked
 * (stateless double opt-in; no database needed).
 */
import { NextResponse } from "next/server";
import crypto from "crypto";
import { Resend } from "resend";

const FROM = "Pedro Ripper <diario@pedroripper.com>";
const SITE = "https://pedroripper.com";

function signEmail(email: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(email.toLowerCase()).digest("hex");
}

export async function POST(request: Request) {
  const { RESEND_API_KEY, NEWSLETTER_SECRET } = process.env;
  if (!RESEND_API_KEY || !NEWSLETTER_SECRET) {
    return NextResponse.json(
      { error: "Newsletter ainda não está configurada." },
      { status: 503 }
    );
  }

  const { email } = await request.json().catch(() => ({ email: null }));
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ error: "E-mail inválido." }, { status: 400 });
  }

  const token = signEmail(email, NEWSLETTER_SECRET);
  const confirmUrl = `${SITE}/api/newsletter/confirm?email=${encodeURIComponent(
    email
  )}&token=${token}`;

  const resend = new Resend(RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Confirme sua inscrição no Diário de Bordo",
    html: `
      <div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#1a1a1a;">
        <p style="font-size:22px;font-weight:700;margin:0 0 4px;">Pedro Ripper<span style="color:#c8a251;">.</span></p>
        <h1 style="font-size:20px;margin:24px 0 12px;">Confirme sua inscrição no Diário de Bordo</h1>
        <p style="font-size:15px;line-height:1.6;color:#444;">
          Você pediu para receber os próximos kits e artigos de pedroripper.com —
          no máximo 1 e-mail por mês. Para confirmar, clique no botão abaixo:
        </p>
        <p style="margin:28px 0;">
          <a href="${confirmUrl}" style="background:#c8a251;color:#fff;text-decoration:none;font-weight:600;padding:12px 22px;border-radius:10px;display:inline-block;">Confirmar inscrição</a>
        </p>
        <p style="font-size:13px;color:#888;line-height:1.6;">
          Se você não pediu isso, é só ignorar este e-mail — nada será enviado.
        </p>
      </div>`,
  });

  if (error) {
    return NextResponse.json(
      { error: "Falha ao enviar a confirmação. Tenta de novo?" },
      { status: 502 }
    );
  }
  return NextResponse.json({ ok: true });
}
