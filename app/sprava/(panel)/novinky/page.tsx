import { ResourceScreen } from "@/components/admin/resource-screen";
import { textParam } from "@/lib/filters";
import { listNews } from "@/lib/server/data";

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const id = textParam((await searchParams).id);
  const items = await listNews(false);
  const current = items.find((item) => item.id === id);
  return (
    <ResourceScreen
      title="Novinky"
      kind="news"
      collection="news"
      editId={current?.id}
      fileName="cover"
      intro="Text novinky je Markdown. Zveřejnění zaškrtněte až po kontrole."
      items={items.map((item) => ({ id: item.id, title: item.title, meta: item.published ? "zveřejněno" : "koncept" }))}
      defaults={current ? { title: current.title, slug: current.slug, excerpt: current.excerpt, content: current.content, category: current.category, author: current.author, publishedAt: current.publishedAt.slice(0, 10), pinned: current.pinned ? "true" : "", published: current.published ? "true" : "" } : {}}
      fields={[
        { name: "title", label: "Název", required: true },
        { name: "slug", label: "Adresa", help: "Nechte prázdné pro automatickou adresu." },
        { name: "excerpt", label: "Perex", type: "textarea" },
        { name: "content", label: "Text", type: "textarea" },
        { name: "category", label: "Rubrika" },
        { name: "author", label: "Autor" },
        { name: "publishedAt", label: "Datum", type: "date" },
        { name: "pinned", label: "Připnout na úvod", type: "checkbox" },
        { name: "published", label: "Zveřejnit", type: "checkbox" },
      ]}
    />
  );
}
