import InsightForm from "@/components/admin/InsightForm";

export default function NewInsightPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-900 mb-1">Add Insight</h1>
      <p className="text-sm text-gray-500 mb-8">Write a new insight article.</p>
      <InsightForm />
    </div>
  );
}
