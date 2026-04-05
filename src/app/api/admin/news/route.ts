import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getNews, createNews } from "@/lib/content";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const news = await getNews();
  return NextResponse.json(news);
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const news = await createNews(body);
  revalidatePath("/"); revalidatePath("/news"); return NextResponse.json(news, { status: 201 });
}
