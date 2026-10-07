import type { Metadata } from "next";
import { CmsScreen } from "@/components/content/cms-screen";

export const metadata: Metadata = { title: "Pro budoucí majitele" };

export default function Page() {
  return (
    <CmsScreen
      slug="poradna-budouci-majitele"
      crumbs={[{ label: "Poradna" }, { label: "Pro budoucí majitele" }]}
    />
  );
}
