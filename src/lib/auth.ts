/**
 * Simple password-based auth for the admin panel.
 * Uses ADMIN_PASSWORD env var and an HMAC-signed session cookie.
 */
import { createHmac, randomBytes } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24; // 24 hours in seconds

function getSecret(): string {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) throw new Error("ADMIN_PASSWORD environment variable is not set");
  return pw;
}

/** Creates an HMAC token from a payload using the admin password as the key */
function signToken(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

/** Verifies the provided password matches the env var */
export function verifyPassword(password: string): boolean {
  return password === getSecret();
}

/** Creates a session cookie after successful login */
export async function createSession(): Promise<void> {
  const nonce = randomBytes(16).toString("hex");
  const token = `${nonce}.${signToken(nonce)}`;

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

/** Checks if the current request has a valid session cookie */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  if (!cookie?.value) return false;

  const [nonce, signature] = cookie.value.split(".");
  if (!nonce || !signature) return false;

  return signToken(nonce) === signature;
}

/** Destroys the session cookie */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
