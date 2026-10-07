import { notFound } from "next/navigation";
import { SubmissionReview } from "@/components/admin/submission-review";
import { submissionStatusLabel } from "@/lib/labels";
import { getSubmission, getTemplateBySlug } from "@/lib/server/data";
import { formatDateTime } from "@/lib/utils";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const submission = await getSubmission(id);
  if (!submission) notFound();
  const template = await getTemplateBySlug(submission.formSlug);
  const labels = new Map(template?.fields.map((field) => [field.id, field.label]) || []);
  const waiting = submission.status === "submitted" && !submission.locked;
  return (
    <div className="max-w-3xl">
      <p className="text-xs uppercase tracking-[0.14em] text-amber-deep">{submissionStatusLabel[submission.status]}</p>
      <h1 className="mt-2 font-serif text-4xl">{submission.formTitle}</h1>
      <p className="mt-2 text-sm text-ink/70">ID {submission.id} · {formatDateTime(submission.createdAt)}</p>
      <p className="mt-4 text-sm">{submission.partyA.name ? `${submission.partyA.name} · ` : ""}{submission.partyA.email}</p>
      <dl className="mt-6 grid gap-2">
        {Object.entries(submission.answers).map(([key, value]) => (
          <div key={key} className="rounded-md bg-white px-3 py-2 text-sm">
            <dt className="text-xs uppercase text-ink/50">{labels.get(key) || key}</dt>
            <dd>{typeof value === "boolean" ? (value ? "ano" : "ne") : String(value)}</dd>
          </div>
        ))}
      </dl>
      {submission.files.length > 0 ? (
        <ul className="mt-4 text-sm">
          {submission.files.map((file) => (
            <li key={file.path}>{labels.get(file.fieldId) || "Příloha"}: {file.name}</li>
          ))}
        </ul>
      ) : null}
      {submission.adminMessage ? (
        <section className="mt-6 rounded-lg bg-white px-4 py-3 text-sm">
          <h2 className="font-semibold">Zpráva správy</h2>
          <p className="mt-2 whitespace-pre-wrap">{submission.adminMessage}</p>
        </section>
      ) : null}
      <SubmissionReview id={submission.id} open={waiting} />
    </div>
  );
}
