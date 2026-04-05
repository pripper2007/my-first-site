/**
 * Tests for src/lib/content.ts
 *
 * All filesystem access (fs.readFile / fs.writeFile) is mocked so
 * no real JSON files are read or written during tests.
 */
import { promises as fs } from "fs";
import type { NewsItem, VideoItem, BookItem, Pick, Bio, Settings } from "@/lib/types";

// Mock the fs module before importing content functions
jest.mock("fs", () => ({
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn(),
  },
}));

// Mock uuid so createX functions produce a predictable ID
jest.mock("uuid", () => ({
  v4: () => "test-uuid-1234",
}));

// Import after mocks are in place
import {
  getNews,
  getAllNews,
  getFeaturedNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
  getVideos,
  getAllVideos,
  getFeaturedVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
  getBooks,
  getAllBooks,
  getFeaturedBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getPicks,
  getAllPicks,
  getFeaturedPicks,
  getPickById,
  createPick,
  updatePick,
  deletePick,
  getBio,
  updateBio,
  getSettings,
  updateSettings,
} from "@/lib/content";

/* ────────────── Fixtures ────────────── */

const now = "2025-01-01T00:00:00.000Z";

const mockNews: NewsItem[] = [
  {
    id: "n1",
    title: "News B",
    source: "TechCrunch",
    date: "2025-01-10",
    excerpt: "Excerpt B",
    url: "https://example.com/b",
    imageGradient: "linear-gradient(135deg, #f00, #0f0)",
    featured: false,
    order: 2,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "n2",
    title: "News A",
    source: "Bloomberg",
    date: "2025-01-05",
    excerpt: "Excerpt A",
    url: "https://example.com/a",
    imageGradient: "linear-gradient(135deg, #00f, #ff0)",
    featured: true,
    order: 1,
    createdAt: now,
    updatedAt: now,
  },
];

const mockVideos: VideoItem[] = [
  {
    id: "v1",
    title: "Video B",
    description: "Desc B",
    type: "keynote",
    event: "Event B",
    date: "2025-02-01",
    duration: "45:00",
    youtubeUrl: "https://www.youtube.com/watch?v=abc123def45",
    featured: false,
    order: 2,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "v2",
    title: "Video A",
    description: "Desc A",
    type: "interview",
    event: "Event A",
    date: "2025-01-15",
    duration: "32:14",
    youtubeUrl: "https://www.youtube.com/watch?v=xyz789abc12",
    featured: true,
    order: 1,
    createdAt: now,
    updatedAt: now,
  },
];

const mockBooks: BookItem[] = [
  {
    id: "b1",
    title: "Book B",
    author: "Author B",
    tag: "Leadership",
    featured: false,
    order: 2,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "b2",
    title: "Book A",
    author: "Author A",
    tag: "Innovation",
    featured: true,
    order: 1,
    createdAt: now,
    updatedAt: now,
  },
];

const mockPicks: Pick[] = [
  {
    id: "p1",
    title: "Pick B",
    source: "Medium",
    mediaType: "article",
    tags: ["tech"],
    date: "2025-03-01",
    excerpt: "Excerpt B",
    url: "https://example.com/pick-b",
    thumbnailGradient: "linear-gradient(135deg, #aaa, #bbb)",
    featured: false,
    order: 2,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "p2",
    title: "Pick A",
    source: "YouTube",
    mediaType: "video",
    tags: ["AI"],
    date: "2025-02-20",
    duration: "15:30",
    excerpt: "Excerpt A",
    url: "https://example.com/pick-a",
    thumbnailGradient: "linear-gradient(135deg, #ccc, #ddd)",
    featured: true,
    order: 1,
    createdAt: now,
    updatedAt: now,
  },
];

const mockBio: Bio = {
  paragraphs: ["Paragraph 1"],
  highlights: [{ icon: "chart", title: "H1", description: "D1" }],
  stats: [{ value: "50+", label: "Countries" }],
};

const mockSettings: Settings = {
  name: "Pedro Ripper",
  role: "Co-founder & CEO",
  tagline: "Building the future",
  social: { linkedin: "https://linkedin.com/in/pedroripper", x: "https://x.com/ripper_pedro" },
  meta: { title: "Pedro Ripper", description: "Personal site" },
};

/* ────────────── Helpers ────────────── */

const mockedReadFile = fs.readFile as jest.MockedFunction<typeof fs.readFile>;
const mockedWriteFile = fs.writeFile as jest.MockedFunction<typeof fs.writeFile>;

/** Configure readFile to return JSON for a specific filename pattern */
function mockReadFor(filenameSubstring: string, data: unknown) {
  mockedReadFile.mockImplementation(async (filepath: any) => {
    if (String(filepath).includes(filenameSubstring)) {
      return JSON.stringify(data);
    }
    throw new Error("File not found");
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  mockedWriteFile.mockResolvedValue(undefined);
  // Freeze Date.now so updatedAt is predictable
  jest.useFakeTimers({ now: new Date("2025-06-01T00:00:00.000Z").getTime() });
});

afterEach(() => {
  jest.useRealTimers();
});

/* ══════════════ NEWS ══════════════ */

describe("News CRUD", () => {
  beforeEach(() => mockReadFor("news.json", mockNews));

  it("getNews returns items sorted by order", async () => {
    const news = await getNews();
    expect(news[0].id).toBe("n2"); // order 1
    expect(news[1].id).toBe("n1"); // order 2
  });

  it("getNews returns [] when file is missing", async () => {
    mockedReadFile.mockRejectedValue(new Error("ENOENT"));
    expect(await getNews()).toEqual([]);
  });

  it("getFeaturedNews returns only featured items", async () => {
    const featured = await getFeaturedNews();
    expect(featured).toHaveLength(1);
    expect(featured[0].id).toBe("n2");
  });

  it("getFeaturedNews respects limit", async () => {
    const featured = await getFeaturedNews(0);
    expect(featured).toHaveLength(0);
  });

  it("getNewsById returns matching item", async () => {
    expect(await getNewsById("n1")).toMatchObject({ id: "n1" });
  });

  it("getNewsById returns null for unknown id", async () => {
    expect(await getNewsById("nonexistent")).toBeNull();
  });

  it("createNews adds item with generated id and timestamps", async () => {
    const input = {
      title: "New",
      source: "Src",
      date: "2025-04-01",
      excerpt: "Ex",
      url: "https://example.com/new",
      imageGradient: "linear-gradient(#000,#fff)",
      featured: false,
      order: 3,
    };
    const created = await createNews(input);
    expect(created.id).toBe("test-uuid-1234");
    expect(created.createdAt).toBeDefined();
    expect(mockedWriteFile).toHaveBeenCalledTimes(1);
  });

  it("updateNews updates fields and sets updatedAt", async () => {
    const updated = await updateNews("n1", { title: "Updated" });
    expect(updated).not.toBeNull();
    expect(updated!.title).toBe("Updated");
    expect(mockedWriteFile).toHaveBeenCalledTimes(1);
  });

  it("updateNews returns null for unknown id", async () => {
    expect(await updateNews("nonexistent", { title: "X" })).toBeNull();
  });

  it("deleteNews removes item and returns true", async () => {
    expect(await deleteNews("n1")).toBe(true);
    expect(mockedWriteFile).toHaveBeenCalledTimes(1);
  });

  it("deleteNews returns false for unknown id", async () => {
    expect(await deleteNews("nonexistent")).toBe(false);
  });

  it("getNews filters out items with visible: false", async () => {
    const newsWithHidden: NewsItem[] = [
      { ...mockNews[0], visible: false },
      { ...mockNews[1] },
    ];
    mockReadFor("news.json", newsWithHidden);
    const news = await getNews();
    expect(news).toHaveLength(1);
    expect(news[0].id).toBe("n2");
  });

  it("getAllNews returns items even with visible: false", async () => {
    const newsWithHidden: NewsItem[] = [
      { ...mockNews[0], visible: false },
      { ...mockNews[1] },
    ];
    mockReadFor("news.json", newsWithHidden);
    const news = await getAllNews();
    expect(news).toHaveLength(2);
  });
});

/* ══════════════ VIDEOS ══════════════ */

describe("Videos CRUD", () => {
  beforeEach(() => mockReadFor("videos.json", mockVideos));

  it("getVideos returns items sorted by order", async () => {
    const videos = await getVideos();
    expect(videos[0].id).toBe("v2");
  });

  it("getVideos returns [] when file is missing", async () => {
    mockedReadFile.mockRejectedValue(new Error("ENOENT"));
    expect(await getVideos()).toEqual([]);
  });

  it("getFeaturedVideos returns only featured items", async () => {
    const featured = await getFeaturedVideos();
    expect(featured).toHaveLength(1);
    expect(featured[0].id).toBe("v2");
  });

  it("getVideoById returns matching item", async () => {
    expect(await getVideoById("v1")).toMatchObject({ id: "v1" });
  });

  it("getVideoById returns null for unknown id", async () => {
    expect(await getVideoById("nonexistent")).toBeNull();
  });

  it("createVideo adds item with generated id", async () => {
    const input = {
      title: "New Video",
      description: "Desc",
      type: "panel" as const,
      event: "Conf",
      date: "2025-05-01",
      duration: "20:00",
      youtubeUrl: "https://www.youtube.com/watch?v=aaa111bbb22",
      featured: false,
      order: 3,
    };
    const created = await createVideo(input);
    expect(created.id).toBe("test-uuid-1234");
    expect(mockedWriteFile).toHaveBeenCalledTimes(1);
  });

  it("updateVideo updates fields", async () => {
    const updated = await updateVideo("v1", { title: "Updated" });
    expect(updated!.title).toBe("Updated");
  });

  it("updateVideo returns null for unknown id", async () => {
    expect(await updateVideo("nonexistent", { title: "X" })).toBeNull();
  });

  it("deleteVideo removes item", async () => {
    expect(await deleteVideo("v1")).toBe(true);
  });

  it("deleteVideo returns false for unknown id", async () => {
    expect(await deleteVideo("nonexistent")).toBe(false);
  });
});

/* ══════════════ BOOKS ══════════════ */

describe("Books CRUD", () => {
  beforeEach(() => mockReadFor("books.json", mockBooks));

  it("getBooks returns items sorted by order", async () => {
    const books = await getBooks();
    expect(books[0].id).toBe("b2");
  });

  it("getBooks returns [] when file is missing", async () => {
    mockedReadFile.mockRejectedValue(new Error("ENOENT"));
    expect(await getBooks()).toEqual([]);
  });

  it("getFeaturedBooks returns only featured items", async () => {
    const featured = await getFeaturedBooks();
    expect(featured).toHaveLength(1);
    expect(featured[0].id).toBe("b2");
  });

  it("getBookById returns matching item", async () => {
    expect(await getBookById("b1")).toMatchObject({ id: "b1" });
  });

  it("getBookById returns null for unknown id", async () => {
    expect(await getBookById("nonexistent")).toBeNull();
  });

  it("createBook adds item with generated id", async () => {
    const input = {
      title: "New Book",
      author: "Author",
      tag: "Psychology",
      featured: true,
      order: 3,
    };
    const created = await createBook(input);
    expect(created.id).toBe("test-uuid-1234");
    expect(mockedWriteFile).toHaveBeenCalledTimes(1);
  });

  it("updateBook updates fields", async () => {
    const updated = await updateBook("b1", { title: "Updated" });
    expect(updated!.title).toBe("Updated");
  });

  it("updateBook returns null for unknown id", async () => {
    expect(await updateBook("nonexistent", { title: "X" })).toBeNull();
  });

  it("deleteBook removes item", async () => {
    expect(await deleteBook("b1")).toBe(true);
  });

  it("deleteBook returns false for unknown id", async () => {
    expect(await deleteBook("nonexistent")).toBe(false);
  });

  it("getBooks filters out items with visible: false", async () => {
    const booksWithHidden: BookItem[] = [
      { ...mockBooks[0], visible: false },
      { ...mockBooks[1], visible: true },
    ];
    mockReadFor("books.json", booksWithHidden);
    const books = await getBooks();
    expect(books).toHaveLength(1);
    expect(books[0].id).toBe("b2");
  });

  it("getAllBooks returns items even with visible: false", async () => {
    const booksWithHidden: BookItem[] = [
      { ...mockBooks[0], visible: false },
      { ...mockBooks[1], visible: true },
    ];
    mockReadFor("books.json", booksWithHidden);
    const books = await getAllBooks();
    expect(books).toHaveLength(2);
  });

  it("getBooks includes items without a visible field (defaults to visible)", async () => {
    // mockBooks have no visible field — they should still appear
    const books = await getBooks();
    expect(books).toHaveLength(2);
  });
});

/* ══════════════ PICKS ══════════════ */

describe("Picks CRUD", () => {
  beforeEach(() => mockReadFor("picks.json", mockPicks));

  it("getPicks returns items sorted by order", async () => {
    const picks = await getPicks();
    expect(picks[0].id).toBe("p2");
  });

  it("getPicks returns [] when file is missing", async () => {
    mockedReadFile.mockRejectedValue(new Error("ENOENT"));
    expect(await getPicks()).toEqual([]);
  });

  it("getFeaturedPicks returns only featured items", async () => {
    const featured = await getFeaturedPicks();
    expect(featured).toHaveLength(1);
    expect(featured[0].id).toBe("p2");
  });

  it("getPickById returns matching item", async () => {
    expect(await getPickById("p1")).toMatchObject({ id: "p1" });
  });

  it("getPickById returns null for unknown id", async () => {
    expect(await getPickById("nonexistent")).toBeNull();
  });

  it("createPick adds item with generated id", async () => {
    const input = {
      title: "New Pick",
      source: "Source",
      mediaType: "podcast" as const,
      tags: ["music"],
      date: "2025-04-10",
      duration: "60:00",
      excerpt: "Great episode",
      url: "https://example.com/pick-new",
      thumbnailGradient: "linear-gradient(#111,#222)",
      featured: false,
      order: 3,
    };
    const created = await createPick(input);
    expect(created.id).toBe("test-uuid-1234");
    expect(mockedWriteFile).toHaveBeenCalledTimes(1);
  });

  it("updatePick updates fields", async () => {
    const updated = await updatePick("p1", { title: "Updated" });
    expect(updated!.title).toBe("Updated");
  });

  it("updatePick returns null for unknown id", async () => {
    expect(await updatePick("nonexistent", { title: "X" })).toBeNull();
  });

  it("deletePick removes item", async () => {
    expect(await deletePick("p1")).toBe(true);
  });

  it("deletePick returns false for unknown id", async () => {
    expect(await deletePick("nonexistent")).toBe(false);
  });
});

/* ══════════════ BIO ══════════════ */

describe("Bio", () => {
  it("getBio returns bio data from file", async () => {
    mockReadFor("bio.json", mockBio);
    const bio = await getBio();
    expect(bio.paragraphs).toHaveLength(1);
    expect(bio.highlights[0].icon).toBe("chart");
  });

  it("getBio returns empty defaults when file is missing", async () => {
    mockedReadFile.mockRejectedValue(new Error("ENOENT"));
    const bio = await getBio();
    expect(bio).toEqual({ paragraphs: [], highlights: [], stats: [] });
  });

  it("updateBio writes and returns bio", async () => {
    const result = await updateBio(mockBio);
    expect(result).toEqual(mockBio);
    expect(mockedWriteFile).toHaveBeenCalledTimes(1);
  });
});

/* ══════════════ SETTINGS ══════════════ */

describe("Settings", () => {
  it("getSettings returns settings from file", async () => {
    mockReadFor("settings.json", mockSettings);
    const settings = await getSettings();
    expect(settings.name).toBe("Pedro Ripper");
  });

  it("getSettings returns defaults when file is missing", async () => {
    mockedReadFile.mockRejectedValue(new Error("ENOENT"));
    const settings = await getSettings();
    expect(settings.name).toBe("Pedro Ripper");
    expect(settings.role).toBe("Co-founder & CEO");
  });

  it("updateSettings writes and returns settings", async () => {
    const result = await updateSettings(mockSettings);
    expect(result).toEqual(mockSettings);
    expect(mockedWriteFile).toHaveBeenCalledTimes(1);
  });
});
