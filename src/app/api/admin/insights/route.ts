import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getInsights, createInsight, reorderInsights } from "@/lib/content";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const insights = await getInsights();
  return NextResponse.json(insights);
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const insight = await createInsight(body);
  revalidatePath("/"); revalidatePath("/insights"); return NextResponse.json(insight, { status: 201 });
}

export async function PATCH(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { orders } = await request.json();
    await reorderInsights(orders);
    revalidatePath("/");
    revalidatePath("/insights");
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to reorder" },
      { status: 500 }
    );
  }
}
