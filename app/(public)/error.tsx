"use client";

export default function PublicError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-20">
      <h1 className="font-serif text-4xl text-ink-deep">Stránku se nepodařilo načíst</h1>
      <p className="mt-3 text-ink/75">Zkuste to znovu. Když se chyba opakuje, dejte vědět správě klubu.</p>
      <button type="button" onClick={reset} className="mt-6 rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white">
        Zkusit znovu
      </button>
    </div>
  );
}
