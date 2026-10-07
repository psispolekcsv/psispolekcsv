import type { Metadata } from "next";
import { LitterCards } from "@/components/data/collections";
import { PageShell } from "@/components/layout/page-shell";
import { listLitters } from "@/lib/server/data";

export const metadata: Metadata = { title: "Aktuální štěňata" };

export default async function Page() {
  const litters = (await listLitters()).filter((item) => item.published && item.puppyAvailability === "available");
  return (
    <PageShell title="Aktuální štěňata" lead="Jen vrhy, u kterých správa označila štěňata jako dostupná." crumbs={[{ label: "Chov" }, { label: "Štěňata" }]}>
      <LitterCards litters={litters} />
    </PageShell>
  );
}
