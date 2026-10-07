import type { Metadata } from "next";
import { CmsScreen } from "@/components/content/cms-screen";

export const metadata: Metadata = { title: "Výbor a kontakty" };

export default function Page() {
  return (
    <CmsScreen
      slug="klub-vybor"
      crumbs={[{ label: "Klub" }, { label: "Výbor a kontakty" }]}
    />
  );
}
