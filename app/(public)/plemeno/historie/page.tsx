import type { Metadata } from "next";
import { CmsScreen } from "@/components/content/cms-screen";

export const metadata: Metadata = { title: "Historie plemene" };

export default function Page() {
  return (
    <CmsScreen
      slug="plemeno-historie"
      crumbs={[{ label: "Plemeno" }, { label: "Historie plemene" }]}
    />
  );
}
