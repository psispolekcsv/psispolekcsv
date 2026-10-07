import { AdminShell } from "@/components/admin/shell";
import { requireAdmin } from "@/lib/server/session";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  return <AdminShell user={user}>{children}</AdminShell>;
}
