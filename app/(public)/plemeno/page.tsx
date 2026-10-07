import type { Metadata } from "next";
import { CmsScreen } from "@/components/content/cms-screen";

export const metadata: Metadata = { title: "O československém vlčákovi" };

export default function Page() {
  return (
    <CmsScreen
      slug="plemeno"
      crumbs={[{ label: "Plemeno" }, { label: "O československém vlčákovi" }]}
    />
  );
}
