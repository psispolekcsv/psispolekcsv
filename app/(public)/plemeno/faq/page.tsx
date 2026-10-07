import type { Metadata } from "next";
import { CmsScreen } from "@/components/content/cms-screen";

export const metadata: Metadata = { title: "Časté dotazy" };

export default function Page() {
  return (
    <CmsScreen
      slug="plemeno-faq"
      crumbs={[{ label: "Plemeno" }, { label: "Časté dotazy" }]}
    />
  );
}
