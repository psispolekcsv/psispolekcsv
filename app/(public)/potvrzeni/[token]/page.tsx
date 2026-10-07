import type { Metadata } from "next";
import { PageShell } from "@/components/layout/page-shell";
import { readReceipt } from "@/lib/server/submissions";
import { formatDateTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Potvrzení podání", robots: { index: false, follow: false } };

export default async function Page({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const submission = await readReceipt(token);
  if (!submission?.finalSnapshot) {
    return (
      <PageShell title="Potvrzení není k dispozici" crumbs={[{ label: "Potvrzení" }]}>
        <p>Odkaz je neplatný, nebo podání ještě není oboustranně schválené.</p>
      </PageShell>
    );
  }
  return (
    <PageShell title={submission.formTitle} lead={`Uzavřené podání ${submission.id}`} crumbs={[{ label: "Potvrzení" }]}>
      <p className="mb-4 text-sm">Schváleno {formatDateTime(submission.finalSnapshot.approvedAt)}. Údaje jsou uzamčené.</p>
      <dl className="grid gap-2">
        {Object.entries(submission.finalSnapshot.answers).map(([key, value]) => (
          <div key={key} className="rounded-md bg-white px-3 py-2 text-sm">
            <dt className="text-xs uppercase tracking-wide text-ink/50">{key}</dt>
            <dd>{typeof value === "boolean" ? (value ? "ano" : "ne") : String(value)}</dd>
          </div>
        ))}
      </dl>
    </PageShell>
  );
}
