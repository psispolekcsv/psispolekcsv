import type { Metadata } from "next";
import { EmptyState } from "@/components/content/empty-state";
import { PageShell } from "@/components/layout/page-shell";
import { documentCategoryLabel } from "@/lib/labels";
import { listDocuments } from "@/lib/server/data";
import { formatDate, mediaUrl } from "@/lib/utils";
import type { DocumentCategory } from "@/types/domain";

export const metadata: Metadata = { title: "Dokumenty" };

export default async function Page() {
  const documents = (await listDocuments()).filter((item) => item.published);
  const groups = new Map<DocumentCategory, typeof documents>();
  for (const document of documents) {
    const list = groups.get(document.category) || [];
    list.push(document);
    groups.set(document.category, list);
  }
  return (
    <PageShell title="Ke stažení" lead="Stanovy, řády, formuláře a dokumenty ČMKU a FCI, které klub nahrál." crumbs={[{ label: "Dokumenty" }]}>
      <p className="mb-6 text-sm">
        Standard FCI č. 332 v anglickém znění je k dispozici i přímo:{" "}
        <a className="font-semibold text-amber-deep" href="/dokumenty/fci-standard-332-en.pdf">PDF</a>.
      </p>
      {documents.length === 0 ? (
        <EmptyState title="Knihovna je prázdná" text="Soubory nahrává správa. Plné znění cizích řádů sem nekopírujeme." />
      ) : (
        <div className="space-y-8">
          {[...groups.entries()].map(([category, items]) => (
            <section key={category}>
              <h2 className="font-serif text-2xl">{documentCategoryLabel[category] || category}</h2>
              <ul className="mt-3 divide-y divide-line rounded-lg border border-line bg-white">
                {items.map((item) => (
                  <li key={item.id} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <a href={mediaUrl(item.filePath)} className="font-semibold">
                        {item.title}
                      </a>
                      <p className="text-sm text-ink/70">{item.description}</p>
                    </div>
                    <p className="text-xs text-ink/60">{item.version} {formatDate(item.validFrom)}</p>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </PageShell>
  );
}
