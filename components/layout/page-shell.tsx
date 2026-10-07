import { Breadcrumb } from "@/components/layout/breadcrumb";

export function PageShell({
  title,
  lead,
  crumbs,
  children,
}: {
  title: string;
  lead?: string;
  crumbs: { href?: string; label: string }[];
  children: React.ReactNode;
}) {
  return (
    <article>
      <header className="border-b border-line bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
          <Breadcrumb items={crumbs} />
          <h1 className="mt-4 max-w-3xl font-serif text-4xl text-ink-deep md:text-5xl">{title}</h1>
          {lead ? <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink/80">{lead}</p> : null}
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-10">{children}</div>
    </article>
  );
}
