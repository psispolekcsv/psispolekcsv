import type { Metadata } from "next";
import { CmsScreen } from "@/components/content/cms-screen";

export const metadata: Metadata = { title: "Členství" };

export default function Page() {
  return (
    <CmsScreen
      slug="klub-clenstvi"
      crumbs={[{ label: "Klub" }, { label: "Členství" }]}
    />
  );
}
