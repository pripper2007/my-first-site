import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getInsights, createInsight } from "@/lib/content";
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
