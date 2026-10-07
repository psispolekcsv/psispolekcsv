import type { Metadata } from "next";
import { CmsScreen } from "@/components/content/cms-screen";

export const metadata: Metadata = { title: "Sportovní disciplíny" };

export default function Page() {
  return (
    <CmsScreen
      slug="vycvik-discipliny"
      crumbs={[{ label: "Výcvik" }, { label: "Sportovní disciplíny" }]}
    />
  );
}
