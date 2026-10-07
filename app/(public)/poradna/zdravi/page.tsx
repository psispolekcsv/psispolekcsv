import type { Metadata } from "next";
import { CmsScreen } from "@/components/content/cms-screen";

export const metadata: Metadata = { title: "Zdraví" };

export default function Page() {
  return (
    <CmsScreen
      slug="poradna-zdravi"
      crumbs={[{ label: "Poradna" }, { label: "Zdraví" }]}
    />
  );
}
