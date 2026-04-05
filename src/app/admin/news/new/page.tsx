import NewsForm from "@/components/admin/NewsForm";

export default function NewNewsPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-900 mb-1">Add Article</h1>
      <p className="text-sm text-gray-500 mb-8">Add a new news article.</p>
      <NewsForm />
    </div>
  );
}
