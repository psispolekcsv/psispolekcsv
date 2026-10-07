import { notFound } from "next/navigation";
import { reviseSubmissionAction } from "@/app/sprava/(panel)/actions";
import { submissionStatusLabel } from "@/lib/labels";
import { getSubmission } from "@/lib/server/data";
import { formatDateTime } from "@/lib/utils";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const submission = await getSubmission(id);
  if (!submission) notFound();
  const answers = submission.finalSnapshot?.answers || submission.answers;
  return (
    <div className="max-w-3xl">
      <p className="text-xs uppercase tracking-[0.14em] text-amber-deep">{submissionStatusLabel[submission.status]}</p>
      <h1 className="mt-2 font-serif text-4xl">{submission.formTitle}</h1>
      <p className="mt-2 text-sm text-ink/70">ID {submission.id} · {formatDateTime(submission.createdAt)}{submission.revisionOf ? ` · revize ${submission.revision} podání ${submission.revisionOf}` : ""}</p>
      <dl className="mt-6 grid gap-2">
        {Object.entries(answers).map(([key, value]) => (
          <div key={key} className="rounded-md bg-white px-3 py-2 text-sm">
            <dt className="text-xs uppercase text-ink/50">{key}</dt>
            <dd>{typeof value === "boolean" ? (value ? "ano" : "ne") : String(value)}</dd>
          </div>
        ))}
      </dl>
      <section className="mt-6 text-sm">
        <h2 className="font-semibold">Strany</h2>
        <p className="mt-2">{submission.partyA.name} · {submission.partyA.email} · potvrzeno {formatDateTime(submission.partyA.approvedAt) || "ne"}</p>
        {submission.partyB ? <p>{submission.partyB.name} · {submission.partyB.email} · potvrzeno {formatDateTime(submission.partyB.approvedAt) || "ne"}</p> : null}
      </section>
      {submission.locked ? (
        <form action={reviseSubmissionAction} className="mt-6">
          <input type="hidden" name="id" value={submission.id} />
          <button className="rounded-md border border-ink px-3 py-2 text-sm font-semibold">Vytvořit novou revizi</button>
        </form>
      ) : null}
    </div>
  );
}
