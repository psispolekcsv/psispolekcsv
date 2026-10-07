import type { Metadata } from "next";
import { CmsScreen } from "@/components/content/cms-screen";

export const metadata: Metadata = { title: "Péče a soužití" };

export default function Page() {
  return (
    <CmsScreen
      slug="plemeno-pece"
      crumbs={[{ label: "Plemeno" }, { label: "Péče a soužití" }]}
    />
  );
}
