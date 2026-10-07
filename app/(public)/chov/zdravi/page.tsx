import type { Metadata } from "next";
import { HealthTable } from "@/components/data/collections";
import { PageShell } from "@/components/layout/page-shell";
import { listHealth } from "@/lib/server/data";

export const metadata: Metadata = { title: "Zdraví a vyšetření" };

export default async function Page() {
  const rows = (await listHealth()).filter((item) => item.published);
  return (
    <PageShell title="Zdraví a vyšetření" lead="RTG a další výsledky, které klub označil ke zveřejnění." crumbs={[{ label: "Chov" }, { label: "Zdraví" }]}>
      <HealthTable rows={rows} />
    </PageShell>
  );
}
