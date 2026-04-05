import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Proxy — protects /admin routes (except /admin/login).
 * Checks for the session cookie; redirects to login if missing.
 * Cannot import server-only code here, so we do a lightweight
 * cookie-existence check. Full HMAC validation happens server-side.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /* Let login page and API login endpoint through */
  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    return NextResponse.next();
  }

  /* Check for session cookie */
  const session = request.cookies.get("admin_session");
  if (!session?.value) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
