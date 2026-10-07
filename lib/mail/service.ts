export interface OutboundMail {
  to: string;
  subject: string;
  html: string;
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
    },
    body: JSON.stringify({
      from,
      to: [message.to],
      subject: message.subject,
      html: message.html,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("[email:resend]", response.status, detail);
    return { ok: false as const, provider: "resend" as const, detail };
  }
  return { ok: true as const, provider: "resend" as const };
}
