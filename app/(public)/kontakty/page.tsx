import type { Metadata } from "next";
import { PageShell } from "@/components/layout/page-shell";
import { getSettings } from "@/lib/server/data";

export const metadata: Metadata = { title: "Kontakty" };

export default async function Page() {
  const settings = await getSettings();
  const rows = [
    ["E-mail", settings.email],
    ["Telefon", settings.phone],
    ["Adresa", settings.address],
    ["IČO", settings.ico],
    ["Účet", settings.bankAccount],
    ["IBAN", settings.iban],
  ].filter(([, value]) => value);
  return (
    <PageShell title="Kontakty" lead="Spojení na klub. Údaje doplňuje správa, nepřebírají se odjinud." crumbs={[{ label: "Kontakty" }]}>
      {rows.length === 0 ? (
        <p className="max-w-xl">Kontaktní údaje zatím nejsou vyplněné. Jakmile je výbor zapíše ve správě, objeví se zde i v patičce.</p>
      ) : (
        <dl className="grid max-w-xl gap-3">
          {rows.map(([label, value]) => (
            <div key={label} className="rounded-lg bg-white px-4 py-3">
              <dt className="text-xs uppercase tracking-wide text-ink/50">{label}</dt>
              <dd className="mt-1 font-semibold">{label === "E-mail" ? <a href={`mailto:${value}`}>{value}</a> : value}</dd>
            </div>
          ))}
        </dl>
      )}
    </PageShell>
  );
}
