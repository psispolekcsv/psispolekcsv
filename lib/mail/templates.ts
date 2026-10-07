import { submissionStatusLabel } from "@/lib/labels";
import type { SubmissionStatus } from "@/types/domain";

interface MailBase {
  formTitle: string;
  submissionId: string;
  status: SubmissionStatus;
  intro: string;
  noteHtml?: string;
  actionLabel?: string;
  actionUrl?: string;
  contactEmail?: string;
  referenceLabel?: string;
}

const statusTone: Partial<Record<SubmissionStatus, { bg: string; fg: string }>> = {
  approved: { bg: "#e5f0e4", fg: "#1d4a28" },
  rejected: { bg: "#f8e4e4", fg: "#8d2b2b" },
  responded: { bg: "#f6eadb", fg: "#8a4e14" },
  submitted: { bg: "#f6eadb", fg: "#8a4e14" },
  awaiting_approvals: { bg: "#f6eadb", fg: "#8a4e14" },
  awaiting_party_a: { bg: "#f6eadb", fg: "#8a4e14" },
  awaiting_party_b: { bg: "#f6eadb", fg: "#8a4e14" },
};

function layout(input: MailBase) {
  const site = (process.env.NEXT_PUBLIC_SITE_URL || "https://jirivrbatestweb.asia").replace(/\/$/, "");
  const tone = statusTone[input.status] || { bg: "#ececeb", fg: "#292929" };
  const title = escapeHtml(input.formTitle);
  const reference = escapeHtml(input.submissionId);
  const status = escapeHtml(submissionStatusLabel[input.status]);
  const contact = input.contactEmail
    ? `<a href="mailto:${escapeHtml(input.contactEmail)}" style="color:#8a4e14;text-decoration:none;font-weight:700;">${escapeHtml(input.contactEmail)}</a>`
    : "kontakt zveřejněný na webu klubu";
  const note = input.noteHtml
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 22px;">
        <tr><td style="background:#fbf6f0;border-left:4px solid #c8752b;border-radius:10px;padding:16px 18px;font-family:Georgia,'Times New Roman',serif;font-size:17px;line-height:1.55;color:#181818;">${input.noteHtml}</td></tr>
      </table>`
    : "";
  const button = input.actionUrl
    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 26px;"><tr><td bgcolor="#181818" style="border-radius:8px;">
        <a href="${escapeHtml(input.actionUrl)}" style="display:inline-block;padding:14px 22px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;">${escapeHtml(input.actionLabel || "Otevřít")}</a>
      </td></tr></table>`
    : "";
  return `<!doctype html>
<html lang="cs">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f3;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${title}. ${status}.</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#f4f4f3" style="background:#f4f4f3;">
    <tr><td align="center" style="padding:32px 12px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
        <tr>
          <td bgcolor="#181818" style="background:#181818;border-radius:18px 18px 0 0;padding:22px 26px 18px;">
            <table role="presentation" cellpadding="0" cellspacing="0"><tr>
              <td style="padding-right:14px;vertical-align:middle;">
                <img src="cid:logo" width="72" height="72" alt="Znak Klubu československého vlčáka" style="display:block;border:0;width:72px;height:72px;">
              </td>
              <td style="vertical-align:middle;">
                <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#c8752b;padding-bottom:6px;">Plemeno FCI č. 332</div>
                <div style="font-family:Georgia,'Times New Roman',serif;font-size:22px;line-height:1.15;color:#ffffff;">Klub československého vlčáka</div>
              </td>
            </tr></table>
          </td>
        </tr>
        <tr><td bgcolor="#c8752b" style="background:#c8752b;height:4px;font-size:0;line-height:0;">&nbsp;</td></tr>
        <tr>
          <td bgcolor="#ffffff" style="background:#ffffff;padding:28px 26px 8px;">
            <h1 style="margin:0 0 14px;font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:1.2;color:#181818;font-weight:500;">${title}</h1>
            <p style="margin:0 0 18px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.65;color:#292929;">${input.intro}</p>
            ${note}
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 22px;">
              <tr>
                <td bgcolor="#f4f4f3" style="background:#f4f4f3;border-radius:12px;padding:14px 16px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5;color:#292929;">
                  ${escapeHtml(input.referenceLabel || "Číslo podání")}<br>
                  <strong style="color:#181818;font-size:15px;">${reference}</strong>
                  <div style="height:10px;line-height:10px;font-size:0;">&nbsp;</div>
                  <span style="display:inline-block;background:${tone.bg};color:${tone.fg};font-size:12px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;padding:5px 10px;border-radius:999px;">${status}</span>
                </td>
              </tr>
            </table>
            ${button}
          </td>
        </tr>
        <tr>
          <td bgcolor="#ffffff" style="background:#ffffff;border-radius:0 0 18px 18px;padding:4px 26px 26px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.6;color:#5c5c5c;">
            Kontakt na klub: ${contact}<br>
            <a href="${site}" style="color:#8a4e14;text-decoration:none;">${site.replace(/^https?:\/\//, "")}</a>
          </td>
        </tr>
      </table>
      <p style="max-width:560px;margin:14px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.5;color:#8a8a88;">Tento dopis odeslal web Klubu československého vlčáka. Odpověď pište na kontakt klubu, ne na adresu odesílatele.</p>
    </td></tr>
  </table>
</body>
</html>`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function mailSubmissionReceived(input: { formTitle: string; submissionId: string; contactEmail?: string }) {
  return {
    subject: `Přijato: ${input.formTitle}`,
    html: layout({
      formTitle: input.formTitle,
      submissionId: input.submissionId,
      status: "submitted",
      contactEmail: input.contactEmail,
      intro: "Podání jsme přijali. Správa klubu ho má v evidenci a ozve se e-mailem, pokud na něj bude reagovat nebo ho schválí.",
    }),
  };
}

export function mailAdminNewSubmission(input: { formTitle: string; submissionId: string; actionUrl: string; contactEmail?: string }) {
  return {
    subject: `Nové podání: ${input.formTitle}`,
    html: layout({
      formTitle: input.formTitle,
      submissionId: input.submissionId,
      status: "submitted",
      contactEmail: input.contactEmail,
      actionUrl: input.actionUrl,
      actionLabel: "Otevřít ve správě",
      intro: "Na webu přišlo nové podání. Ve správě uvidíte vyplněné údaje a můžete ho schválit, odpovědět, nechat bez reakce, nebo smazat.",
    }),
  };
}

export function mailAdminDecision(input: {
  formTitle: string;
  submissionId: string;
  status: "approved" | "responded";
  message: string;
  contactEmail?: string;
}) {
  const title = input.status === "approved" ? "Schváleno" : "Odpověď správy";
  const safe = escapeHtml(input.message).replace(/\n/g, "<br>");
  return {
    subject: `${title}: ${input.formTitle}`,
    html: layout({
      formTitle: input.formTitle,
      submissionId: input.submissionId,
      status: input.status,
      contactEmail: input.contactEmail,
      intro: input.status === "approved" ? "Správa klubu podání schválila a připsala k němu tuto zprávu." : "Správa klubu k podání napsala:",
      noteHtml: safe,
    }),
  };
}

export function mailReceived(input: Omit<MailBase, "intro" | "status"> & { status?: SubmissionStatus }) {
  return {
    subject: `Přijato: ${input.formTitle}`,
    html: layout({
      ...input,
      status: input.status || "awaiting_approvals",
      intro: "Podání jsme přijali. Dokončete ho tlačítkem níže. Odkaz je jen pro vás, má omezenou platnost a po použití přestane platit.",
      actionLabel: "Zkontrolovat a potvrdit",
    }),
  };
}

export function mailAskApproval(input: Omit<MailBase, "intro">) {
  return {
    subject: `Prosíme o schválení: ${input.formTitle}`,
    html: layout({
      ...input,
      intro: "Někdo vás uvedl jako druhou stranu podání. Zkontrolujte údaje a samostatně je schvalte, nebo je zamítněte. V odkazu není text formuláře.",
      actionLabel: "Otevřít podání",
    }),
  };
}

export function mailPartial(input: Omit<MailBase, "intro"> & { who: string }) {
  return {
    subject: `Jedna strana už potvrdila: ${input.formTitle}`,
    html: layout({
      ...input,
      intro: `${escapeHtml(input.who)} podání potvrdila. Čeká se ještě na druhou stranu. Dokud nedorazí obě potvrzení, podání není uzavřené.`,
    }),
  };
}

export function mailFinal(input: Omit<MailBase, "intro" | "status">) {
  return {
    subject: `Schváleno: ${input.formTitle}`,
    html: layout({
      ...input,
      status: "approved",
      intro: "Obě potřebná potvrzení jsou hotová. Podání je uzamčené. Stejný zápis mají k dispozici obě strany a správa klubu.",
      actionLabel: "Otevřít závěrečný zápis",
    }),
  };
}

export function mailRejected(input: Omit<MailBase, "intro" | "status"> & { reason: string }) {
  return {
    subject: `Zamítnuto: ${input.formTitle}`,
    html: layout({
      ...input,
      status: "rejected",
      intro: "Podání bylo zamítnuto.",
      noteHtml: escapeHtml(input.reason || "Důvod nebyl uveden."),
    }),
  };
}

export function mailAdminPending(input: { email: string; siteUrl: string }) {
  return {
    subject: "Nový účet čeká na schválení",
    html: layout({
      formTitle: "Registrace do správy",
      submissionId: input.email,
      referenceLabel: "Účet",
      status: "submitted",
      intro: `Účet ${escapeHtml(input.email)} vznikl a nemá oprávnění. Hlavní administrátor ho může schválit ve správě.`,
      actionLabel: "Otevřít správu",
      actionUrl: `${input.siteUrl}/sprava/administrator`,
    }),
  };
}

export function mailAdminApproved(input: { siteUrl: string }) {
  return {
    subject: "Přístup do správy byl schválen",
    html: layout({
      formTitle: "Správa webu",
      submissionId: "účet",
      status: "approved",
      intro: "Hlavní administrátor schválil váš přístup. Můžete se přihlásit.",
      actionLabel: "Přihlásit se",
      actionUrl: `${input.siteUrl}/sprava/prihlaseni`,
    }),
  };
}

export function mailAdminRejected(input: { siteUrl: string }) {
  return {
    subject: "Přístup do správy nebyl schválen",
    html: layout({
      formTitle: "Správa webu",
      submissionId: "účet",
      status: "rejected",
      intro: "Hlavní administrátor přístup neschválil. Účet do správy webu nevede.",
      actionUrl: input.siteUrl,
      actionLabel: "Web klubu",
    }),
  };
}
