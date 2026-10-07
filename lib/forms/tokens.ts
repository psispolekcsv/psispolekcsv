import { createHash, randomBytes } from "crypto";

export function hashToken(raw: string) {
  return createHash("sha256").update(raw).digest("hex");
}

export function createApprovalSecret() {
  const raw = randomBytes(32).toString("base64url");
  return { raw, hash: hashToken(raw) };
}

export type TokenFailure = "used" | "expired" | "mismatch" | "party";

export function evaluateToken(
  token: {
    usedAt: string | null;
    expiresAt: string;
    submissionId: string;
    party: "a" | "b";
  },
  input: { now: string; submissionId: string; party: "a" | "b" },
): { ok: true } | { ok: false; error: TokenFailure } {
  if (token.submissionId !== input.submissionId) return { ok: false, error: "mismatch" };
  if (token.party !== input.party) return { ok: false, error: "party" };
  if (token.usedAt) return { ok: false, error: "used" };
  if (token.expiresAt <= input.now) return { ok: false, error: "expired" };
  return { ok: true };
}
