import Link from "next/link";
import { EmptyState } from "@/components/content/empty-state";
import { breedingLabel, eventCategoryLabel, lifeLabel, litterStatusLabel, puppyLabel, sexLabel } from "@/lib/labels";
import { formatDate, mediaUrl } from "@/lib/utils";
import type { ClubEvent, DogPublic, HealthResult, Kennel, Litter } from "@/types/domain";

export function DogTable({ dogs }: { dogs: DogPublic[] }) {
  if (dogs.length === 0) {
    return <EmptyState title="Databáze je prázdná" text="Chovní jedinci se tu objeví, až je správa klubu zveřejní. Nejde o ukázkové psy." />;
  }
  return (
    <div className="overflow-x-auto rounded-lg border border-line bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-line bg-mist/60 text-xs uppercase tracking-wide text-ink/70">
          <tr>
            <th className="px-3 py-3 font-semibold">Jméno</th>
            <th className="px-3 py-3 font-semibold">Pohlaví</th>
            <th className="px-3 py-3 font-semibold">Narození</th>
            <th className="px-3 py-3 font-semibold">Stanice</th>
            <th className="px-3 py-3 font-semibold">Chovnost</th>
            <th className="px-3 py-3 font-semibold">Stav</th>
          </tr>
        </thead>
        <tbody>
          {dogs.map((dog) => (
            <tr key={dog.id} className="border-b border-line last:border-0">
              <td className="px-3 py-3 font-semibold">
                <Link href={`/databaze/psi/${dog.id}`} className="underline decoration-amber decoration-2 underline-offset-4">
                  {dog.name}
                </Link>
              </td>
              <td className="px-3 py-3">{sexLabel[dog.sex]}</td>
              <td className="px-3 py-3">{formatDate(dog.birthDate)}</td>
              <td className="px-3 py-3">{dog.kennelName}</td>
              <td className="px-3 py-3">{breedingLabel[dog.breedingStatus]}</td>
              <td className="px-3 py-3">{lifeLabel[dog.lifeStatus]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DogFilters({ values }: { values: { q?: string; sex?: string; breeding?: string; year?: string } }) {
  return (
    <form className="mb-6 grid gap-3 rounded-lg border border-line bg-white p-4 sm:grid-cols-4" method="get">
      <label className="text-sm font-semibold">
        Hledat
        <input name="q" defaultValue={values.q || ""} className="mt-1 w-full rounded-md border border-line px-3 py-2 font-normal" />
      </label>
      <label className="text-sm font-semibold">
        Pohlaví
        <select name="sex" defaultValue={values.sex || ""} className="mt-1 w-full rounded-md border border-line px-3 py-2 font-normal">
          <option value="">Všechna</option>
          <option value="male">Psi</option>
          <option value="female">Feny</option>
        </select>
      </label>
      <label className="text-sm font-semibold">
        Chovnost
        <select name="breeding" defaultValue={values.breeding || ""} className="mt-1 w-full rounded-md border border-line px-3 py-2 font-normal">
          <option value="">Vše</option>
          <option value="breeding">Chovní</option>
          <option value="pending">V řízení</option>
          <option value="not_breeding">Nechovní</option>
        </select>
      </label>
      <label className="text-sm font-semibold">
        Rok narození
        <input name="year" inputMode="numeric" defaultValue={values.year || ""} className="mt-1 w-full rounded-md border border-line px-3 py-2 font-normal" />
      </label>
      <button className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white sm:col-span-4 sm:w-fit" type="submit">
        Filtrovat
      </button>
    </form>
  );
}

export function LitterCards({ litters }: { litters: Litter[] }) {
  if (litters.length === 0) {
    return <EmptyState title="Žádný zveřejněný vrh" text="Nakryté feny, narozené vrhy a nabídka štěňat se vypisují jen z databáze klubu." />;
  }
  return (
    <ul className="grid gap-3 md:grid-cols-2">
      {litters.map((litter) => (
        <li key={litter.id} className="rounded-lg border border-line bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-deep">{litterStatusLabel[litter.status]}</p>
          <h2 className="mt-1 font-serif text-2xl">{litter.damName || "Fena"} × {litter.sireName || "pes"}</h2>
          <p className="mt-2 text-sm text-ink/75">
            {litter.kennelName} {litter.city ? `· ${litter.city}` : ""} {litter.region ? `· ${litter.region}` : ""}
          </p>
          <p className="mt-2 text-sm">Krytí {formatDate(litter.matingDate) || "neuvedeno"} · narození {formatDate(litter.birthDate) || "neuvedeno"}</p>
          <p className="mt-1 text-sm">{puppyLabel[litter.puppyAvailability]}{litter.malesBorn !== null ? ` · psi ${litter.malesBorn}, feny ${litter.femalesBorn ?? 0}` : ""}</p>
          {litter.photoPath ? <img src={mediaUrl(litter.photoPath)} alt="" className="mt-3 h-40 w-full rounded-md object-cover" /> : null}
        </li>
      ))}
    </ul>
  );
}

export function KennelList({ kennels }: { kennels: Kennel[] }) {
  if (kennels.length === 0) {
    return <EmptyState title="Žádná stanice" text="Chovatelské stanice zveřejňuje správa klubu." />;
  }
  return (
    <ul className="grid gap-3 md:grid-cols-2">
      {kennels.map((kennel) => (
        <li key={kennel.id} className="rounded-lg border border-line bg-white p-4">
          <h2 className="font-serif text-2xl">{kennel.name}</h2>
          <p className="mt-1 text-sm text-ink/75">{[kennel.region, kennel.country].filter(Boolean).join(", ")}</p>
          {kennel.description ? <p className="mt-3 text-sm leading-relaxed">{kennel.description}</p> : null}
          {kennel.website ? (
            <a href={kennel.website} className="mt-3 inline-block text-sm font-semibold text-amber-deep" target="_blank" rel="noopener noreferrer">
              Web stanice
            </a>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export function HealthTable({ rows }: { rows: HealthResult[] }) {
  if (rows.length === 0) {
    return <EmptyState title="Bez zveřejněných vyšetření" text="Výsledky RTG a dalších vyšetření se zobrazí, až je klub uvolní. Skeny s osobními údaji sem samy nepřecházejí." />;
  }
  return (
    <div className="overflow-x-auto rounded-lg border border-line bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-mist/60 text-xs uppercase tracking-wide">
          <tr>
            <th className="px-3 py-3">Pes</th>
            <th className="px-3 py-3">Vyšetření</th>
            <th className="px-3 py-3">Výsledek</th>
            <th className="px-3 py-3">Datum</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-line">
              <td className="px-3 py-3 font-semibold">{row.dogName}</td>
              <td className="px-3 py-3">{row.type}</td>
              <td className="px-3 py-3">{row.result}</td>
              <td className="px-3 py-3">{formatDate(row.examinedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function EventList({ events, archive = false }: { events: ClubEvent[]; archive?: boolean }) {
  const today = new Date().toISOString().slice(0, 10);
  const visible = events.filter((event) => (archive ? event.startDate.slice(0, 10) < today : event.startDate.slice(0, 10) >= today));
  if (visible.length === 0) {
    return <EmptyState title={archive ? "Archiv je prázdný" : "Žádná zveřejněná akce"} text="Termíny doplňuje správa klubu. Nejsou tu cizí ani ukázkové akce." />;
  }
  return (
    <ul className="space-y-3">
      {visible.map((event) => (
        <li key={event.id}>
          <Link href={`/akce/${event.slug}`} className="block rounded-lg border border-line bg-white px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-deep">{eventCategoryLabel[event.category]}</p>
            <h2 className="mt-1 font-serif text-2xl">{event.title}</h2>
            <p className="mt-1 text-sm text-ink/75">{formatDate(event.startDate)}{event.endDate ? ` – ${formatDate(event.endDate)}` : ""}{event.location ? ` · ${event.location}` : ""}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
