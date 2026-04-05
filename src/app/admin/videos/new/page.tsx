import VideoForm from "@/components/admin/VideoForm";

export default function NewVideoPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-900 mb-1">Add Video</h1>
      <p className="text-sm text-gray-500 mb-8">Add a new video or talk.</p>
      <VideoForm />
    </div>
  );
}
