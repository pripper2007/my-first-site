import { getPickById } from "@/lib/content";
import { notFound } from "next/navigation";
import PickForm from "@/components/admin/PickForm";

export default async function EditPickPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pick = await getPickById(id);

  if (!pick) notFound();

  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-900 mb-1">Edit Pick</h1>
      <p className="text-sm text-gray-500 mb-8">Update &ldquo;{pick.title}&rdquo;</p>
      <PickForm pick={pick} />
    </div>
  );
}
