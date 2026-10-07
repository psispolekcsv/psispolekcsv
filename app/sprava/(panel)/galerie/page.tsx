import { ResourceScreen } from "@/components/admin/resource-screen";
import { textParam } from "@/lib/filters";
import { listGallery } from "@/lib/server/data";

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const id = textParam((await searchParams).id);
  const items = await listGallery();
  const current = items.find((item) => item.id === id);
  return (
    <ResourceScreen
      title="Galerie"
      kind="gallery"
      collection="gallery"
      editId={current?.id}
      fileName="image"
      intro="Jen fotografie psů klubu. Každý snímek potřebuje popisek."
      items={items.map((item) => ({ id: item.id, title: item.title, meta: item.published ? "zveřejněno" : "skryto" }))}
      defaults={current ? { title: current.title, alt: current.alt, published: current.published ? "true" : "" } : {}}
      fields={[
        { name: "title", label: "Název", required: true },
        { name: "alt", label: "Popis pro nevidomé", required: true },
        { name: "published", label: "Zveřejnit", type: "checkbox" },
      ]}
    />
  );
}
