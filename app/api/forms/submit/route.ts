import { NextResponse } from "next/server";
import { enforceRateLimit, requestIp, sameOrigin, verifyTurnstile } from "@/lib/server/rate-limit";
import { submitPublicForm } from "@/lib/server/submissions";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return NextResponse.json({ ok: false, message: "Požadavek byl odmítnut." }, { status: 403 });
  }
  const ip = requestIp(request);
  try {
    await enforceRateLimit(ip, "form-submit", 8, 60 * 60 * 1000);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Příliš mnoho požadavků.";
    return NextResponse.json({ ok: false, message }, { status: 429 });
  }

  const form = await request.formData();
  if (String(form.get("company_website") || "").trim()) {
    return NextResponse.json({ ok: true, confirmation: "Podání jsme přijali." });
  }
  const human = await verifyTurnstile(String(form.get("cf-turnstile-response") || "") || null, ip);
  if (!human) {
    return NextResponse.json({ ok: false, message: "Ověření proti robotům se nezdařilo." }, { status: 400 });
  }

  const raw: Record<string, unknown> = {};
  const uploads: { fieldId: string; file: File }[] = [];
  for (const [key, value] of form.entries()) {
    if (key === "slug" || key === "company_website" || key === "cf-turnstile-response") continue;
    if (key.startsWith("file__") && value instanceof File && value.size > 0) {
      uploads.push({ fieldId: key.slice("file__".length), file: value });
      continue;
    }
    if (typeof value === "string") raw[key] = value;
  }

  try {
    const result = await submitPublicForm({ slug: String(form.get("slug") || ""), raw, uploads });
    if (!result.ok) {
      return NextResponse.json({ ok: false, message: "Zkontrolujte zvýrazněná pole.", errors: result.errors }, { status: 400 });
    }
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Odeslání selhalo.";
    return NextResponse.json({ ok: false, message }, { status: 400 });
  }
}
