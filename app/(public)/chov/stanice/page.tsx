import type { Metadata } from "next";
import { KennelList } from "@/components/data/collections";
import { PageShell } from "@/components/layout/page-shell";
import { listKennels } from "@/lib/server/data";

export const metadata: Metadata = { title: "Chovatelské stanice" };

export default async function Page() {
  const kennels = (await listKennels()).filter((item) => item.published);
  return (
    <PageShell title="Chovatelské stanice" crumbs={[{ label: "Chov" }, { label: "Stanice" }]}>
      <KennelList kennels={kennels} />
    </PageShell>
  );
}
