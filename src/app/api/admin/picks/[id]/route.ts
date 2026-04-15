import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getPickById, updatePick, deletePick } from "@/lib/content";
import { isAuthenticated } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const pick = await getPickById(id);
  if (!pick) return NextResponse.json({ error: "Not found" }, { status: 404 });
  revalidatePath("/"); revalidatePath("/picks"); return NextResponse.json(pick);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const body = await request.json();
    const pick = await updatePick(id, body);
    if (!pick) return NextResponse.json({ error: "Not found" }, { status: 404 });
    revalidatePath("/");
    revalidatePath("/picks");
    return NextResponse.json(pick);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to update pick" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const deleted = await deletePick(id);
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
  revalidatePath("/"); revalidatePath("/picks"); return NextResponse.json({ success: true });
}
