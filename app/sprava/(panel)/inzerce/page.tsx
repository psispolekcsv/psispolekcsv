import { ResourceScreen } from "@/components/admin/resource-screen";
import { textParam } from "@/lib/filters";
import { listClassifieds } from "@/lib/server/data";

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const id = textParam((await searchParams).id);
  const items = await listClassifieds();
  const current = items.find((item) => item.id === id);
  return (
    <ResourceScreen
      title="Inzerce"
      kind="classified"
      collection="classifieds"
      editId={current?.id}
      intro="Kontakt se na webu ukáže jen u zveřejněného inzerátu."
      items={items.map((item) => ({ id: item.id, title: item.title, meta: item.published ? "zveřejněno" : "čeká" }))}
      defaults={current ? { title: current.title, body: current.body, category: current.category, contact: current.contact, published: current.published ? "true" : "" } : { category: "nabidka" }}
      fields={[
        { name: "title", label: "Nadpis", required: true },
        { name: "category", label: "Kategorie" },
        { name: "body", label: "Text", type: "textarea" },
        { name: "contact", label: "Veřejný kontakt" },
        { name: "published", label: "Zveřejnit", type: "checkbox" },
      ]}
    />
  );
}
