import Link from "next/link";
import { getAllBooks } from "@/lib/content";
import ContentListTable from "@/components/admin/ContentListTable";
import type { Column } from "@/components/admin/ContentListTable";

/* Column definitions for the books table — no render functions, just declarative config */
const columns: Column[] = [
  { key: "title", label: "Title", style: "bold" },
  { key: "author", label: "Author" },
  { key: "tag", label: "Tag", style: "tag" },
];

export default async function AdminBooksPage() {
  const books = await getAllBooks();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 mb-1">Books</h1>
          <p className="text-sm text-gray-500">{books.length} books</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/books/import"
            className="px-4 py-2.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Import from Audible
          </Link>
          <Link
            href="/admin/books/new"
            className="px-4 py-2.5 text-sm font-medium text-white bg-gray-700 border border-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
          >
            + Add book
          </Link>
        </div>
      </div>

      <ContentListTable
        items={books}
        columns={columns}
        apiPath="/api/admin/books"
        editPath="/admin/books"
      />
    </div>
  );
}
