import type { Metadata } from "next";
import { EmptyState } from "@/components/content/empty-state";
import { PageShell } from "@/components/layout/page-shell";
import { listGallery } from "@/lib/server/data";
import { mediaUrl } from "@/lib/utils";

export const metadata: Metadata = { title: "Fotogalerie" };

export default async function Page() {
  const items = (await listGallery()).filter((item) => item.published);
  return (
    <PageShell title="Fotogalerie" lead="Fotografie psů doplní klub. Maskot na webu není fotografie konkrétního zvířete." crumbs={[{ label: "Galerie" }]}>
      {items.length === 0 ? (
        <EmptyState title="Galerie je prázdná" text="Až budou k dispozici fotografie československých vlčáků, správa je sem vloží. Cizí plemena tu nebudou." />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li key={item.id} className="overflow-hidden rounded-lg bg-white">
              <img src={mediaUrl(item.imagePath)} alt={item.alt || item.title} className="aspect-[4/3] w-full object-cover" />
              <p className="px-3 py-2 text-sm font-semibold">{item.title}</p>
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
