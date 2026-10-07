import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { seedFormTemplates } from "@/lib/forms/seed";
import { listTemplates } from "@/lib/server/data";

export const metadata: Metadata = { title: "Formuláře" };

export default async function Page() {
  const templates = (await listTemplates()).filter((item) => item.active);
  return (
    <PageShell title="Formuláře" lead="Přihlášky a žádosti. Kde jsou dvě strany, potvrzuje každá zvlášť odkazem z e-mailu." crumbs={[{ label: "Formuláře" }]}>
      {templates.length === 0 ? (
        <div className="max-w-2xl">
          <p>Veřejné formuláře se zapnou, až je správa vloží do databáze. Připravené vzory:</p>
          <ul className="mt-4 list-disc space-y-1 pl-5">
            {seedFormTemplates.map((item) => (
              <li key={item.slug}>{item.title}</li>
            ))}
          </ul>
        </div>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {templates.map((item) => (
            <li key={item.id}>
              <Link href={`/formulare/${item.slug}`} className="block h-full rounded-lg border border-line bg-white p-4 hover:border-ink">
                <h2 className="font-serif text-2xl">{item.title}</h2>
                <p className="mt-2 text-sm text-ink/75">{item.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
