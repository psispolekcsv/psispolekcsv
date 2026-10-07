import type { Metadata } from "next";
import { CmsScreen } from "@/components/content/cms-screen";

export const metadata: Metadata = { title: "Informace pro chovatele" };

export default function Page() {
  return (
    <CmsScreen
      slug="chov-pro-chovatele"
      crumbs={[{ label: "Chov" }, { label: "Informace pro chovatele" }]}
    />
  );
}
