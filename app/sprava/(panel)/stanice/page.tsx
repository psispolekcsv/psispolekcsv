import { ResourceScreen } from "@/components/admin/resource-screen";
import { textParam } from "@/lib/filters";
import { listKennels } from "@/lib/server/data";

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const id = textParam((await searchParams).id);
  const items = await listKennels();
  const current = items.find((item) => item.id === id);
  return (
    <ResourceScreen
      title="Chovatelské stanice"
      kind="kennel"
      collection="kennels"
      editId={current?.id}
      intro="Jméno držitele se na webu ukáže. Neuvádějte telefon, pokud nemá být veřejný."
      items={items.map((item) => ({ id: item.id, title: item.name, meta: item.published ? item.region : "skryto" }))}
      defaults={current ? { name: current.name, slug: current.slug, ownerName: current.ownerName, region: current.region, country: current.country, website: current.website, description: current.description, published: current.published ? "true" : "" } : { country: "Česko" }}
      fields={[
        { name: "name", label: "Název", required: true },
        { name: "slug", label: "Adresa" },
        { name: "ownerName", label: "Držitel" },
        { name: "region", label: "Město / region" },
        { name: "country", label: "Země" },
        { name: "website", label: "Web" },
        { name: "description", label: "Popis", type: "textarea" },
        { name: "published", label: "Zveřejnit", type: "checkbox" },
      ]}
    />
  );
}
