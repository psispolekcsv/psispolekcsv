import { describe, expect, it } from "vitest";
import { reduceWorkflow, shouldSendFinalConfirmation, type WorkflowState } from "@/lib/forms/workflow";
import { assertRoleChange } from "@/lib/auth/permissions";
import { createApprovalSecret, evaluateToken, hashToken } from "@/lib/forms/tokens";
import { validateAnswers } from "@/lib/forms/validate";
import type { FormField } from "@/types/domain";

const party = { name: "Anna", email: "anna@example.com", approvedAt: null, rejectedAt: null, rejectReason: "" };

function dual(): WorkflowState {
  return {
    status: "draft",
    approvalType: "dual",
    locked: false,
    partyA: { ...party },
    partyB: { ...party, name: "Petr", email: "petr@example.com" },
  };
}

describe("schvalování", () => {
  it("čeká na obě strany a po druhé se uzavře", () => {
    const submitted = reduceWorkflow(dual(), { type: "submit" });
    expect(submitted.status).toBe("awaiting_approvals");
    expect(shouldSendFinalConfirmation("draft", submitted.status)).toBe(false);
    const first = reduceWorkflow(submitted, { type: "approve", party: "a", at: "2026-01-01T10:00:00.000Z" });
    expect(first.status).toBe("awaiting_party_b");
    expect(shouldSendFinalConfirmation(submitted.status, first.status)).toBe(false);
    const second = reduceWorkflow(first, { type: "approve", party: "b", at: "2026-01-01T11:00:00.000Z" });
    expect(second.status).toBe("approved");
    expect(second.locked).toBe(true);
    expect(shouldSendFinalConfirmation(first.status, second.status)).toBe(true);
    const again = reduceWorkflow(second, { type: "approve", party: "a", at: "2026-01-02T00:00:00.000Z" });
    expect(again).toEqual(second);
  });

  it("zamítnutí jedné strany uzavře podání", () => {
    const submitted = reduceWorkflow(dual(), { type: "submit" });
    const rejected = reduceWorkflow(submitted, { type: "reject", party: "b", at: "2026-01-01T10:00:00.000Z", reason: "nesouhlas" });
    expect(rejected.status).toBe("rejected");
  });
});

describe("oprávnění", () => {
  const pending = { uid: "1", role: "pending" as const, approved: false };
  const admin = { uid: "2", role: "admin" as const, approved: true };
  const superadmin = { uid: "3", role: "superadmin" as const, approved: true };

  it("čekající účet do správy nepatří", () => {
    expect(assertRoleChange({ actor: pending, targetUid: "9", nextRole: "admin" }).ok).toBe(false);
  });

  it("běžný administrátor nezmění roli a nevytvoří hlavního administrátora", () => {
    expect(assertRoleChange({ actor: admin, targetUid: "9", nextRole: "admin" }).ok).toBe(false);
    expect(assertRoleChange({ actor: admin, targetUid: "9", nextRole: "superadmin" }).ok).toBe(false);
  });

  it("hlavní administrátor neschválí sám sebe", () => {
    expect(assertRoleChange({ actor: superadmin, targetUid: superadmin.uid, nextRole: "superadmin" }).ok).toBe(false);
  });

  it("hlavní administrátor schválí jiný účet", () => {
    expect(assertRoleChange({ actor: superadmin, targetUid: "9", nextRole: "admin" }).ok).toBe(true);
  });
});

describe("tokeny", () => {
  it("ukládá jen hash a odmítne opakované i prošlé použití", () => {
    const first = createApprovalSecret();
    const second = createApprovalSecret();
    expect(first.raw).not.toBe(first.hash);
    expect(first.hash).toHaveLength(64);
    expect(first.hash).not.toBe(second.hash);
    expect(hashToken(first.raw)).toBe(first.hash);
    const token = { usedAt: null as string | null, expiresAt: "2026-02-01T00:00:00.000Z", submissionId: "sub", party: "a" as const };
    expect(evaluateToken(token, { now: "2026-01-01T00:00:00.000Z", submissionId: "sub", party: "a" }).ok).toBe(true);
    expect(evaluateToken({ ...token, usedAt: "2026-01-02T00:00:00.000Z" }, { now: "2026-01-03T00:00:00.000Z", submissionId: "sub", party: "a" })).toEqual({ ok: false, error: "used" });
    expect(evaluateToken(token, { now: "2026-03-01T00:00:00.000Z", submissionId: "sub", party: "a" })).toEqual({ ok: false, error: "expired" });
    expect(evaluateToken(token, { now: "2026-01-01T00:00:00.000Z", submissionId: "jine", party: "a" })).toEqual({ ok: false, error: "mismatch" });
  });
});

describe("validace formuláře", () => {
  const fields: FormField[] = [
    { id: "email", type: "email", label: "E-mail", description: "", placeholder: "", required: true, order: 1, options: [], binding: "party_a_email" },
    { id: "souhlas", type: "consent", label: "Souhlas", description: "", placeholder: "", required: true, order: 2, options: [] },
  ];

  it("vyžaduje e-mail a souhlas", () => {
    const result = validateAnswers(fields, { email: "neplatny", souhlas: false });
    expect(result.ok).toBe(false);
    expect(result.errors.email).toBeTruthy();
    expect(result.errors.souhlas).toBeTruthy();
  });
});
