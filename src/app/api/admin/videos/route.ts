import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getVideos, createVideo } from "@/lib/content";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const videos = await getVideos();
  return NextResponse.json(videos);
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const video = await createVideo(body);
  revalidatePath("/"); revalidatePath("/talks"); return NextResponse.json(video, { status: 201 });
}
