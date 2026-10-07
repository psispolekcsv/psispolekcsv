import type { Metadata } from "next";
import { CmsScreen } from "@/components/content/cms-screen";

export const metadata: Metadata = { title: "Veterinární informace" };

export default function Page() {
  return (
    <CmsScreen
      slug="poradna-veterina"
      crumbs={[{ label: "Poradna" }, { label: "Veterinární informace" }]}
    />
  );
}
