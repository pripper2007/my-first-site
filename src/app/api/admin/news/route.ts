import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getNews, createNews, reorderNews } from "@/lib/content";
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

export async function PATCH(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { orders } = await request.json();
    await reorderNews(orders);
    revalidatePath("/");
    revalidatePath("/news");
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to reorder" },
      { status: 500 }
    );
  }
}
