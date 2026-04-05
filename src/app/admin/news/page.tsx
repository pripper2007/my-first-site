import Link from "next/link";
import { getAllNews } from "@/lib/content";
import ContentListTable from "@/components/admin/ContentListTable";
import type { Column } from "@/components/admin/ContentListTable";

/* Column definitions for the news table */
const columns: Column[] = [
  { key: "title", label: "Title", style: "bold" },
  { key: "source", label: "Source" },
  { key: "date", label: "Date", style: "muted" },
];

export default async function AdminNewsPage() {
  const news = await getAllNews();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 mb-1">News</h1>
          <p className="text-sm text-gray-500">{news.length} articles</p>
        </div>
        <Link
          href="/admin/news/new"
          className="px-4 py-2.5 text-sm font-medium text-white bg-gray-700 border border-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Add article
        </Link>
      </div>

      <ContentListTable
        items={news}
        columns={columns}
        apiPath="/api/admin/news"
        editPath="/admin/news"
      />
    </div>
  );
}
