import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getBooks, createBook } from "@/lib/content";
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
