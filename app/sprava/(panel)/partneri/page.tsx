import { ResourceScreen } from "@/components/admin/resource-screen";
import { textParam } from "@/lib/filters";
import { listPartners } from "@/lib/server/data";

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const id = textParam((await searchParams).id);
  const items = await listPartners();
  const current = items.find((item) => item.id === id);
  return (
    <ResourceScreen
      title="Partneři"
      kind="partner"
      collection="partners"
      editId={current?.id}
      items={items.map((item) => ({ id: item.id, title: item.name, meta: item.published ? "zveřejněno" : "skryto" }))}
      defaults={current ? { name: current.name, url: current.url, order: String(current.order), published: current.published ? "true" : "" } : {}}
      fields={[
        { name: "name", label: "Název", required: true },
        { name: "url", label: "Odkaz" },
        { name: "order", label: "Pořadí", type: "number" },
        { name: "published", label: "Zveřejnit", type: "checkbox" },
      ]}
    />
  );
}
