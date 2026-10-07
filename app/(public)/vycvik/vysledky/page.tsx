import type { Metadata } from "next";
import { EmptyState } from "@/components/content/empty-state";
import { PageShell } from "@/components/layout/page-shell";
import { listDogs, listEvents } from "@/lib/server/data";

export const metadata: Metadata = { title: "Výsledky výcviku" };

export default async function Page() {
  const events = (await listEvents()).filter((event) => event.published && event.category === "competition" && event.results);
  const dogs = (await listDogs()).filter((dog) => dog.published && dog.exams.length > 0);
  return (
    <PageShell title="Výsledky" lead="Závody a zkoušky zapsané správou klubu." crumbs={[{ label: "Výcvik" }, { label: "Výsledky" }]}>
      {events.length === 0 && dogs.length === 0 ? (
        <EmptyState title="Zatím bez výsledků" text="Až klub zapíše zkoušku ke psu nebo výsledek závodu, objeví se tady. Žebříček bez podkladů nezveřejňujeme." />
      ) : (
        <ul className="space-y-3">
          {dogs.map((dog) => (
            <li key={dog.id} className="rounded-lg bg-white px-4 py-3 text-sm">
              <span className="font-semibold">{dog.name}</span> · {dog.exams.join(", ")}
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
