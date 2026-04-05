import { getAllNews, getAllVideos, getAllBooks, getAllPicks } from "@/lib/content";

/**
 * Admin dashboard — shows content counts with quick links.
 */
export default async function AdminDashboard() {
  const [news, videos, books, picks] = await Promise.all([
    getAllNews(),
    getAllVideos(),
    getAllBooks(),
    getAllPicks(),
  ]);

  const stats = [
    { label: "News", count: news.length, href: "/admin/news", active: false },
    { label: "Videos", count: videos.length, href: "/admin/videos", active: false },
    { label: "Books", count: books.length, href: "/admin/books", active: true },
    { label: "Picks", count: picks.length, href: "/admin/picks", active: true },
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-900 mb-1">Dashboard</h1>
      <p className="text-sm text-gray-500 mb-8">Content overview</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-gray-200 rounded-lg p-5"
          >
            <div className="text-3xl font-semibold text-gray-900 mb-1">
              {stat.count}
            </div>
            <div className="text-sm text-gray-500">{stat.label}</div>
            {stat.active ? (
              <a
                href={stat.href}
                className="text-xs text-gray-900 font-medium mt-3 inline-block hover:underline"
              >
                Manage &rarr;
              </a>
            ) : (
              <span className="text-xs text-gray-400 mt-3 inline-block">
                Coming soon
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
