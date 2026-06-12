import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Proxy — protects /admin and /api/admin routes (except the login endpoints).
 *
 * Validates the full HMAC signature of the admin_session cookie here at the
 * edge, so a forged/garbage cookie can't reach the admin pages (which would
 * otherwise expose hidden drafts in read-only views). The cookie format and
 * key match src/lib/auth.ts; we use Web Crypto because the proxy runs on the
 * Edge runtime (no node:crypto). The /api/admin/* routes also re-check
 * server-side via isAuthenticated().
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get("admin_session")?.value;
  if (token && (await isValidSession(token))) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/admin/login", request.url));
}

async function isValidSession(token: string): Promise<boolean> {
  const [nonce, signature] = token.split(".");
  const secret = process.env.ADMIN_PASSWORD;
  if (!nonce || !signature || !secret) return false;

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign("HMAC", key, enc.encode(nonce));
  const expected = Array.from(new Uint8Array(mac))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  /* Constant-time comparison */
  if (expected.length !== signature.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return diff === 0;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
