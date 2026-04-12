import { getInsightById } from "@/lib/content";
import { notFound } from "next/navigation";
import InsightForm from "@/components/admin/InsightForm";

export default async function EditInsightPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const insight = await getInsightById(id);

  if (!insight) notFound();

  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-900 mb-1">Edit Insight</h1>
      <p className="text-sm text-gray-500 mb-8">Update &ldquo;{insight.title}&rdquo;</p>
      <InsightForm insight={insight} />
    </div>
  );
}
