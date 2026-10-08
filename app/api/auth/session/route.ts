import { after, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { writeAudit } from "@/lib/server/audit";
import { enforceMemoryRateLimit, requestIp, sameOrigin } from "@/lib/server/rate-limit";
import { createSessionCookie } from "@/lib/server/session";
import { mapUser } from "@/lib/server/map";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ ok: false, message: "Požadavek byl odmítnut." }, { status: 403 });
  const body = (await request.json().catch(() => null)) as { idToken?: string } | null;
  if (!body?.idToken) return NextResponse.json({ ok: false, message: "Chybí přihlášení." }, { status: 400 });
  try {
    enforceMemoryRateLimit(requestIp(request), "admin-login", 10, 15 * 60 * 1000);
    const idToken = body.idToken;
    await createSessionCookie(idToken);
    after(async () => {
      const auth = adminAuth();
      const db = adminDb();
      if (!auth || !db) return;
      const decoded = await auth.verifyIdToken(idToken);
      const snap = await db.collection("users").doc(decoded.uid).get();
      const user = snap.exists ? mapUser(decoded.uid, snap.data() || {}) : null;
      if (!user || (user.role !== "admin" && user.role !== "superadmin") || !user.approved) return;
      await writeAudit({
        actorUid: user.uid,
        actorEmail: user.email,
        action: "admin_login",
        entity: "users",
        entityId: user.uid,
        message: "Přihlášení do správy",
      });
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Přihlášení se nezdařilo.";
    return NextResponse.json({ ok: false, message }, { status: 400 });
  }
}
