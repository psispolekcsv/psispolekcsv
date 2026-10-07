import type { Metadata } from "next";
import { LitterCards } from "@/components/data/collections";
import { PageShell } from "@/components/layout/page-shell";
import { listLitters } from "@/lib/server/data";

export const metadata: Metadata = { title: "Nakryté feny" };

export default async function Page() {
  const litters = (await listLitters()).filter((item) => item.published && (item.status === "mated" || item.status === "planned"));
  return (
    <PageShell title="Nakryté feny" lead="Plánovaná a uskutečněná krytí z evidence klubu." crumbs={[{ label: "Chov" }, { label: "Nakryté feny" }]}>
      <LitterCards litters={litters} />
    </PageShell>
  );
}
