/**
 * Newsletter double opt-in — step 2.
 * GET ?email&token → verifies the HMAC token and only then adds the
 * contact to the Resend audience. Redirects to /newsletter with status.
 */
import { NextResponse } from "next/server";
import crypto from "crypto";
import { Resend } from "resend";

const SITE = "https://pedroripper.com";

export async function GET(request: Request) {
  const { RESEND_API_KEY, NEWSLETTER_SECRET, RESEND_AUDIENCE_ID } = process.env;
  const url = new URL(request.url);
  const email = url.searchParams.get("email") || "";
  const token = url.searchParams.get("token") || "";

  if (!RESEND_API_KEY || !NEWSLETTER_SECRET || !RESEND_AUDIENCE_ID) {
    return NextResponse.redirect(`${SITE}/newsletter?status=erro`);
  }

  const expected = crypto
    .createHmac("sha256", NEWSLETTER_SECRET)
    .update(email.toLowerCase())
    .digest("hex");
  const valid =
    token.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));

  if (!email || !valid) {
    return NextResponse.redirect(`${SITE}/newsletter?status=invalido`);
  }

  const resend = new Resend(RESEND_API_KEY);
  const { error } = await resend.contacts.create({
    audienceId: RESEND_AUDIENCE_ID,
    email,
    unsubscribed: false,
  });

  // "already exists" also counts as success for the subscriber
  if (error && !/exist/i.test(error.message || "")) {
    return NextResponse.redirect(`${SITE}/newsletter?status=erro`);
  }
  return NextResponse.redirect(`${SITE}/newsletter?status=confirmado`);
}
