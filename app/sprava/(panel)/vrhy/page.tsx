import { ResourceScreen } from "@/components/admin/resource-screen";
import { textParam } from "@/lib/filters";
import { litterStatusLabel, puppyLabel } from "@/lib/labels";
import { listLitters } from "@/lib/server/data";

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const id = textParam((await searchParams).id);
  const items = await listLitters();
  const current = items.find((item) => item.id === id);
  return (
    <ResourceScreen
      title="Vrhy"
      kind="litter"
      collection="litters"
      editId={current?.id}
      items={items.map((item) => ({ id: item.id, title: `${item.damName} × ${item.sireName}`, meta: litterStatusLabel[item.status] }))}
      defaults={current ? { matingDate: current.matingDate.slice(0, 10), birthDate: current.birthDate.slice(0, 10), damName: current.damName, sireName: current.sireName, kennelName: current.kennelName, breederName: current.breederName, city: current.city, region: current.region, malesBorn: current.malesBorn?.toString() || "", femalesBorn: current.femalesBorn?.toString() || "", status: current.status, puppyAvailability: current.puppyAvailability, note: current.note, published: current.published ? "true" : "" } : { status: "planned", puppyAvailability: "none" }}
      fields={[
        { name: "damName", label: "Matka", required: true },
        { name: "sireName", label: "Otec", required: true },
        { name: "matingDate", label: "Datum krytí", type: "date" },
        { name: "birthDate", label: "Datum narození", type: "date" },
        { name: "kennelName", label: "Stanice" },
        { name: "breederName", label: "Chovatel" },
        { name: "city", label: "Město" },
        { name: "region", label: "Region" },
        { name: "malesBorn", label: "Narození psi", type: "number" },
        { name: "femalesBorn", label: "Narozené feny", type: "number" },
        { name: "status", label: "Stav", type: "select", options: Object.entries(litterStatusLabel).map(([value, label]) => ({ value, label })) },
        { name: "puppyAvailability", label: "Štěňata", type: "select", options: Object.entries(puppyLabel).map(([value, label]) => ({ value, label })) },
        { name: "note", label: "Poznámka", type: "textarea" },
        { name: "published", label: "Zveřejnit", type: "checkbox" },
      ]}
    />
  );
}
