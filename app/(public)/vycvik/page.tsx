import type { Metadata } from "next";
import { CmsScreen } from "@/components/content/cms-screen";

export const metadata: Metadata = { title: "Výcvik a sport" };

export default function Page() {
  return (
    <CmsScreen
      slug="vycvik"
      crumbs={[{ label: "Výcvik" }, { label: "Výcvik a sport" }]}
    />
  );
}
