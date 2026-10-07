import type { Metadata } from "next";
import { EventList } from "@/components/data/collections";
import { PageShell } from "@/components/layout/page-shell";
import { listEvents } from "@/lib/server/data";

export const metadata: Metadata = { title: "Klubové akce" };

export default async function EventsPage() {
  const events = (await listEvents()).filter((event) => event.published);
  return (
    <PageShell title="Klubové akce" lead="Výstavy, bonitace, svody, tábor, závody, schůze a semináře." crumbs={[{ label: "Akce" }]}>
      <EventList events={events} />
      <div className="mt-10">
        <h2 className="mb-4 font-serif text-3xl">Proběhlé akce</h2>
        <EventList events={events} archive />
      </div>
    </PageShell>
  );
}
