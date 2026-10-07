"use client";

import { useActionState } from "react";
import { submissionStatusLabel } from "@/lib/labels";
import { decideAction } from "@/app/(public)/schvaleni/actions";
import type { SubmissionStatus } from "@/types/domain";

export function DecisionForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState(decideAction, null);
  if (state?.status) {
    return (
      <p role="status" className="rounded-lg bg-white px-4 py-4">
        Hotovo. Stav podání je nyní: <strong>{submissionStatusLabel[state.status as SubmissionStatus]}</strong>.
        {state.status !== "approved" ? " Dokud nepotvrdí obě strany, podání není uzavřené." : " Oběma stranám odchází závěrečný e-mail."}
      </p>
    );
  }
  return (
    <form action={action} className="grid max-w-xl gap-3">
      <input type="hidden" name="token" value={token} />
      <label className="text-sm font-semibold">
        Důvod zamítnutí, pokud nesouhlasíte
        <textarea name="reason" rows={3} className="mt-1 w-full rounded-md border border-line px-3 py-2 font-normal" />
      </label>
      {state?.error ? <p role="alert" className="text-sm text-danger">{state.error}</p> : null}
      <div className="flex flex-wrap gap-3">
        <button name="decision" value="approve" disabled={pending} className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white">
          Potvrdit údaje
        </button>
        <button name="decision" value="reject" disabled={pending} className="rounded-md border border-danger px-4 py-2 text-sm font-semibold text-danger">
          Zamítnout
        </button>
      </div>
    </form>
  );
}
