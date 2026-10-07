import "server-only";
import { adminDb } from "@/lib/firebase/admin";
import { mapAudit } from "@/lib/server/map";
import type { AuditLog } from "@/types/domain";

export async function writeAudit(entry: Omit<AuditLog, "id" | "createdAt">) {
  const db = adminDb();
  if (!db) return;
  await db.collection("auditLogs").add({ ...entry, createdAt: new Date().toISOString() });
}

export async function listAudit(limit = 100) {
  const db = adminDb();
  if (!db) return [] as AuditLog[];
  const snap = await db.collection("auditLogs").orderBy("createdAt", "desc").limit(limit).get();
  return snap.docs.map((doc) => mapAudit(doc.id, doc.data()));
}

export async function writeEmailLog(entry: { to: string; subject: string; template: string; submissionId: string; provider: string; ok: boolean }) {
  const db = adminDb();
  if (!db) return;
  await db.collection("emailLogs").add({ ...entry, createdAt: new Date().toISOString() });
}
