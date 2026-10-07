import type { Metadata } from "next";
import { AuthFrame } from "@/components/admin/auth-frame";
import { ResetForm } from "@/components/admin/auth-panel";

export const metadata: Metadata = { title: "Obnova hesla", robots: { index: false, follow: false } };

export default function Page() {
  return (
    <AuthFrame title="Zapomenuté heslo">
      <ResetForm />
    </AuthFrame>
  );
}
