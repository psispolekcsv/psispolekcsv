import type { Metadata } from "next";
import { CmsScreen } from "@/components/content/cms-screen";

export const metadata: Metadata = { title: "Poradna" };

export default function Page() {
  return (
    <CmsScreen
      slug="poradna"
      crumbs={[{ label: "Poradna" }]}
    />
  );
}
