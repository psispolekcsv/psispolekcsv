import type { Metadata } from "next";
import { CmsScreen } from "@/components/content/cms-screen";

export const metadata: Metadata = { title: "Ceník a platby" };

export default function Page() {
  return (
    <CmsScreen
      slug="klub-cenik"
      crumbs={[{ label: "Klub" }, { label: "Ceník a platby" }]}
    />
  );
}
