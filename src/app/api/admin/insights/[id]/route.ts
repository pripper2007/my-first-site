import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getInsightById, updateInsight, deleteInsight } from "@/lib/content";
import { isAuthenticated } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const insight = await getInsightById(id);
  if (!insight) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(insight);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await request.json();
  const insight = await updateInsight(id, body);
  if (!insight) return NextResponse.json({ error: "Not found" }, { status: 404 });
  revalidatePath("/"); revalidatePath("/insights"); return NextResponse.json(insight);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const deleted = await deleteInsight(id);
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
  revalidatePath("/"); revalidatePath("/insights"); return NextResponse.json({ success: true });
}
