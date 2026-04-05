import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getBookById, updateBook, deleteBook } from "@/lib/content";
import { isAuthenticated } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const book = await getBookById(id);
  if (!book) return NextResponse.json({ error: "Not found" }, { status: 404 });
  revalidatePath("/"); revalidatePath("/books"); return NextResponse.json(book);
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
  const book = await updateBook(id, body);
  if (!book) return NextResponse.json({ error: "Not found" }, { status: 404 });
  revalidatePath("/"); revalidatePath("/books"); return NextResponse.json(book);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const deleted = await deleteBook(id);
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
  revalidatePath("/"); revalidatePath("/books"); return NextResponse.json({ success: true });
}
