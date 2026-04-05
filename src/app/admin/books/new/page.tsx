import BookForm from "@/components/admin/BookForm";

export default function NewBookPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-900 mb-1">Add Book</h1>
      <p className="text-sm text-gray-500 mb-8">Add a new book to your reading list.</p>
      <BookForm />
    </div>
  );
}
