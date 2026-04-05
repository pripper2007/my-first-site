import { getBookById } from "@/lib/content";
import { notFound } from "next/navigation";
import BookForm from "@/components/admin/BookForm";

export default async function EditBookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = await getBookById(id);

  if (!book) notFound();

  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-900 mb-1">Edit Book</h1>
      <p className="text-sm text-gray-500 mb-8">Update &ldquo;{book.title}&rdquo;</p>
      <BookForm book={book} />
    </div>
  );
}
