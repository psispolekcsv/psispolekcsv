import type { Metadata } from "next";
import { CmsScreen } from "@/components/content/cms-screen";

export const metadata: Metadata = { title: "Pro chovatele" };

export default function Page() {
  return (
    <CmsScreen
      slug="poradna-chovatele"
      crumbs={[{ label: "Poradna" }, { label: "Pro chovatele" }]}
    />
  );
}
