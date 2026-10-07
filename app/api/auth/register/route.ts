import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { sendEmail } from "@/lib/mail/service";
import { mailAdminPending } from "@/lib/mail/templates";
import { writeAudit, writeEmailLog } from "@/lib/server/audit";
import { getSettings } from "@/lib/server/data";
import { sameOrigin } from "@/lib/server/rate-limit";
import { siteUrl } from "@/lib/utils";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ ok: false, message: "Požadavek byl odmítnut." }, { status: 403 });
  const body = (await request.json().catch(() => null)) as { idToken?: string; displayName?: string } | null;
  if (!body?.idToken) return NextResponse.json({ ok: false, message: "Chybí účet." }, { status: 400 });
  const auth = adminAuth();
  const db = adminDb();
  if (!auth || !db) {
    return NextResponse.json({ ok: false, message: "Server Firebase není nakonfigurovaný." }, { status: 503 });
  }
  try {
    const decoded = await auth.verifyIdToken(body.idToken);
    const ref = db.collection("users").doc(decoded.uid);
    const existing = await ref.get();
    if (!existing.exists) {
      const now = new Date().toISOString();
      await ref.set({
        email: decoded.email || "",
        displayName: (body.displayName || "").slice(0, 80),
        role: "pending",
        approved: false,
        disabled: false,
        createdAt: now,
        updatedAt: now,
      });
      const settings = await getSettings();
      if (settings.email) {
        const mail = mailAdminPending({ email: decoded.email || "", siteUrl: siteUrl() });
        const sent = await sendEmail({ to: settings.email, subject: mail.subject, html: mail.html });
        await writeEmailLog({ to: settings.email, subject: mail.subject, template: "admin-pending", submissionId: decoded.uid, provider: sent.provider, ok: sent.ok });
      }
      await writeAudit({
        actorUid: decoded.uid,
        actorEmail: decoded.email || "",
        action: "admin_registered",
        entity: "users",
        entityId: decoded.uid,
        message: "Nový účet čeká na schválení",
      });
    }
    return NextResponse.json({
      ok: true,
      message: "Účet byl vytvořen. Přístup do správy musí nejprve schválit hlavní administrátor.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Registrace se nezdařila.";
    return NextResponse.json({ ok: false, message }, { status: 400 });
  }
}
