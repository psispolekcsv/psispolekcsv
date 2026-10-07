"use server";

import { decideByToken } from "@/lib/server/submissions";

export async function decideAction(_previous: { error?: string; status?: string } | null, formData: FormData) {
  const token = String(formData.get("token") || "");
  const decision = formData.get("decision") === "reject" ? "reject" : "approve";
  const reason = String(formData.get("reason") || "");
  const result = await decideByToken(token, decision, reason);
  if (!result.ok) return { error: result.error };
  return { status: result.status };
}
