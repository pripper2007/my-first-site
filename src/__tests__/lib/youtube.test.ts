/**
 * Tests for src/lib/youtube.ts
 *
 * Covers extractYouTubeId (various URL formats + invalid input)
 * and getYouTubeThumbnail (correct URL generation).
 */
import { extractYouTubeId, getYouTubeThumbnail } from "@/lib/youtube";

describe("extractYouTubeId", () => {
  it("extracts ID from standard watch URL", () => {
    expect(extractYouTubeId("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(
      "dQw4w9WgXcQ"
    );
  });

  it("extracts ID from watch URL with extra params", () => {
    expect(
      extractYouTubeId("https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=120")
    ).toBe("dQw4w9WgXcQ");
  });

  it("extracts ID from short youtu.be URL", () => {
    expect(extractYouTubeId("https://youtu.be/dQw4w9WgXcQ")).toBe(
      "dQw4w9WgXcQ"
    );
  });

  it("extracts ID from embed URL", () => {
    expect(
      extractYouTubeId("https://www.youtube.com/embed/dQw4w9WgXcQ")
    ).toBe("dQw4w9WgXcQ");
  });

  it("returns null for an invalid URL", () => {
    expect(extractYouTubeId("https://example.com/video")).toBeNull();
  });

  it("returns null for an empty string", () => {
    expect(extractYouTubeId("")).toBeNull();
  });

  it("returns null for a URL with too-short video ID", () => {
    expect(extractYouTubeId("https://www.youtube.com/watch?v=short")).toBeNull();
  });
});

describe("getYouTubeThumbnail", () => {
  it("returns the hqdefault thumbnail URL for a given video ID", () => {
    expect(getYouTubeThumbnail("dQw4w9WgXcQ")).toBe(
      "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg"
    );
  });
});
