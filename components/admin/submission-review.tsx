"use client";

import { useState } from "react";
import { reviewSubmissionAction } from "@/app/sprava/(panel)/actions";

export function SubmissionReview({ id, open }: { id: string; open: boolean }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState("");

  return (
    <form
      action={reviewSubmissionAction}
      className="mt-8 grid gap-3 rounded-lg border border-line bg-white p-4"
      onSubmit={(event) => {
        const submitter = (event.nativeEvent as SubmitEvent).submitter;
        const decision = submitter instanceof HTMLButtonElement ? submitter.value : "";
        const message = String(new FormData(event.currentTarget).get("message") || "");
        if ((decision === "approve" || decision === "respond") && message.trim().length < 2) {
          event.preventDefault();
          setError("Napište zprávu, která přijde do e-mailu.");
          return;
        }
        setError("");
      }}
    >
      <input type="hidden" name="id" value={id} />
      {open ? (
        <>
          <label htmlFor="zprava" className="text-sm font-semibold">Zpráva do e-mailu</label>
          <textarea
            id="zprava"
            name="message"
            rows={5}
            className="w-full rounded-md border border-line px-3 py-2"
            placeholder="Tuhle zprávu dostane žadatel i správa."
          />
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <div className="flex flex-wrap gap-2">
            <button type="submit" name="decision" value="approve" className="rounded-md bg-ink px-3 py-2 text-sm font-semibold text-white">Schválit</button>
            <button type="submit" name="decision" value="respond" className="rounded-md border border-ink px-3 py-2 text-sm font-semibold">Reagovat</button>
            <button type="submit" name="decision" value="ignore" className="rounded-md border border-line px-3 py-2 text-sm">Nereagovat</button>
            <button type="button" className="rounded-md px-3 py-2 text-sm text-danger" onClick={() => setConfirmDelete(true)}>Smazat</button>
          </div>
          <p className="text-sm text-ink/70">Schválit a reagovat pošlou zprávu žadateli i správě. Nereagovat podání jen uzavře. Smazat ho odstraní bez dalšího e-mailu.</p>
        </>
      ) : (
        <button type="button" className="justify-self-start text-sm text-danger" onClick={() => setConfirmDelete(true)}>Smazat</button>
      )}
      {confirmDelete ? (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 grid place-items-center bg-ink-deep/40 p-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-5">
            <p className="font-semibold">Smazat tohle podání?</p>
            <p className="mt-2 text-sm text-ink/70">Zmizí ze správy a nikomu se neodešle další e-mail.</p>
            <div className="mt-4 flex gap-3">
              <button className="rounded-md bg-ink px-3 py-2 text-sm font-semibold text-white" type="submit" name="decision" value="delete">Smazat</button>
              <button className="rounded-md border border-line px-3 py-2 text-sm" type="button" onClick={() => setConfirmDelete(false)}>Zpět</button>
            </div>
          </div>
        </div>
      ) : null}
    </form>
  );
}
