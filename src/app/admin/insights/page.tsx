import Link from "next/link";
import { getAllInsights } from "@/lib/content";
import ContentListTable from "@/components/admin/ContentListTable";
import type { Column } from "@/components/admin/ContentListTable";

/* Column definitions for the insights table */
const columns: Column[] = [
  { key: "title", label: "Title", style: "bold" },
  { key: "slug", label: "Slug", style: "muted" },
  { key: "date", label: "Date", style: "muted" },
];

export default async function AdminInsightsPage() {
  const insights = await getAllInsights();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 mb-1">Insights</h1>
          <p className="text-sm text-gray-500">{insights.length} articles</p>
        </div>
        <Link
          href="/admin/insights/new"
          className="px-4 py-2.5 text-sm font-medium text-white bg-gray-700 border border-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Add insight
        </Link>
      </div>

      <ContentListTable
        items={insights}
        columns={columns}
        apiPath="/api/admin/insights"
        editPath="/admin/insights"
      />
    </div>
  );
}
