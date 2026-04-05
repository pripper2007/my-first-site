import { getNewsById } from "@/lib/content";
import { notFound } from "next/navigation";
import NewsForm from "@/components/admin/NewsForm";

export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const news = await getNewsById(id);

  if (!news) notFound();

  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-900 mb-1">Edit Article</h1>
      <p className="text-sm text-gray-500 mb-8">Update &ldquo;{news.title}&rdquo;</p>
      <NewsForm news={news} />
    </div>
  );
}
