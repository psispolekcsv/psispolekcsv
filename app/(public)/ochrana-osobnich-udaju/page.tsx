import type { Metadata } from "next";
import { CmsScreen } from "@/components/content/cms-screen";

export const metadata: Metadata = { title: "Ochrana osobních údajů" };

export default function Page() {
  return (
    <CmsScreen
      slug="ochrana-osobnich-udaju"
      crumbs={[{ label: "Ochrana osobních údajů" }]}
    />
  );
}
