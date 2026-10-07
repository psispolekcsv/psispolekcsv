import type { Metadata } from "next";
import { AuthFrame } from "@/components/admin/auth-frame";
import { LoginForm } from "@/components/admin/auth-panel";

export const metadata: Metadata = { title: "Přihlášení do správy", robots: { index: false, follow: false } };

export default function Page() {
  return (
    <AuthFrame title="Přihlášení">
      <LoginForm />
    </AuthFrame>
  );
}
