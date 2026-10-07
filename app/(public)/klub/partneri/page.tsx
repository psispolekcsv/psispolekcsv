import type { Metadata } from "next";
import { EmptyState } from "@/components/content/empty-state";
import { PageShell } from "@/components/layout/page-shell";
import { listPartners } from "@/lib/server/data";

export const metadata: Metadata = { title: "Partneři" };

export default async function Page() {
  const partners = (await listPartners()).filter((item) => item.published);
  return (
    <PageShell title="Spolupracujeme" lead="Organizace, se kterými klub skutečně spolupracuje." crumbs={[{ label: "Klub" }, { label: "Partneři" }]}>
      {partners.length === 0 ? (
        <EmptyState title="Seznam partnerů je prázdný" text="Loga a odkazy doplní správa. Nepoužíváme cizí partnery jako výplň." />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {partners.map((partner) => (
            <li key={partner.id} className="rounded-lg bg-white px-4 py-4">
              {partner.url ? (
                <a href={partner.url} target="_blank" rel="noopener noreferrer" className="font-serif text-2xl">
                  {partner.name}
                </a>
              ) : (
                <p className="font-serif text-2xl">{partner.name}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
