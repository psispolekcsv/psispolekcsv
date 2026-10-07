import { ResourceScreen } from "@/components/admin/resource-screen";
import { textParam } from "@/lib/filters";
import { listHealth } from "@/lib/server/data";

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const id = textParam((await searchParams).id);
  const items = await listHealth();
  const current = items.find((item) => item.id === id);
  return (
    <ResourceScreen
      title="Zdraví"
      kind="health"
      collection="healthResults"
      editId={current?.id}
      intro="Veřejný řádek neobsahuje kontakt majitele. Sken nechte u podání."
      items={items.map((item) => ({ id: item.id, title: `${item.dogName} · ${item.type}`, meta: item.published ? item.result : "skryto" }))}
      defaults={current ? { dogId: current.dogId, dogName: current.dogName, type: current.type, result: current.result, examinedAt: current.examinedAt.slice(0, 10), note: current.note, published: current.published ? "true" : "" } : {}}
      fields={[
        { name: "dogName", label: "Jméno psa", required: true },
        { name: "dogId", label: "ID psa v databázi" },
        { name: "type", label: "Druh vyšetření", required: true },
        { name: "result", label: "Výsledek", required: true },
        { name: "examinedAt", label: "Datum", type: "date" },
        { name: "note", label: "Interní poznámka", type: "textarea", help: "Poznámka je součástí záznamu. Nezveřejňujte v ní osobní údaje, pokud je řádek veřejný." },
        { name: "published", label: "Zveřejnit", type: "checkbox" },
      ]}
    />
  );
}
