import { NextResponse } from "next/server";
import { readBuffer } from "@/lib/server/storage";

export const runtime = "nodejs";

export async function GET(_request: Request, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const joined = path.join("/");
  if (!joined.startsWith("public/") || joined.includes("..")) {
    return new NextResponse("Nenalezeno", { status: 404 });
  }
  const file = await readBuffer(joined);
  if (!file) return new NextResponse("Nenalezeno", { status: 404 });
  return new NextResponse(Buffer.from(file.bytes), {
    headers: {
      "Content-Type": file.contentType,
      "Cache-Control": "public, max-age=86400",
    },
  });
}
