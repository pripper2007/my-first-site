/**
 * Render tests for public-facing components:
 * Hero, NewsCard, PickCard, BookModal, VideoModal
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import type { NewsItem, Pick, BookItem } from "@/lib/types";

// Mock next/link — render as a plain <a>
jest.mock("next/link", () => {
  return ({ children, ...props }: any) => <a {...props}>{children}</a>;
});

// Mock next/image — render as a plain <img>
jest.mock("next/image", () => {
  return (props: any) => <img {...props} />;
});

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
  usePathname: () => "/",
}));

// Mock ScrollReveal — just render children directly
jest.mock("@/components/shared/ScrollReveal", () => {
  return ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
});

import Hero from "@/components/public/Hero";
import NewsCard from "@/components/public/NewsCard";
import PickCard from "@/components/public/PickCard";
import BookModal from "@/components/public/BookModal";
import VideoModal from "@/components/public/VideoModal";

/* ────────────── Fixtures ────────────── */

const mockNewsItem: NewsItem = {
  id: "n1",
  title: "Bemobi Reports Record Revenue",
  source: "Bloomberg",
  date: "2025-01-15",
  excerpt: "Bemobi reported record revenue in Q4.",
  url: "https://example.com/article",
  imageGradient: "linear-gradient(135deg, #667eea, #764ba2)",
  featured: true,
  order: 1,
  createdAt: "2025-01-01T00:00:00.000Z",
  updatedAt: "2025-01-01T00:00:00.000Z",
};

const mockPick: Pick = {
  id: "pk1",
  title: "The Future of AI",
  source: "Lex Fridman Podcast",
  mediaType: "podcast",
  tags: ["AI", "tech"],
  date: "2025-02-10",
  duration: "1:30:00",
  excerpt: "An in-depth discussion on AI advancements.",
  url: "https://example.com/podcast",
  thumbnailGradient: "linear-gradient(135deg, #f093fb, #f5576c)",
  featured: true,
  order: 1,
  createdAt: "2025-01-01T00:00:00.000Z",
  updatedAt: "2025-01-01T00:00:00.000Z",
};

const mockBook: BookItem = {
  id: "bk1",
  title: "The Innovators",
  author: "Walter Isaacson",
  tag: "Innovation",
  description: "How a group of hackers, geniuses, and geeks created the digital revolution.",
  coverImage: "/images/innovators.jpg",
  amazonUrl: "https://amazon.com/innovators",
  notes: "One of my all-time favorites.",
  featured: true,
  order: 1,
  createdAt: "2025-01-01T00:00:00.000Z",
  updatedAt: "2025-01-01T00:00:00.000Z",
};

/* ────────────── Tests ────────────── */

describe("Hero", () => {
  it("renders without crashing", () => {
    render(<Hero />);
    expect(
      screen.getByText("Building Bemobi, exploring AI, sharing what I read.")
    ).toBeInTheDocument();
  });

  it("renders the role tagline", () => {
    render(<Hero />);
    expect(screen.getByText(/Tech Builder, Investor/)).toBeInTheDocument();
  });

  it("renders a link to the About page", () => {
    render(<Hero />);
    expect(screen.getByText("See more...")).toBeInTheDocument();
  });

  it("renders the headline about building Bemobi and exploring AI", () => {
    render(<Hero />);
    expect(
      screen.getByText("Building Bemobi, exploring AI, sharing what I read.")
    ).toBeInTheDocument();
  });

  it("renders the Pedro Ripper Co-founder description", () => {
    render(<Hero />);
    expect(
      screen.getByText(/Pedro Ripper: Co-founder/)
    ).toBeInTheDocument();
  });
});

describe("NewsCard", () => {
  it("renders without crashing", () => {
    render(<NewsCard item={mockNewsItem} index={0} />);
    expect(screen.getByText("Bemobi Reports Record Revenue")).toBeInTheDocument();
  });

  it("displays the source", () => {
    render(<NewsCard item={mockNewsItem} index={0} />);
    expect(screen.getByText("Bloomberg")).toBeInTheDocument();
  });

  it("displays the excerpt", () => {
    render(<NewsCard item={mockNewsItem} index={0} />);
    expect(screen.getByText("Bemobi reported record revenue in Q4.")).toBeInTheDocument();
  });

  it("links to the article URL", () => {
    render(<NewsCard item={mockNewsItem} index={0} />);
    const link = screen.getByText("Bemobi Reports Record Revenue").closest("a");
    expect(link).toHaveAttribute("href", "https://example.com/article");
  });

  it("shows Read article CTA", () => {
    render(<NewsCard item={mockNewsItem} index={0} />);
    expect(screen.getByText("Read article")).toBeInTheDocument();
  });
});

describe("PickCard", () => {
  it("renders without crashing", () => {
    render(<PickCard item={mockPick} />);
    expect(screen.getByText("The Future of AI")).toBeInTheDocument();
  });

  it("displays the source", () => {
    render(<PickCard item={mockPick} />);
    expect(screen.getByText("Lex Fridman Podcast")).toBeInTheDocument();
  });

  it("displays the correct media label for podcast", () => {
    render(<PickCard item={mockPick} />);
    expect(screen.getByText("Podcast")).toBeInTheDocument();
  });

  it("shows Listen CTA for podcast", () => {
    render(<PickCard item={mockPick} />);
    expect(screen.getByText("Listen")).toBeInTheDocument();
  });

  it("shows duration badge for podcast", () => {
    render(<PickCard item={mockPick} />);
    expect(screen.getByText("1:30:00")).toBeInTheDocument();
  });

  it("shows Watch CTA for video pick", () => {
    const videoPick = { ...mockPick, mediaType: "video" as const };
    render(<PickCard item={videoPick} />);
    expect(screen.getByText("Watch")).toBeInTheDocument();
  });

  it("shows Read CTA for article pick", () => {
    const articlePick = { ...mockPick, mediaType: "article" as const };
    render(<PickCard item={articlePick} />);
    expect(screen.getByText("Read")).toBeInTheDocument();
  });

  it("renders Channel badge and Subscribe CTA for channel type", () => {
    const channelPick: Pick = {
      ...mockPick,
      mediaType: "channel",
      title: "My Favorite Channel",
      source: "YouTube",
    };
    render(<PickCard item={channelPick} />);
    expect(screen.getByText("Channel")).toBeInTheDocument();
    expect(screen.getByText("Subscribe")).toBeInTheDocument();
  });

  it("renders Pedro's note in italic when note is provided", () => {
    const pickWithNote: Pick = {
      ...mockPick,
      note: "This changed how I think about AI.",
    };
    render(<PickCard item={pickWithNote} />);
    expect(screen.getByText(/This changed how I think about AI/)).toBeInTheDocument();
    expect(screen.getByText(/Pedro/)).toBeInTheDocument();
  });
});

describe("BookModal", () => {
  const onClose = jest.fn();

  beforeEach(() => onClose.mockClear());

  it("renders without crashing", () => {
    render(<BookModal book={mockBook} onClose={onClose} />);
    expect(screen.getByText("The Innovators")).toBeInTheDocument();
  });

  it("displays the author", () => {
    render(<BookModal book={mockBook} onClose={onClose} />);
    expect(screen.getByText("by Walter Isaacson")).toBeInTheDocument();
  });

  it("displays the tag", () => {
    render(<BookModal book={mockBook} onClose={onClose} />);
    expect(screen.getByText("Innovation")).toBeInTheDocument();
  });

  it("displays notes when provided", () => {
    render(<BookModal book={mockBook} onClose={onClose} />);
    // Notes are wrapped in curly quotes
    expect(screen.getByText(/One of my all-time favorites/)).toBeInTheDocument();
  });

  it("displays Amazon link when provided", () => {
    render(<BookModal book={mockBook} onClose={onClose} />);
    expect(screen.getByText("View on Amazon")).toBeInTheDocument();
  });

  it("renders cover image when coverImage is provided", () => {
    render(<BookModal book={mockBook} onClose={onClose} />);
    const img = screen.getByAltText("The Innovators by Walter Isaacson");
    expect(img).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    render(<BookModal book={mockBook} onClose={onClose} />);
    fireEvent.click(screen.getByLabelText("Close"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Escape key is pressed", () => {
    render(<BookModal book={mockBook} onClose={onClose} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe("VideoModal", () => {
  const onClose = jest.fn();

  beforeEach(() => onClose.mockClear());

  it("renders without crashing", () => {
    render(<VideoModal youtubeId="dQw4w9WgXcQ" onClose={onClose} />);
    const iframe = document.querySelector("iframe");
    expect(iframe).not.toBeNull();
  });

  it("sets the correct YouTube embed src", () => {
    render(<VideoModal youtubeId="dQw4w9WgXcQ" onClose={onClose} />);
    const iframe = document.querySelector("iframe");
    expect(iframe?.getAttribute("src")).toContain(
      "https://www.youtube.com/embed/dQw4w9WgXcQ"
    );
  });

  it("calls onClose when close button is clicked", () => {
    render(<VideoModal youtubeId="dQw4w9WgXcQ" onClose={onClose} />);
    fireEvent.click(screen.getByLabelText("Close video"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Escape key is pressed", () => {
    render(<VideoModal youtubeId="dQw4w9WgXcQ" onClose={onClose} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("shows the escape hint text", () => {
    render(<VideoModal youtubeId="dQw4w9WgXcQ" onClose={onClose} />);
    expect(screen.getByText(/Press Esc or click outside to close/)).toBeInTheDocument();
  });
});
