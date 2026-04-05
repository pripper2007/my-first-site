import { getVideoById } from "@/lib/content";
import { notFound } from "next/navigation";
import VideoForm from "@/components/admin/VideoForm";

export default async function EditVideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const video = await getVideoById(id);

  if (!video) notFound();

  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-900 mb-1">Edit Video</h1>
      <p className="text-sm text-gray-500 mb-8">Update &ldquo;{video.title}&rdquo;</p>
      <VideoForm video={video} />
    </div>
  );
}
