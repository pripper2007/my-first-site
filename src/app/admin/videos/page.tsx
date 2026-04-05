import Link from "next/link";
import { getAllVideos } from "@/lib/content";
import ContentListTable from "@/components/admin/ContentListTable";
import type { Column } from "@/components/admin/ContentListTable";

/* Column definitions for the videos table */
const columns: Column[] = [
  { key: "title", label: "Title", style: "bold" },
  { key: "channelName", label: "Channel", fallbackKey: "event" },
  { key: "duration", label: "Duration", style: "muted" },
];

export default async function AdminVideosPage() {
  const videos = await getAllVideos();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 mb-1">Videos</h1>
          <p className="text-sm text-gray-500">{videos.length} videos</p>
        </div>
        <Link
          href="/admin/videos/new"
          className="px-4 py-2.5 text-sm font-medium text-white bg-gray-700 border border-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Add video
        </Link>
      </div>

      <ContentListTable
        items={videos}
        columns={columns}
        apiPath="/api/admin/videos"
        editPath="/admin/videos"
      />
    </div>
  );
}
