import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getVideoById, updateVideo, deleteVideo } from "@/lib/content";
import { isAuthenticated } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const video = await getVideoById(id);
  if (!video) return NextResponse.json({ error: "Not found" }, { status: 404 });
  revalidatePath("/"); revalidatePath("/talks"); return NextResponse.json(video);
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
  const video = await updateVideo(id, body);
  if (!video) return NextResponse.json({ error: "Not found" }, { status: 404 });
  revalidatePath("/"); revalidatePath("/talks"); return NextResponse.json(video);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const deleted = await deleteVideo(id);
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
  revalidatePath("/"); revalidatePath("/talks"); return NextResponse.json({ success: true });
}
