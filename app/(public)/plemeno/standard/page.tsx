import type { Metadata } from "next";
import { CmsScreen } from "@/components/content/cms-screen";

export const metadata: Metadata = { title: "Standard FCI" };

export default function Page() {
  return (
    <CmsScreen
      slug="plemeno-standard"
      crumbs={[{ label: "Plemeno" }, { label: "Standard FCI" }]}
      extra={
        <p className="mb-6">
          <a className="inline-flex rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white" href="/dokumenty/fci-standard-332-en.pdf">
            Stáhnout standard FCI č. 332 (PDF)
          </a>
        </p>
      }
    />
  );
}
