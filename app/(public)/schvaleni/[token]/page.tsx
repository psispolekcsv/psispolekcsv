import type { Metadata } from "next";
import { DecisionForm } from "@/components/forms/decision-form";
import { PageShell } from "@/components/layout/page-shell";
import { submissionStatusLabel } from "@/lib/labels";
import { readApproval } from "@/lib/server/submissions";

export const metadata: Metadata = { title: "Schválení podání", robots: { index: false, follow: false } };

export default async function Page({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const result = await readApproval(token);
  if ("error" in result && result.error && !("submission" in result)) {
    return (
      <PageShell title="Odkaz nelze použít" crumbs={[{ label: "Schválení" }]}>
        <p>{result.error}</p>
      </PageShell>
    );
  }
  if (!("submission" in result) || !result.submission) {
    return (
      <PageShell title="Odkaz nelze použít" crumbs={[{ label: "Schválení" }]}>
        <p>{result.error || "Odkaz není platný."}</p>
      </PageShell>
    );
  }
  const { submission } = result;
  return (
    <PageShell title={submission.formTitle} lead={`Podání ${submission.id}`} crumbs={[{ label: "Schválení" }]}>
      <p className="mb-4 text-sm">Stav: {submissionStatusLabel[submission.status]}</p>
      {result.usable ? (
        <>
          <dl className="mb-6 grid gap-2">
            {Object.entries(submission.answers).map(([key, value]) => (
              <div key={key} className="rounded-md bg-white px-3 py-2 text-sm">
                <dt className="text-xs uppercase tracking-wide text-ink/50">{key}</dt>
                <dd>{typeof value === "boolean" ? (value ? "ano" : "ne") : String(value)}</dd>
              </div>
            ))}
          </dl>
          {submission.files.length > 0 ? (
            <ul className="mb-6 text-sm">
              {submission.files.map((file) => (
                <li key={file.path}>{file.name}</li>
              ))}
            </ul>
          ) : null}
          <DecisionForm token={token} />
        </>
      ) : (
        <p>{result.error}</p>
      )}
    </PageShell>
  );
}
