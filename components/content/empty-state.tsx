export function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-lg border border-dashed border-line bg-white px-6 py-10">
      <h2 className="font-serif text-2xl text-ink-deep">{title}</h2>
      <p className="mt-2 max-w-xl text-ink/80">{text}</p>
    </div>
  );
}
