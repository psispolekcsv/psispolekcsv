import type { Metadata } from "next";
import { CmsScreen } from "@/components/content/cms-screen";

export const metadata: Metadata = { title: "Jak uchovnit" };

export default function Page() {
  return (
    <CmsScreen
      slug="chov-jak-uchovnit"
      crumbs={[{ label: "Chov" }, { label: "Jak uchovnit" }]}
    />
  );
}
