import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/server/session";
import { sameOrigin } from "@/lib/server/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ ok: false }, { status: 403 });
  await clearSessionCookie();
  return NextResponse.json({ ok: true });
}
