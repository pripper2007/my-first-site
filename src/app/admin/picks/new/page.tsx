import PickForm from "@/components/admin/PickForm";

export default function NewPickPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-900 mb-1">Add Pick</h1>
      <p className="text-sm text-gray-500 mb-8">Add a new curated pick.</p>
      <PickForm />
    </div>
  );
}
