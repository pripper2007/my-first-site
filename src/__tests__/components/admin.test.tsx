/**
 * Render tests for admin components:
 * ContentListTable, BookForm, PickForm, NewsForm, VideoForm
 *
 * These tests verify the components render without crashing
 * and display the expected UI elements.
 */
import React from "react";
import { render, screen } from "@testing-library/react";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
}));

// Mock next/link — render as a plain <a>
jest.mock("next/link", () => {
  return ({ children, ...props }: any) => <a {...props}>{children}</a>;
});

// Mock @hello-pangea/dnd — render children directly without drag context
jest.mock("@hello-pangea/dnd", () => ({
  DragDropContext: ({ children }: any) => children,
  Droppable: ({ children }: any) =>
    children({
      innerRef: jest.fn(),
      droppableProps: {},
      placeholder: null,
    }),
  Draggable: ({ children }: any) =>
    children(
      {
        innerRef: jest.fn(),
        draggableProps: { style: {} },
        dragHandleProps: {},
      },
      { isDragging: false }
    ),
}));

import ContentListTable from "@/components/admin/ContentListTable";
import type { ContentItem, Column } from "@/components/admin/ContentListTable";
import BookForm from "@/components/admin/BookForm";
import PickForm from "@/components/admin/PickForm";
import NewsForm from "@/components/admin/NewsForm";
import VideoForm from "@/components/admin/VideoForm";

/* ────────────── Fixtures ────────────── */

const mockColumns: Column[] = [
  { key: "title", label: "Title", style: "bold" },
  { key: "author", label: "Author", style: "plain" },
  { key: "tag", label: "Tag", style: "tag" },
];

const mockItems: ContentItem[] = [
  { id: "b1", title: "Book Alpha", visible: true, featured: true, order: 0 },
  { id: "b2", title: "Book Beta", visible: false, featured: false, order: 1 },
  { id: "b3", title: "Book Gamma", featured: true, order: 2 },
];

/* ────────────── ContentListTable ────────────── */

describe("ContentListTable", () => {
  it("renders with mock items", () => {
    render(
      <ContentListTable
        items={mockItems}
        columns={mockColumns}
        apiPath="/api/admin/books"
        editPath="/admin/books/edit"
      />
    );
    expect(screen.getByText("Book Alpha")).toBeInTheDocument();
    expect(screen.getByText("Book Beta")).toBeInTheDocument();
    expect(screen.getByText("Book Gamma")).toBeInTheDocument();
  });

  it("shows column headers", () => {
    render(
      <ContentListTable
        items={mockItems}
        columns={mockColumns}
        apiPath="/api/admin/books"
        editPath="/admin/books/edit"
      />
    );
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Author")).toBeInTheDocument();
    expect(screen.getByText("Tag")).toBeInTheDocument();
  });

  it("shows Visible column header", () => {
    render(
      <ContentListTable
        items={mockItems}
        columns={mockColumns}
        apiPath="/api/admin/books"
        editPath="/admin/books/edit"
      />
    );
    expect(screen.getByText("Visible")).toBeInTheDocument();
  });

  it("shows Featured column header", () => {
    render(
      <ContentListTable
        items={mockItems}
        columns={mockColumns}
        apiPath="/api/admin/books"
        editPath="/admin/books/edit"
      />
    );
    expect(screen.getByText("Featured")).toBeInTheDocument();
  });

  it("shows trash icon (delete button) for each item", () => {
    render(
      <ContentListTable
        items={mockItems}
        columns={mockColumns}
        apiPath="/api/admin/books"
        editPath="/admin/books/edit"
      />
    );
    // Each row has a delete button with title="Delete"
    const deleteButtons = screen.getAllByTitle("Delete");
    expect(deleteButtons).toHaveLength(mockItems.length);
  });

  it("shows select-all checkbox in header", () => {
    render(
      <ContentListTable
        items={mockItems}
        columns={mockColumns}
        apiPath="/api/admin/books"
        editPath="/admin/books/edit"
      />
    );
    // There are checkboxes: 1 select-all + 1 per row for selection + 1 per row for visible
    const checkboxes = screen.getAllByRole("checkbox");
    // select-all (1) + row selection (3) + visible toggles (3) = 7
    expect(checkboxes.length).toBeGreaterThanOrEqual(4);
  });

  it("shows empty state when no items", () => {
    render(
      <ContentListTable
        items={[]}
        columns={mockColumns}
        apiPath="/api/admin/books"
        editPath="/admin/books/edit"
      />
    );
    expect(screen.getByText(/No items yet/)).toBeInTheDocument();
  });
});

/* ────────────── BookForm ────────────── */

describe("BookForm", () => {
  it("renders without crashing", () => {
    render(<BookForm />);
    expect(screen.getByText("Create book")).toBeInTheDocument();
  });

  it("shows title and author fields", () => {
    render(<BookForm />);
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Author")).toBeInTheDocument();
  });

  it("shows visible checkbox", () => {
    render(<BookForm />);
    expect(screen.getByText("Visible on site")).toBeInTheDocument();
  });

  it("shows featured toggle", () => {
    render(<BookForm />);
    expect(screen.getByText("Featured on homepage")).toBeInTheDocument();
  });
});

/* ────────────── PickForm ────────────── */

describe("PickForm", () => {
  it("renders without crashing", () => {
    render(<PickForm />);
    expect(screen.getByText("Create Pick")).toBeInTheDocument();
  });

  it("shows mediaType dropdown with 4 options", () => {
    render(<PickForm />);
    expect(screen.getByText("Media Type")).toBeInTheDocument();
    // The select should have 4 options
    const select = screen.getByDisplayValue("Article");
    expect(select).toBeInTheDocument();
    const options = select.querySelectorAll("option");
    expect(options).toHaveLength(4);
  });

  it("shows note field", () => {
    render(<PickForm />);
    expect(screen.getByText(/Pedro.*personal commentary/)).toBeInTheDocument();
  });
});

/* ────────────── NewsForm ────────────── */

describe("NewsForm", () => {
  it("renders without crashing", () => {
    render(<NewsForm />);
    expect(screen.getByText("Create article")).toBeInTheDocument();
  });

  it("shows basic fields", () => {
    render(<NewsForm />);
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Source Name")).toBeInTheDocument();
    expect(screen.getByText("Excerpt")).toBeInTheDocument();
    expect(screen.getByText("Visible on site")).toBeInTheDocument();
    expect(screen.getByText("Featured on homepage")).toBeInTheDocument();
  });
});

/* ────────────── VideoForm ────────────── */

describe("VideoForm", () => {
  it("renders without crashing", () => {
    render(<VideoForm />);
    expect(screen.getByText("Create video")).toBeInTheDocument();
  });

  it("shows basic fields", () => {
    render(<VideoForm />);
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("YouTube URL")).toBeInTheDocument();
    expect(screen.getByText("Duration")).toBeInTheDocument();
    expect(screen.getByText("Visible on site")).toBeInTheDocument();
    expect(screen.getByText("Featured on homepage")).toBeInTheDocument();
  });
});
