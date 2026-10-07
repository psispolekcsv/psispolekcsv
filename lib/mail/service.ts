import { readFileSync } from "node:fs";
import path from "node:path";

export interface OutboundMail {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

let logoCache: string | null | undefined;

function logoAttachment() {
  if (logoCache === undefined) {
    try {
      logoCache = readFileSync(path.join(process.cwd(), "public/fotky/logo/logo-mail.png")).toString("base64");
    } catch {
      logoCache = null;
    }
  }
  if (!logoCache) return undefined;
  return [{ filename: "logo.png", content: logoCache, content_id: "logo" }];
}

function plainText(html: string) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

export async function sendEmail(message: OutboundMail) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "Klub československého vlčáka <noreply@jirivrbatestweb.asia>";
  if (!key) {
    console.info("[email:dev]", { to: message.to, subject: message.subject });
    return { ok: true as const, provider: "console" as const };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "User-Agent": "kcv-web/1.0",
    },
    body: JSON.stringify({
      from,
      to: [message.to],
      subject: message.subject,
      html: message.html,
      text: plainText(message.html),
      reply_to: message.replyTo || undefined,
      attachments: logoAttachment(),
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("[email:resend]", response.status, detail);
    return { ok: false as const, provider: "resend" as const, detail };
  }
  return { ok: true as const, provider: "resend" as const };
}
