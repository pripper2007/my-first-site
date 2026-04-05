/**
 * Tests for admin API routes: books CRUD and logout.
 *
 * Mocks auth (isAuthenticated) and content CRUD functions,
 * plus next/server NextResponse.
 */

// Mock next/server — jsdom lacks global Response
jest.mock("next/server", () => ({
  NextResponse: {
    json: (body: unknown, init?: { status?: number }) => ({
      status: init?.status ?? 200,
      json: async () => body,
    }),
  },
}));

// Mock auth
jest.mock("@/lib/auth", () => ({
  isAuthenticated: jest.fn(),
  destroySession: jest.fn(),
}));

// Mock content functions used by the books routes
jest.mock("@/lib/content", () => ({
  getBooks: jest.fn(),
  createBook: jest.fn(),
  getBookById: jest.fn(),
  updateBook: jest.fn(),
  deleteBook: jest.fn(),
}));

import { isAuthenticated, destroySession } from "@/lib/auth";
import {
  getBooks,
  createBook,
  getBookById,
  updateBook,
  deleteBook,
} from "@/lib/content";

// Import route handlers
import { GET as booksGET, POST as booksPOST } from "@/app/api/admin/books/route";
import {
  GET as bookGET,
  PUT as bookPUT,
  DELETE as bookDELETE,
} from "@/app/api/admin/books/[id]/route";
import { POST as logoutPOST } from "@/app/api/admin/logout/route";

const mockedIsAuth = isAuthenticated as jest.MockedFunction<typeof isAuthenticated>;
const mockedDestroySession = destroySession as jest.MockedFunction<typeof destroySession>;
const mockedGetBooks = getBooks as jest.MockedFunction<typeof getBooks>;
const mockedCreateBook = createBook as jest.MockedFunction<typeof createBook>;
const mockedGetBookById = getBookById as jest.MockedFunction<typeof getBookById>;
const mockedUpdateBook = updateBook as jest.MockedFunction<typeof updateBook>;
const mockedDeleteBook = deleteBook as jest.MockedFunction<typeof deleteBook>;

beforeEach(() => {
  jest.clearAllMocks();
  mockedDestroySession.mockResolvedValue(undefined);
});

/** Helper to build a minimal Request with a JSON body */
function buildRequest(body: Record<string, unknown>): Request {
  return { json: async () => body } as unknown as Request;
}

/** Helper to build params as a Promise (Next.js 15+ pattern) */
function buildParams(id: string): { params: Promise<{ id: string }> } {
  return { params: Promise.resolve({ id }) };
}

/* ══════════════ BOOKS COLLECTION: GET, POST ══════════════ */

describe("GET /api/admin/books", () => {
  it("returns books when authenticated", async () => {
    mockedIsAuth.mockResolvedValue(true);
    mockedGetBooks.mockResolvedValue([
      {
        id: "b1",
        title: "Test Book",
        author: "Author",
        tag: "Tech",
        featured: true,
        order: 0,
        createdAt: "2025-01-01T00:00:00.000Z",
        updatedAt: "2025-01-01T00:00:00.000Z",
      },
    ]);

    const res = await booksGET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toHaveLength(1);
    expect(data[0].title).toBe("Test Book");
  });

  it("returns 401 when not authenticated", async () => {
    mockedIsAuth.mockResolvedValue(false);

    const res = await booksGET();
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
  });
});

describe("POST /api/admin/books", () => {
  it("creates a book when authenticated", async () => {
    mockedIsAuth.mockResolvedValue(true);
    const newBook = {
      id: "b-new",
      title: "New Book",
      author: "New Author",
      tag: "AI",
      featured: false,
      order: 1,
      createdAt: "2025-06-01T00:00:00.000Z",
      updatedAt: "2025-06-01T00:00:00.000Z",
    };
    mockedCreateBook.mockResolvedValue(newBook);

    const res = await booksPOST(
      buildRequest({ title: "New Book", author: "New Author", tag: "AI", featured: false, order: 1 })
    );
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.title).toBe("New Book");
    expect(mockedCreateBook).toHaveBeenCalledTimes(1);
  });

  it("returns 401 when not authenticated", async () => {
    mockedIsAuth.mockResolvedValue(false);

    const res = await booksPOST(buildRequest({ title: "X" }));
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
    expect(mockedCreateBook).not.toHaveBeenCalled();
  });
});

/* ══════════════ BOOKS ITEM: GET, PUT, DELETE ══════════════ */

describe("GET /api/admin/books/[id]", () => {
  it("returns a book by id when authenticated", async () => {
    mockedIsAuth.mockResolvedValue(true);
    mockedGetBookById.mockResolvedValue({
      id: "b1",
      title: "Found Book",
      author: "Author",
      tag: "Tech",
      featured: true,
      order: 0,
      createdAt: "2025-01-01T00:00:00.000Z",
      updatedAt: "2025-01-01T00:00:00.000Z",
    });

    const res = await bookGET(buildRequest({}), buildParams("b1"));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.title).toBe("Found Book");
  });

  it("returns 404 for unknown id", async () => {
    mockedIsAuth.mockResolvedValue(true);
    mockedGetBookById.mockResolvedValue(null);

    const res = await bookGET(buildRequest({}), buildParams("unknown"));
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.error).toBe("Not found");
  });

  it("returns 401 when not authenticated", async () => {
    mockedIsAuth.mockResolvedValue(false);

    const res = await bookGET(buildRequest({}), buildParams("b1"));
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
  });
});

describe("PUT /api/admin/books/[id]", () => {
  it("updates a book when authenticated", async () => {
    mockedIsAuth.mockResolvedValue(true);
    mockedUpdateBook.mockResolvedValue({
      id: "b1",
      title: "Updated Title",
      author: "Author",
      tag: "Tech",
      featured: true,
      order: 0,
      createdAt: "2025-01-01T00:00:00.000Z",
      updatedAt: "2025-06-01T00:00:00.000Z",
    });

    const res = await bookPUT(
      buildRequest({ title: "Updated Title" }),
      buildParams("b1")
    );
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.title).toBe("Updated Title");
    expect(mockedUpdateBook).toHaveBeenCalledWith("b1", { title: "Updated Title" });
  });

  it("returns 404 for unknown id", async () => {
    mockedIsAuth.mockResolvedValue(true);
    mockedUpdateBook.mockResolvedValue(null);

    const res = await bookPUT(
      buildRequest({ title: "X" }),
      buildParams("unknown")
    );
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.error).toBe("Not found");
  });

  it("returns 401 when not authenticated", async () => {
    mockedIsAuth.mockResolvedValue(false);

    const res = await bookPUT(
      buildRequest({ title: "X" }),
      buildParams("b1")
    );
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
    expect(mockedUpdateBook).not.toHaveBeenCalled();
  });
});

describe("DELETE /api/admin/books/[id]", () => {
  it("deletes a book when authenticated", async () => {
    mockedIsAuth.mockResolvedValue(true);
    mockedDeleteBook.mockResolvedValue(true);

    const res = await bookDELETE(buildRequest({}), buildParams("b1"));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(mockedDeleteBook).toHaveBeenCalledWith("b1");
  });

  it("returns 404 for unknown id", async () => {
    mockedIsAuth.mockResolvedValue(true);
    mockedDeleteBook.mockResolvedValue(false);

    const res = await bookDELETE(buildRequest({}), buildParams("unknown"));
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.error).toBe("Not found");
  });

  it("returns 401 when not authenticated", async () => {
    mockedIsAuth.mockResolvedValue(false);

    const res = await bookDELETE(buildRequest({}), buildParams("b1"));
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
    expect(mockedDeleteBook).not.toHaveBeenCalled();
  });
});

/* ══════════════ LOGOUT ══════════════ */

describe("POST /api/admin/logout", () => {
  it("destroys session and returns success", async () => {
    const res = await logoutPOST();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(mockedDestroySession).toHaveBeenCalledTimes(1);
  });
});
