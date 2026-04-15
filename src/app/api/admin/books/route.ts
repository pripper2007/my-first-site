import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getBooks, createBook, reorderBooks } from "@/lib/content";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const books = await getBooks();
  return NextResponse.json(books);
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const book = await createBook(body);
  revalidatePath("/"); revalidatePath("/books"); return NextResponse.json(book, { status: 201 });
}

export async function PATCH(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { orders } = await request.json();
    await reorderBooks(orders);
    revalidatePath("/");
    revalidatePath("/books");
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to reorder" },
      { status: 500 }
    );
  }
}
