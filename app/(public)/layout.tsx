import { AdvisorMascot } from "@/components/mascot/advisor-mascot";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { getSettings } from "@/lib/server/data";

export const dynamic = "force-dynamic";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <>
      <Header />
      <main id="obsah">{children}</main>
      <Footer settings={settings} />
      <AdvisorMascot />
    </>
  );
}
