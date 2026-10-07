import { ResourceScreen } from "@/components/admin/resource-screen";
import { textParam } from "@/lib/filters";
import { eventCategoryLabel } from "@/lib/labels";
import { listEvents } from "@/lib/server/data";

const categories = Object.entries(eventCategoryLabel).map(([value, label]) => ({ value, label }));

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const id = textParam((await searchParams).id);
  const items = await listEvents();
  const current = items.find((item) => item.id === id);
  return (
    <ResourceScreen
      title="Akce"
      kind="event"
      collection="events"
      editId={current?.id}
      items={items.map((item) => ({ id: item.id, title: item.title, meta: item.published ? eventCategoryLabel[item.category] : "skryto" }))}
      defaults={
        current
          ? {
              title: current.title,
              slug: current.slug,
              category: current.category,
              description: current.description,
              location: current.location,
              address: current.address,
              startDate: current.startDate.slice(0, 10),
              endDate: current.endDate.slice(0, 10),
              registrationDeadline: current.registrationDeadline.slice(0, 10),
              registrationFormId: current.registrationFormId,
              capacity: current.capacity ? String(current.capacity) : "",
              organizer: current.organizer,
              results: current.results,
              registrationEnabled: current.registrationEnabled ? "true" : "",
              published: current.published ? "true" : "",
            }
          : { category: "show" }
      }
      fields={[
        { name: "title", label: "Název", required: true },
        { name: "slug", label: "Adresa" },
        { name: "category", label: "Kategorie", type: "select", options: categories },
        { name: "startDate", label: "Začátek", type: "date", required: true },
        { name: "endDate", label: "Konec", type: "date" },
        { name: "location", label: "Místo" },
        { name: "address", label: "Adresa místa" },
        { name: "organizer", label: "Pořadatel" },
        { name: "description", label: "Popis", type: "textarea" },
        { name: "results", label: "Výsledky", type: "textarea" },
        { name: "registrationDeadline", label: "Uzávěrka", type: "date" },
        { name: "registrationFormId", label: "Slug formuláře" },
        { name: "capacity", label: "Kapacita", type: "number" },
        { name: "registrationEnabled", label: "Přihlašování otevřené", type: "checkbox" },
        { name: "published", label: "Zveřejnit", type: "checkbox" },
      ]}
    />
  );
}
