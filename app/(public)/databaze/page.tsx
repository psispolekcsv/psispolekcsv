import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";

export const metadata: Metadata = { title: "Databáze" };

const links = [
  ["/databaze/psi", "Psi"],
  ["/databaze/feny", "Feny"],
  ["/databaze/stanice", "Chovatelské stanice"],
  ["/databaze/vrhy", "Vrhy"],
  ["/databaze/zdravi", "Zdraví"],
  ["/databaze/statistiky", "Statistiky"],
];

export default function Page() {
  return (
    <PageShell title="Databáze" lead="Veřejná část evidence. Osobní údaje majitelů tu nejsou." crumbs={[{ label: "Databáze" }]}>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {links.map(([href, label]) => (
          <li key={href}>
            <Link href={href} className="block rounded-lg border border-line bg-white px-4 py-6 font-serif text-2xl hover:border-ink">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
