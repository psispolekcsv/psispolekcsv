import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/content/empty-state";
import { PageShell } from "@/components/layout/page-shell";
import { listClassifieds } from "@/lib/server/data";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Inzerce" };

export default async function Page() {
  const items = (await listClassifieds()).filter((item) => item.published);
  return (
    <PageShell title="Inzerce" lead="Inzerát se zveřejní až po schválení správou." crumbs={[{ label: "Inzerce" }]}>
      <p className="mb-6 text-sm">
        <Link href="/formulare/inzerat" className="font-semibold text-amber-deep">Podat inzerát</Link>
      </p>
      {items.length === 0 ? (
        <EmptyState title="Žádný inzerát" text="Veřejné nabídky se tu objeví po schválení. Nevyplňujeme je ukázkovým textem." />
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id} className="rounded-lg border border-line bg-white p-4">
              <p className="text-xs uppercase tracking-wide text-ink/50">{formatDate(item.createdAt)} · {item.category}</p>
              <h2 className="mt-1 font-serif text-2xl">{item.title}</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{item.body}</p>
              {item.contact ? <p className="mt-3 text-sm font-semibold">{item.contact}</p> : null}
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
