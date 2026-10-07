"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { adminNav } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import type { UserProfile } from "@/types/domain";

export function AdminShell({ user, children }: { user: UserProfile; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const items = adminNav.filter((item) => !item.superadmin || user.role === "superadmin");

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/sprava/prihlaseni");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-paper md:grid md:grid-cols-[240px_1fr]">
      <aside className={cn("border-r border-line bg-ink-deep text-white md:sticky md:top-0 md:h-screen md:overflow-y-auto", open ? "block" : "hidden md:block")}>
        <div className="px-4 py-5">
          <p className="font-serif text-xl leading-tight">Správa</p>
          <p className="mt-1 text-xs text-white/60">{user.email}</p>
        </div>
        <nav aria-label="Správa" className="px-2 pb-8">
          {items.map((item) => {
            const active = item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn("mb-1 flex items-center rounded-md px-3 py-2 text-sm", active ? "bg-white text-ink" : "text-white/80 hover:bg-white/10")}
              >
                {active ? <span className="mr-2 h-2 w-2 rounded-full bg-amber" /> : <span className="mr-2 h-2 w-2" />}
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div>
        <div className="flex items-center justify-between border-b border-line bg-white px-4 py-3">
          <button type="button" className="rounded-md border border-line px-3 py-2 text-sm md:hidden" onClick={() => setOpen((value) => !value)}>
            Menu správy
          </button>
          <p className="hidden text-sm text-ink/70 md:block">{user.role === "superadmin" ? "Hlavní administrátor" : "Administrátor"}</p>
          <button type="button" onClick={logout} className="text-sm font-semibold">
            Odhlásit
          </button>
        </div>
        <div className="px-4 py-6 md:px-8">{children}</div>
      </div>
    </div>
  );
}
