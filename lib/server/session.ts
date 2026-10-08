import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { canAccessAdmin, canManageAdmins } from "@/lib/auth/permissions";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { mapUser } from "@/lib/server/map";
import type { UserProfile } from "@/types/domain";

export const SESSION_COOKIE = "session";
const FIVE_DAYS = 5 * 24 * 60 * 60 * 1000;

export async function createSessionCookie(idToken: string) {
  const auth = adminAuth();
  if (!auth) throw new Error("Server Firebase není nakonfigurovaný. Doplňte FIREBASE_SERVICE_ACCOUNT_JSON.");
  const session = await auth.createSessionCookie(idToken, { expiresIn: FIVE_DAYS });
  const jar = await cookies();
  jar.set(SESSION_COOKIE, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: FIVE_DAYS / 1000,
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

export const getCurrentUser = cache(async (): Promise<UserProfile | null> => {
  const jar = await cookies();
  const session = jar.get(SESSION_COOKIE)?.value;
  if (!session) return null;
  const auth = adminAuth();
  const db = adminDb();
  if (!auth || !db) return null;
  try {
    const decoded = await auth.verifySessionCookie(session, true);
    const ref = db.collection("users").doc(decoded.uid);
    const snap = await ref.get();
    if (!snap.exists) {
      const now = new Date().toISOString();
      const created = {
        email: decoded.email || "",
        displayName: decoded.name || "",
        role: "pending" as const,
        approved: false,
        disabled: false,
        createdAt: now,
        updatedAt: now,
      };
      await ref.set(created);
      return { uid: decoded.uid, ...created };
    }
    return mapUser(decoded.uid, snap.data() || {});
  } catch {
    return null;
  }
});

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/sprava/prihlaseni");
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (!canAccessAdmin(user)) redirect("/sprava/ceka-na-schvaleni");
  return user;
}

export async function requireSuperadmin() {
  const user = await requireAdmin();
  if (!canManageAdmins(user)) redirect("/sprava");
  return user;
}
