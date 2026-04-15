import Link from "next/link";
import { getAllPicks } from "@/lib/content";
import ContentListTable from "@/components/admin/ContentListTable";
import type { Column } from "@/components/admin/ContentListTable";
import PlaylistImport from "@/components/admin/PlaylistImport";

/* Column definitions for the picks table */
const columns: Column[] = [
  { key: "title", label: "Title", style: "bold" },
  { key: "source", label: "Source" },
  { key: "mediaType", label: "Type", style: "tag" },
];

export default async function AdminPicksPage() {
  const picks = await getAllPicks();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 mb-1">Picks</h1>
          <p className="text-sm text-gray-500">{picks.length} picks</p>
        </div>
        <div className="flex items-center gap-2">
          <PlaylistImport />
          <Link
            href="/admin/picks/new"
            className="px-4 py-2.5 text-sm font-medium text-white bg-gray-700 border border-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Add pick
          </Link>
        </div>
      </div>

      <ContentListTable
        items={picks}
        columns={columns}
        apiPath="/api/admin/picks"
        editPath="/admin/picks"
      />
    </div>
  );
}
