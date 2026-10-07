import { submissionStatusLabel } from "@/lib/labels";
import type { SubmissionStatus } from "@/types/domain";

interface MailBase {
  formTitle: string;
  submissionId: string;
  status: SubmissionStatus;
  intro: string;
  actionLabel?: string;
  actionUrl?: string;
  contactEmail?: string;
}

function layout(input: MailBase) {
  const contact = input.contactEmail
    ? `<a href="mailto:${input.contactEmail}" style="color:#8a4e14;">${input.contactEmail}</a>`
    : "kontakt zveřejněný na webu klubu";
  const button = input.actionUrl
    ? `<p style="margin:28px 0;"><a href="${input.actionUrl}" style="background:#292929;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:6px;display:inline-block;">${input.actionLabel || "Otevřít"}</a></p>`
    : "";
  return `<!doctype html>
<html lang="cs">
<body style="margin:0;background:#f4f4f3;font-family:Georgia,serif;color:#181818;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f3;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" style="max-width:560px;background:#ffffff;border:1px solid #e5e5e3;border-radius:12px;padding:28px;">
        <tr><td>
          <p style="margin:0 0 8px;letter-spacing:.14em;text-transform:uppercase;font-family:Arial,sans-serif;font-size:12px;color:#8a4e14;">Klub československého vlčáka</p>
          <h1 style="font-size:26px;line-height:1.25;margin:0 0 12px;">${input.formTitle}</h1>
          <p style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;">${input.intro}</p>
          <p style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6;background:#f4f4f3;padding:12px 14px;border-radius:8px;">
            ID podání: <strong>${input.submissionId}</strong><br>
            Stav: <strong>${submissionStatusLabel[input.status]}</strong>
          </p>
          ${button}
          <p style="font-family:Arial,sans-serif;font-size:13px;line-height:1.5;color:#292929;">Kontakt na klub: ${contact}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
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
      intro: `${input.who} podání potvrdila. Čeká se ještě na druhou stranu. Dokud nedorazí obě potvrzení, podání není uzavřené.`,
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
      intro: `Podání bylo zamítnuto. Důvod: ${input.reason || "nebyl uveden."}`,
    }),
  };
}

export function mailAdminPending(input: { email: string; siteUrl: string }) {
  return {
    subject: "Nový účet čeká na schválení",
    html: layout({
      formTitle: "Registrace do správy",
      submissionId: input.email,
      status: "submitted",
      intro: `Účet ${input.email} vznikl a nemá oprávnění. Hlavní administrátor ho může schválit ve správě.`,
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
