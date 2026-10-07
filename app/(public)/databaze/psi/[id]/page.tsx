import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { breedingLabel, lifeLabel, sexLabel } from "@/lib/labels";
import { getDog, listHealth } from "@/lib/server/data";
import { formatDate, mediaUrl } from "@/lib/utils";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const dog = await getDog(id);
  return { title: dog?.name || "Pes", description: dog ? `${sexLabel[dog.sex]}, ${dog.kennelName}` : undefined };
}

export default async function DogPage({ params }: Props) {
  const { id } = await params;
  const dog = await getDog(id);
  if (!dog) notFound();
  const health = (await listHealth()).filter((item) => item.published && item.dogId === dog.id);
  return (
    <PageShell title={dog.name} lead={`${sexLabel[dog.sex]} · ${breedingLabel[dog.breedingStatus]}`} crumbs={[{ href: "/databaze", label: "Databáze" }, { label: dog.name }]}>
      <div className="grid gap-8 md:grid-cols-[280px_1fr]">
        <div className="overflow-hidden rounded-lg border border-line bg-white">
          {dog.photoPath ? (
            <img src={mediaUrl(dog.photoPath)} alt={dog.name} className="aspect-square w-full object-cover" />
          ) : (
            <div className="flex aspect-square items-end bg-mist p-4 text-sm text-ink/70">Fotografie zatím není vložená.</div>
          )}
        </div>
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          {[
            ["Datum narození", formatDate(dog.birthDate)],
            ["Číslo zápisu", dog.registrationNumber],
            ["Čip", dog.publishChip ? dog.chip : ""],
            ["Stanice", dog.kennelName],
            ["Otec", dog.sireName],
            ["Matka", dog.damName],
            ["Chovatel", dog.breederName],
            ["Země", dog.country],
            ["Bonitace", dog.bonitation],
            ["Tituly", dog.titles.join(", ")],
            ["Zkoušky", dog.exams.join(", ")],
            ["Stav", lifeLabel[dog.lifeStatus]],
          ]
            .filter(([, value]) => value)
            .map(([label, value]) => (
              <div key={label} className="rounded-md bg-white px-3 py-3">
                <dt className="text-xs uppercase tracking-wide text-ink/50">{label}</dt>
                <dd className="mt-1 font-semibold">{value}</dd>
              </div>
            ))}
        </dl>
      </div>
      {dog.healthSummary ? <p className="mt-6 max-w-2xl">{dog.healthSummary}</p> : null}
      {health.length > 0 ? (
        <section className="mt-8">
          <h2 className="font-serif text-2xl">Zveřejněná vyšetření</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {health.map((item) => (
              <li key={item.id}>{formatDate(item.examinedAt)} · {item.type}: {item.result}</li>
            ))}
          </ul>
        </section>
      ) : null}
      <p className="mt-8 text-sm">
        <Link href="/databaze/psi" className="font-semibold text-amber-deep">Zpět na databázi</Link>
      </p>
    </PageShell>
  );
}
