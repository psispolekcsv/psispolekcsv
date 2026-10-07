import type { Metadata } from "next";
import { CmsScreen } from "@/components/content/cms-screen";

export const metadata: Metadata = { title: "O klubu" };

export default function Page() {
  return (
    <CmsScreen
      slug="klub-o-klubu"
      crumbs={[{ label: "Klub" }, { label: "O klubu" }]}
    />
  );
}
