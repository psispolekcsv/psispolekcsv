import type { Metadata } from "next";
import { AuthFrame } from "@/components/admin/auth-frame";
import { RegisterForm } from "@/components/admin/auth-panel";

export const metadata: Metadata = { title: "Registrace do správy", robots: { index: false, follow: false } };

export default function Page() {
  return (
    <AuthFrame title="Nový účet">
      <p className="mb-4 text-sm text-ink/70">Účet sám o sobě správu neotevře. Musí ho schválit hlavní administrátor.</p>
      <RegisterForm />
    </AuthFrame>
  );
}
