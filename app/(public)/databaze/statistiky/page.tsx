import type { Metadata } from "next";
import { PageShell } from "@/components/layout/page-shell";
import { listDogs, listHealth, listKennels, listLitters } from "@/lib/server/data";

export const metadata: Metadata = { title: "Statistiky" };

export default async function Page() {
  const [dogs, kennels, litters, health] = await Promise.all([listDogs(), listKennels(), listLitters(), listHealth()]);
  const publishedDogs = dogs.filter((dog) => dog.published);
  const cards = [
    ["Zveřejnění psi a feny", publishedDogs.length],
    ["Z toho chovní", publishedDogs.filter((dog) => dog.breedingStatus === "breeding").length],
    ["Stanice", kennels.filter((item) => item.published).length],
    ["Vrhy", litters.filter((item) => item.published).length],
    ["Vyšetření", health.filter((item) => item.published).length],
    ["Se zkouškou", publishedDogs.filter((dog) => dog.exams.length > 0).length],
  ];
  return (
    <PageShell title="Statistiky" lead="Součty jen z veřejné databáze. Nejde o plemennou knihu celé populace." crumbs={[{ label: "Databáze" }, { label: "Statistiky" }]}>
      <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(([label, value]) => (
          <div key={String(label)} className="rounded-lg bg-white px-4 py-5">
            <dt className="text-sm text-ink/70">{label}</dt>
            <dd className="mt-2 font-serif text-4xl">{value}</dd>
          </div>
        ))}
      </dl>
    </PageShell>
  );
}
