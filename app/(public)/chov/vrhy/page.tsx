import type { Metadata } from "next";
import { LitterCards } from "@/components/data/collections";
import { PageShell } from "@/components/layout/page-shell";
import { listLitters } from "@/lib/server/data";

export const metadata: Metadata = { title: "Přehled vrhů" };

export default async function Page() {
  const litters = (await listLitters()).filter((item) => item.published);
  return (
    <PageShell title="Přehled vrhů" lead="Všechny vrhy, které klub zveřejnil." crumbs={[{ label: "Chov" }, { label: "Vrhy" }]}>
      <LitterCards litters={litters} />
    </PageShell>
  );
}
