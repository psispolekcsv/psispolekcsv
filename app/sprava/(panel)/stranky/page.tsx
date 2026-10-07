import { ResourceScreen } from "@/components/admin/resource-screen";
import { defaultPages } from "@/lib/content/defaults";
import { textParam } from "@/lib/filters";
import { listPagesAdmin } from "@/lib/server/data";

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const id = textParam((await searchParams).id);
  const stored = await listPagesAdmin();
  const fallback = Object.values(defaultPages).map((page) => ({ id: page.slug, title: page.title, meta: "výchozí text" }));
  const items = [...stored.map((page) => ({ id: page.slug, title: page.title, meta: page.published ? "vlastní text" : "skryto" })), ...fallback.filter((page) => !stored.some((item) => item.slug === page.id))];
  const currentStored = stored.find((page) => page.slug === id);
  const currentDefault = defaultPages[id];
  const current = currentStored || (currentDefault ? { ...currentDefault, published: true, updatedAt: "" } : null);
  return (
    <ResourceScreen
      title="Stránky"
      kind="page"
      collection="pages"
      editId={id || undefined}
      intro="Úprava přepíše výchozí text. Nechte stránku zveřejněnou, jinak se znovu ukáže výchozí znění."
      items={items}
      defaults={current ? { slug: current.slug, title: current.title, description: current.description, content: current.content, published: current.published ? "true" : "" } : { published: "true" }}
      fields={[
        { name: "slug", label: "Adresa", required: true, help: "Například plemeno-historie." },
        { name: "title", label: "Název", required: true },
        { name: "description", label: "Perex", type: "textarea" },
        { name: "content", label: "Text v Markdownu", type: "textarea" },
        { name: "published", label: "Zveřejnit", type: "checkbox" },
      ]}
    />
  );
}
