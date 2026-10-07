import type { Metadata } from "next";
import { CmsScreen } from "@/components/content/cms-screen";

export const metadata: Metadata = { title: "Povaha a využití" };

export default function Page() {
  return (
    <CmsScreen
      slug="plemeno-povaha"
      crumbs={[{ label: "Plemeno" }, { label: "Povaha a využití" }]}
    />
  );
}
