/**
 * Tests for the admin login API route: POST /api/admin/login
 *
 * Mocks the auth functions (verifyPassword, createSession) since
 * the route handler delegates to them.
 */

// Mock the auth module
// Mock next/server — jsdom lacks global Response, so we build a plain object
jest.mock("next/server", () => {
  return {
    NextResponse: {
      json: (body: unknown, init?: { status?: number }) => {
        return {
          status: init?.status ?? 200,
          json: async () => body,
        };
      },
    },
  };
});

jest.mock("@/lib/auth", () => ({
  verifyPassword: jest.fn(),
  createSession: jest.fn(),
}));

import { POST } from "@/app/api/admin/login/route";
import { verifyPassword, createSession } from "@/lib/auth";

const mockedVerify = verifyPassword as jest.MockedFunction<typeof verifyPassword>;
const mockedCreateSession = createSession as jest.MockedFunction<typeof createSession>;

beforeEach(() => {
  jest.clearAllMocks();
  mockedCreateSession.mockResolvedValue(undefined);
});

/** Helper to build a minimal request-like object with a JSON body */
function buildRequest(body: Record<string, unknown>): Request {
  // jsdom does not provide the global Request constructor,
  // so we build a lightweight object that satisfies the route handler.
  return {
    json: async () => body,
  } as unknown as Request;
}

describe("POST /api/admin/login", () => {
  it("returns 200 and creates session with correct password", async () => {
    mockedVerify.mockReturnValue(true);

    const res = await POST(buildRequest({ password: "s3cret" }));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(mockedCreateSession).toHaveBeenCalledTimes(1);
  });

  it("returns 401 with wrong password", async () => {
    mockedVerify.mockReturnValue(false);

    const res = await POST(buildRequest({ password: "wrong" }));
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.error).toBe("Invalid password");
    expect(mockedCreateSession).not.toHaveBeenCalled();
  });

  it("returns 401 when password field is empty string", async () => {
    mockedVerify.mockReturnValue(false);

    const res = await POST(buildRequest({ password: "" }));
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.error).toBe("Invalid password");
  });

  it("returns 401 when password field is missing", async () => {
    const res = await POST(buildRequest({}));
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.error).toBe("Invalid password");
    expect(mockedCreateSession).not.toHaveBeenCalled();
  });
});
