import "server-only";
import { createHash } from "crypto";
import { adminDb } from "@/lib/firebase/admin";

const memory = new Map<string, { count: number; reset: number }>();

function keyFor(ip: string, bucket: string) {
  const salt = process.env.RATE_LIMIT_SALT || "kcv";
  return createHash("sha256").update(`${salt}:${bucket}:${ip}`).digest("hex");
}

export async function enforceRateLimit(ip: string, bucket: string, limit: number, windowMs: number) {
  const key = keyFor(ip, bucket);
  const now = Date.now();
  const db = adminDb();
  if (!db) {
    const current = memory.get(key);
    if (!current || current.reset < now) {
      memory.set(key, { count: 1, reset: now + windowMs });
      return;
    }
    current.count += 1;
    if (current.count > limit) throw new Error("Příliš mnoho požadavků. Zkuste to později.");
    return;
  }

  const ref = db.collection("rateLimits").doc(key);
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const data = snap.data() as { count?: number; reset?: number } | undefined;
    if (!data || !data.reset || data.reset < now) {
      tx.set(ref, { count: 1, reset: now + windowMs });
      return;
    }
    const count = (data.count || 0) + 1;
    if (count > limit) throw new Error("Příliš mnoho požadavků. Zkuste to později.");
    tx.update(ref, { count });
  });
}

export async function verifyTurnstile(token: string | null, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  const body = new URLSearchParams({ secret, response: token, remoteip: ip });
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
  const data = (await response.json()) as { success?: boolean };
  return data.success === true;
}

export function requestIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
