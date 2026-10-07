"use client";

import { useState } from "react";

export function ConfirmSubmit({
  action,
  id,
  collection,
  label,
  message,
}: {
  action: (formData: FormData) => void | Promise<void>;
  id: string;
  collection?: string;
  label: string;
  message: string;
}) {
  const [open, setOpen] = useState(false);
  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="text-sm text-danger">
        {label}
      </button>
    );
  }
  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 grid place-items-center bg-ink-deep/40 p-4">
      <form action={action} className="w-full max-w-sm rounded-lg bg-white p-5">
        <p className="font-semibold">{message}</p>
        <input type="hidden" name="id" value={id} />
        {collection ? <input type="hidden" name="collection" value={collection} /> : null}
        <div className="mt-4 flex gap-3">
          <button className="rounded-md bg-ink px-3 py-2 text-sm font-semibold text-white" type="submit">Potvrdit</button>
          <button className="rounded-md border border-line px-3 py-2 text-sm" type="button" onClick={() => setOpen(false)}>Zpět</button>
        </div>
      </form>
    </div>
  );
}
