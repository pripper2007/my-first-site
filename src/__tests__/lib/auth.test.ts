/**
 * Tests for src/lib/auth.ts
 *
 * Mocks process.env.ADMIN_PASSWORD and next/headers cookies().
 */

// Mock cookie store — tracks set/get/delete calls
const mockCookieStore = {
  set: jest.fn(),
  get: jest.fn(),
  delete: jest.fn(),
};

// Mock next/headers — cookies() returns our mock store
jest.mock("next/headers", () => ({
  cookies: jest.fn(async () => mockCookieStore),
}));

import { verifyPassword, createSession, isAuthenticated, destroySession } from "@/lib/auth";

beforeEach(() => {
  jest.clearAllMocks();
  process.env.ADMIN_PASSWORD = "s3cret";
});

afterEach(() => {
  delete process.env.ADMIN_PASSWORD;
});

describe("verifyPassword", () => {
  it("returns true when password matches ADMIN_PASSWORD", () => {
    expect(verifyPassword("s3cret")).toBe(true);
  });

  it("returns false when password does not match", () => {
    expect(verifyPassword("wrong")).toBe(false);
  });

  it("returns false for empty string", () => {
    expect(verifyPassword("")).toBe(false);
  });
});

describe("createSession", () => {
  it("sets an httpOnly cookie with a signed token", async () => {
    await createSession();

    expect(mockCookieStore.set).toHaveBeenCalledTimes(1);

    const [name, value, options] = mockCookieStore.set.mock.calls[0];
    expect(name).toBe("admin_session");
    // Token format: nonce.signature
    expect(value).toMatch(/^[a-f0-9]+\.[a-f0-9]+$/);
    expect(options.httpOnly).toBe(true);
    expect(options.path).toBe("/");
  });
});

describe("isAuthenticated", () => {
  it("returns true for a valid signed cookie", async () => {
    // First create a session so we know a valid token format
    await createSession();
    const validToken = mockCookieStore.set.mock.calls[0][1];

    // Now mock get to return that token
    mockCookieStore.get.mockReturnValue({ value: validToken });

    expect(await isAuthenticated()).toBe(true);
  });

  it("returns false when no cookie is present", async () => {
    mockCookieStore.get.mockReturnValue(undefined);
    expect(await isAuthenticated()).toBe(false);
  });

  it("returns false for a tampered cookie", async () => {
    mockCookieStore.get.mockReturnValue({ value: "tamperednonce.invalidsig" });
    expect(await isAuthenticated()).toBe(false);
  });

  it("returns false for a cookie with no dot separator", async () => {
    mockCookieStore.get.mockReturnValue({ value: "nodot" });
    expect(await isAuthenticated()).toBe(false);
  });
});

describe("destroySession", () => {
  it("deletes the admin_session cookie", async () => {
    await destroySession();
    expect(mockCookieStore.delete).toHaveBeenCalledWith("admin_session");
  });
});
