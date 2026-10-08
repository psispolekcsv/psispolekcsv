import "server-only";
import { boundValue } from "@/lib/forms/fields";
import { evaluateToken, hashToken, createApprovalSecret } from "@/lib/forms/tokens";
import { validateAnswers } from "@/lib/forms/validate";
import { reduceWorkflow, shouldSendFinalConfirmation, type WorkflowState } from "@/lib/forms/workflow";
import { readVerifiedFile } from "@/lib/files/sniff";
import { siteUrl } from "@/lib/utils";
import {
  mailAdminDecision,
  mailAdminNewSubmission,
  mailFinal,
  mailPartial,
  mailRejected,
  mailSubmissionReceived,
} from "@/lib/mail/templates";
import { sendEmail } from "@/lib/mail/service";
import { adminDb } from "@/lib/firebase/admin";
import { writeAudit, writeEmailLog } from "@/lib/server/audit";
import { getSettings, getTemplateBySlug, listUsers } from "@/lib/server/data";
import { mapSubmission } from "@/lib/server/map";
import { saveBuffer, storageId } from "@/lib/server/storage";
import type { FormSubmission, FormTemplate, PartyRecord, SubmissionFile } from "@/types/domain";

function workflowOf(submission: FormSubmission): WorkflowState {
  return {
    status: submission.status,
    approvalType: submission.approvalType,
    partyA: submission.partyA,
    partyB: submission.partyB,
    locked: submission.locked,
  };
}

async function deliver(to: string, subject: string, html: string, template: string, submissionId: string) {
  if (!to) return;
  const result = await sendEmail({ to, subject, html });
  await writeEmailLog({ to, subject, template, submissionId, provider: result.provider, ok: result.ok });
}

async function issueReceipt(submissionId: string, party: "a" | "b") {
  const db = adminDb();
  if (!db) throw new Error("Firebase Admin není nakonfigurovaný.");
  const secret = createApprovalSecret();
  await db.collection("receiptTokens").doc(secret.hash).set({
    hash: secret.hash,
    submissionId,
    party,
    createdAt: new Date().toISOString(),
  });
  return secret.raw;
}

export async function submitPublicForm(input: {
  slug: string;
  raw: Record<string, unknown>;
  uploads: { fieldId: string; file: File }[];
}) {
  const db = adminDb();
  if (!db) throw new Error("Odeslání formuláře vyžaduje nastavený Firebase Admin na serveru.");
  const template = await getTemplateBySlug(input.slug);
  if (!template || !template.active) throw new Error("Formulář není otevřený.");
  assertWindow(template);

  const flags = Object.fromEntries(input.uploads.map((item) => [item.fieldId, true]));
  const validated = validateAnswers(template.fields, input.raw, flags);
  if (!validated.ok) return { ok: false as const, errors: validated.errors };

  const partyA: PartyRecord = {
    name: boundValue(template.fields, validated.answers, "party_a_name"),
    email: boundValue(template.fields, validated.answers, "party_a_email").toLowerCase(),
    approvedAt: null,
    rejectedAt: null,
    rejectReason: "",
  };
  const partyB: PartyRecord | null =
    template.approvalType === "dual"
      ? {
          name: boundValue(template.fields, validated.answers, "party_b_name"),
          email: boundValue(template.fields, validated.answers, "party_b_email").toLowerCase(),
          approvedAt: null,
          rejectedAt: null,
          rejectReason: "",
        }
      : null;
  if (template.approvalType !== "none" && !partyA.email) throw new Error("Chybí e-mail první osoby.");
  if (partyB && !partyB.email) throw new Error("Chybí e-mail druhé osoby.");
  if (partyB && partyA.email === partyB.email) throw new Error("Obě strany musí mít různý e-mail.");

  const ref = db.collection("formSubmissions").doc();
  const files: SubmissionFile[] = [];
  for (const upload of input.uploads) {
    const field = template.fields.find((item) => item.id === upload.fieldId);
    if (!field || (field.type !== "file" && field.type !== "photo")) continue;
    const verified = await readVerifiedFile(upload.file, field.type === "photo" ? "image" : "document");
    const safeName = verified.name.replace(/[^\w.\-]+/g, "_");
    const path = `private/submissions/${ref.id}/${storageId()}-${safeName}`;
    await saveBuffer(path, verified.bytes, verified.type);
    files.push({ fieldId: upload.fieldId, path, name: verified.name, contentType: verified.type });
  }

  const now = new Date().toISOString();
  const base: FormSubmission = {
    id: ref.id,
    formId: template.id,
    formTitle: template.title,
    formSlug: template.slug,
    approvalType: template.approvalType,
    status: "draft",
    answers: validated.answers,
    files,
    partyA,
    partyB,
    locked: false,
    finalSnapshot: null,
    revisionOf: null,
    revision: 1,
    createdAt: now,
    updatedAt: now,
    approvedAt: null,
    adminMessage: "",
  };
  const stored: FormSubmission = { ...base, status: "submitted", locked: false };
  await ref.set(stripId(stored));

  const settings = await getSettings();
  const received = mailSubmissionReceived({
    formTitle: template.title,
    submissionId: ref.id,
    contactEmail: settings.email,
  });
  const applicants = [...new Set([partyA.email, partyB?.email].filter((item): item is string => Boolean(item)))];
  for (const email of applicants) {
    await deliver(email, received.subject, received.html, "received", ref.id);
  }
  const notice = mailAdminNewSubmission({
    formTitle: template.title,
    submissionId: ref.id,
    actionUrl: `${siteUrl()}/sprava/podani/${ref.id}`,
    contactEmail: settings.email,
  });
  for (const email of await adminRecipients(template.notificationEmails, applicants)) {
    await deliver(email, notice.subject, notice.html, "admin-notice", ref.id);
  }

  await writeAudit({
    actorUid: "public",
    actorEmail: partyA.email,
    action: "submission_created",
    entity: "formSubmissions",
    entityId: ref.id,
    message: template.title,
  });

  return {
    ok: true as const,
    id: ref.id,
    confirmation: "Podání jsme přijali. Potvrzení odchází na váš e-mail a do správy klubu.",
  };
}

async function adminRecipients(extra: string[], skip: string[]) {
  const settings = await getSettings();
  const users = await listUsers();
  const blocked = new Set(skip.map((item) => item.toLowerCase()));
  const fromAdmins = users
    .filter((user) => user.approved && !user.disabled && (user.role === "admin" || user.role === "superadmin"))
    .map((user) => user.email);
  return [...new Set([settings.email, ...extra, ...fromAdmins].map((item) => item.trim().toLowerCase()).filter((item) => item && !blocked.has(item)))];
}

function assertWindow(template: FormTemplate) {
  const now = Date.now();
  if (template.startsAt && Number.isFinite(Date.parse(template.startsAt)) && Date.parse(template.startsAt) > now) {
    throw new Error("Formulář ještě není spuštěný.");
  }
  if (template.endsAt && Number.isFinite(Date.parse(template.endsAt)) && Date.parse(template.endsAt) < now) {
    throw new Error("Formulář je uzavřený.");
  }
}

function applyState(submission: FormSubmission, state: WorkflowState, now: string): FormSubmission {
  const next: FormSubmission = {
    ...submission,
    status: state.status,
    partyA: state.partyA,
    partyB: state.partyB,
    locked: state.locked,
    updatedAt: now,
  };
  if (state.status === "approved") {
    next.approvedAt = now;
    next.finalSnapshot = { answers: submission.answers, files: submission.files, approvedAt: now };
    next.locked = true;
  }
  return next;
}

function stripId(submission: FormSubmission) {
  const { id, ...rest } = submission;
  void id;
  return rest;
}

async function sendFinal(submission: FormSubmission, contactEmail: string) {
  const linkA = `${siteUrl()}/potvrzeni/${await issueReceipt(submission.id, "a")}`;
  const linkB = submission.partyB ? `${siteUrl()}/potvrzeni/${await issueReceipt(submission.id, "b")}` : "";
  const first = mailFinal({ formTitle: submission.formTitle, submissionId: submission.id, actionUrl: linkA, contactEmail });
  await deliver(submission.partyA.email, first.subject, first.html, "final", submission.id);
  if (submission.partyB && linkB) {
    const second = mailFinal({ formTitle: submission.formTitle, submissionId: submission.id, actionUrl: linkB, contactEmail });
    await deliver(submission.partyB.email, second.subject, second.html, "final", submission.id);
  }
}

export async function readApproval(rawToken: string) {
  const db = adminDb();
  if (!db) return { error: "Server není nakonfigurovaný." as const };
  const tokenSnap = await db.collection("approvalTokens").doc(hashToken(rawToken)).get();
  if (!tokenSnap.exists) return { error: "Odkaz není platný." as const };
  const token = tokenSnap.data() || {};
  const submissionId = String(token.submissionId || "");
  const party = token.party === "b" ? "b" : "a";
  const subSnap = await db.collection("formSubmissions").doc(submissionId).get();
  if (!subSnap.exists) return { error: "Podání neexistuje." as const };
  const submission = mapSubmission(subSnap.id, subSnap.data() || {});
  const verdict = evaluateToken(
    {
      usedAt: typeof token.usedAt === "string" ? token.usedAt : null,
      expiresAt: String(token.expiresAt || ""),
      submissionId,
      party,
    },
    { now: new Date().toISOString(), submissionId, party },
  );
  return { submission, party, usable: verdict.ok, error: verdict.ok ? null : tokenMessage(verdict.ok ? "used" : verdict.error) };
}

function tokenMessage(error: "used" | "expired" | "mismatch" | "party") {
  if (error === "used") return "Odkaz už byl použitý.";
  if (error === "expired") return "Platnost odkazu vypršela.";
  return "Odkaz není platný.";
}

export async function decideByToken(rawToken: string, decision: "approve" | "reject", reason: string) {
  const db = adminDb();
  if (!db) throw new Error("Server není nakonfigurovaný.");
  const hash = hashToken(rawToken);
  const tokenRef = db.collection("approvalTokens").doc(hash);
  const now = new Date().toISOString();

  const outcome: { error: string } | { previous: FormSubmission["status"]; submission: FormSubmission; party: "a" | "b" } = await db.runTransaction(async (tx) => {
    const tokenSnap = await tx.get(tokenRef);
    if (!tokenSnap.exists) return { error: "Odkaz není platný." };
    const token = tokenSnap.data() || {};
    const submissionId = String(token.submissionId || "");
    const party = token.party === "b" ? "b" : "a";
    const subRef = db.collection("formSubmissions").doc(submissionId);
    const subSnap = await tx.get(subRef);
    if (!subSnap.exists) return { error: "Podání neexistuje." };
    const current = mapSubmission(subSnap.id, subSnap.data() || {});
    const verdict = evaluateToken(
      {
        usedAt: typeof token.usedAt === "string" ? token.usedAt : null,
        expiresAt: String(token.expiresAt || ""),
        submissionId,
        party,
      },
      { now, submissionId, party },
    );
    if (!verdict.ok) {
      if (verdict.error === "expired" && !current.locked) {
        tx.update(subRef, { status: "expired", locked: true, updatedAt: now });
      }
      return { error: tokenMessage(verdict.error) };
    }
    const previous = current.status;
    const state = reduceWorkflow(
      workflowOf(current),
      decision === "approve" ? { type: "approve", party, at: now } : { type: "reject", party, at: now, reason: reason.slice(0, 500) },
    );
    if (state.status === previous && decision === "approve" && previous !== "draft") {
      return { error: "Podání už nelze znovu potvrdit." };
    }
    const next = applyState(current, state, now);
    tx.update(subRef, stripId(next));
    tx.update(tokenRef, { usedAt: now });
    return { previous, submission: next, party };
  });

  if ("error" in outcome) return { ok: false as const, error: outcome.error };

  const settings = await getSettings();
  const { submission, previous, party } = outcome;
  if (shouldSendFinalConfirmation(previous, submission.status)) {
    await sendFinal(submission, settings.email);
    await writeAudit({
      actorUid: "token",
      actorEmail: party === "a" ? submission.partyA.email : submission.partyB?.email || "",
      action: "submission_approved",
      entity: "formSubmissions",
      entityId: submission.id,
      message: submission.formTitle,
    });
  } else if (submission.status === "rejected") {
    const rejected = mailRejected({
      formTitle: submission.formTitle,
      submissionId: submission.id,
      reason,
      contactEmail: settings.email,
    });
    await deliver(submission.partyA.email, rejected.subject, rejected.html, "rejected", submission.id);
    if (submission.partyB) await deliver(submission.partyB.email, rejected.subject, rejected.html, "rejected", submission.id);
    await writeAudit({
      actorUid: "token",
      actorEmail: party === "a" ? submission.partyA.email : submission.partyB?.email || "",
      action: "submission_rejected",
      entity: "formSubmissions",
      entityId: submission.id,
      message: reason,
    });
  } else {
    const who = party === "a" ? submission.partyA.name || "První strana" : submission.partyB?.name || "Druhá strana";
    const partial = mailPartial({
      formTitle: submission.formTitle,
      submissionId: submission.id,
      status: submission.status,
      who,
      contactEmail: settings.email,
    });
    await deliver(submission.partyA.email, partial.subject, partial.html, "partial", submission.id);
    if (submission.partyB) await deliver(submission.partyB.email, partial.subject, partial.html, "partial", submission.id);
  }

  return { ok: true as const, status: submission.status, id: submission.id };
}

export async function readReceipt(rawToken: string) {
  const db = adminDb();
  if (!db) return null;
  const snap = await db.collection("receiptTokens").doc(hashToken(rawToken)).get();
  if (!snap.exists) return null;
  const submissionId = String(snap.data()?.submissionId || "");
  const sub = await db.collection("formSubmissions").doc(submissionId).get();
  if (!sub.exists) return null;
  const submission = mapSubmission(sub.id, sub.data() || {});
  if (submission.status !== "approved" || !submission.finalSnapshot) return null;
  return submission;
}

export async function reviewSubmission(
  actor: { uid: string; email: string },
  submissionId: string,
  decision: "approve" | "respond" | "ignore",
  message: string,
) {
  const db = adminDb();
  if (!db) throw new Error("Firebase Admin není nakonfigurovaný.");
  const snap = await db.collection("formSubmissions").doc(submissionId).get();
  if (!snap.exists) throw new Error("Podání neexistuje.");
  const submission = mapSubmission(snap.id, snap.data() || {});
  if (submission.locked || submission.status !== "submitted") {
    throw new Error("Na tohle podání už správa reagovala.");
  }
  const text = message.trim().slice(0, 2000);
  if (decision !== "ignore" && text.length < 2) throw new Error("Napište zprávu, která přijde do e-mailu.");
  const now = new Date().toISOString();
  const status = decision === "approve" ? "approved" : decision === "respond" ? "responded" : "ignored";
  await snap.ref.set(
    {
      status,
      locked: true,
      adminMessage: text,
      updatedAt: now,
      approvedAt: status === "approved" ? now : submission.approvedAt,
    },
    { merge: true },
  );
  if (decision !== "ignore") {
    const settings = await getSettings();
    const mail = mailAdminDecision({
      formTitle: submission.formTitle,
      submissionId: submission.id,
      status: status === "approved" ? "approved" : "responded",
      message: text,
      contactEmail: settings.email,
    });
    const applicants = [submission.partyA.email, submission.partyB?.email].filter((item): item is string => Boolean(item));
    const recipients = [...new Set([...applicants, ...(await adminRecipients([], applicants)), actor.email.trim().toLowerCase()])];
    for (const email of recipients) {
      await deliver(email, mail.subject, mail.html, decision, submission.id);
    }
  }
  await writeAudit({
    actorUid: actor.uid,
    actorEmail: actor.email,
    action: decision === "approve" ? "submission_approved" : decision === "respond" ? "submission_responded" : "submission_ignored",
    entity: "formSubmissions",
    entityId: submission.id,
    message: text || submission.formTitle,
  });
}

export async function createRevision(actor: { uid: string; email: string }, submissionId: string) {
  const db = adminDb();
  if (!db) throw new Error("Firebase Admin není nakonfigurovaný.");
  const current = await db.collection("formSubmissions").doc(submissionId).get();
  if (!current.exists) throw new Error("Podání neexistuje.");
  const submission = mapSubmission(current.id, current.data() || {});
  if (!submission.locked) throw new Error("Revize se zakládá až u uzavřeného podání.");
  const now = new Date().toISOString();
  const ref = db.collection("formSubmissions").doc();
  const copy: FormSubmission = {
    ...submission,
    id: ref.id,
    status: "draft",
    locked: false,
    finalSnapshot: null,
    approvedAt: null,
    revisionOf: submission.id,
    revision: submission.revision + 1,
    partyA: { ...submission.partyA, approvedAt: null, rejectedAt: null, rejectReason: "" },
    partyB: submission.partyB ? { ...submission.partyB, approvedAt: null, rejectedAt: null, rejectReason: "" } : null,
    createdAt: now,
    updatedAt: now,
    adminMessage: "",
  };
  await ref.set(stripId(copy));
  await writeAudit({
    actorUid: actor.uid,
    actorEmail: actor.email,
    action: "submission_revision",
    entity: "formSubmissions",
    entityId: ref.id,
    message: `Revize podání ${submission.id}`,
  });
  return ref.id;
}
