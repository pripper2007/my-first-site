import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getPicks, createPick } from "@/lib/content";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const picks = await getPicks();
  return NextResponse.json(picks);
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const pick = await createPick(body);
    revalidatePath("/");
    revalidatePath("/picks");
    return NextResponse.json(pick, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to create pick" },
      { status: 500 }
    );
  }
}
