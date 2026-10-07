import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthFrame } from "@/components/admin/auth-frame";
import { canAccessAdmin } from "@/lib/auth/permissions";
import { getCurrentUser } from "@/lib/server/session";

export const metadata: Metadata = { title: "Čeká na schválení", robots: { index: false, follow: false } };

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) redirect("/sprava/prihlaseni");
  if (canAccessAdmin(user)) redirect("/sprava");
  return (
    <AuthFrame title="Účet čeká">
      <p>Účet byl vytvořen. Přístup do správy musí nejprve schválit hlavní administrátor.</p>
      <p className="mt-4 text-sm text-ink/70">Přihlášení funguje, data klubu ani správa se vám zatím neotevřou.</p>
      <Link href="/" className="mt-6 inline-block text-sm font-semibold">Zpět na web</Link>
    </AuthFrame>
  );
}
