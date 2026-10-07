import { ResourceScreen } from "@/components/admin/resource-screen";
import { textParam } from "@/lib/filters";
import { documentCategoryLabel } from "@/lib/labels";
import { listDocuments } from "@/lib/server/data";

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const id = textParam((await searchParams).id);
  const items = await listDocuments();
  const current = items.find((item) => item.id === id);
  return (
    <ResourceScreen
      title="Dokumenty"
      kind="document"
      collection="documents"
      editId={current?.id}
      fileName="file"
      intro="PDF nebo obrázek do 12 MB."
      items={items.map((item) => ({ id: item.id, title: item.title, meta: documentCategoryLabel[item.category] || item.category }))}
      defaults={current ? { title: current.title, description: current.description, category: current.category, version: current.version, validFrom: current.validFrom.slice(0, 10), published: current.published ? "true" : "" } : { category: "other" }}
      fields={[
        { name: "title", label: "Název", required: true },
        { name: "description", label: "Popis", type: "textarea" },
        { name: "category", label: "Kategorie", type: "select", options: Object.entries(documentCategoryLabel).map(([value, label]) => ({ value, label })) },
        { name: "version", label: "Verze" },
        { name: "validFrom", label: "Platí od", type: "date" },
        { name: "published", label: "Zveřejnit", type: "checkbox" },
      ]}
    />
  );
}
