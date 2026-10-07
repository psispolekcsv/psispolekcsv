import Image from "next/image";
import Link from "next/link";
import { assets } from "@/lib/assets";
import { PuppyThoughts } from "@/components/mascot/puppy-thoughts";
import { WolfMascot } from "@/components/mascot/wolf-mascot";
import { DynamicForm } from "@/components/forms/dynamic-form";
import { EmptyState } from "@/components/content/empty-state";
import { eventCategoryLabel } from "@/lib/labels";
import { formatDate } from "@/lib/utils";
import type { ClubEvent, FormTemplate, Kennel, Litter, NewsArticle, Partner, SiteSettings } from "@/types/domain";

const facts = [
  ["FCI", "standard č. 332"],
  ["Původ", "bývalé Československo"],
  ["Patronát", "Slovenská republika"],
  ["Uznání", "národní plemeno 1982"],
  ["Skupina", "1, pracovní pes"],
];

export function HomeView({
  settings,
  news,
  events,
  litters,
  kennels,
  partners,
  breedingMales,
  breedingFemales,
  membership,
}: {
  settings: SiteSettings;
  news: NewsArticle[];
  events: ClubEvent[];
  litters: Litter[];
  kennels: Kennel[];
  partners: Partner[];
  breedingMales: number;
  breedingFemales: number;
  membership: FormTemplate | null;
}) {
  const puppies = litters.filter((item) => item.puppyAvailability === "available");
  const mated = litters.filter((item) => item.status === "mated");
  const upcoming = events.filter((item) => item.startDate.slice(0, 10) >= new Date().toISOString().slice(0, 10)).slice(0, 4);

  return (
    <>
      <section className="border-b border-line bg-white">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 md:grid-cols-[1.15fr_0.85fr] md:py-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-deep">Plemeno FCI č. 332</p>
            <h1 className="mt-3 font-serif text-5xl leading-[1.05] text-ink-deep md:text-6xl">{settings.heroTitle}</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink/80">{settings.heroLead}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/plemeno" className="rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-white">O plemeni</Link>
              <Link href="/akce" className="rounded-md border border-ink px-4 py-2.5 text-sm font-semibold">Aktuální akce</Link>
              <Link href="/chov/stenata" className="rounded-md border border-line bg-paper px-4 py-2.5 text-sm font-semibold">Štěňata</Link>
            </div>
          </div>
          <div className="relative mx-auto h-[460px] w-full max-w-xl">
            <PuppyThoughts />
            <WolfMascot variant="puppy" priority className="relative z-10 mx-auto h-full w-[78%]" />
          </div>
        </div>
      </section>

      <section className="bg-ink text-white">
        <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-px bg-white/10 md:grid-cols-5">
          {facts.map(([label, value]) => (
            <div key={label} className="bg-ink px-4 py-5">
              <dt className="text-xs uppercase tracking-[0.16em] text-amber">{label}</dt>
              <dd className="mt-2 font-serif text-xl">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="mb-5 flex items-end justify-between gap-4">
            <h2 className="font-serif text-3xl text-ink-deep">Novinky</h2>
            <Link href="/novinky" className="text-sm font-semibold text-amber-deep">Archiv</Link>
          </div>
          {news.length === 0 ? (
            <EmptyState title="Zatím bez zpráv" text="Jakmile správa klubu publikuje novinku, objeví se zde. Nevymýšlíme události, které se nestaly." />
          ) : (
            <ul className="space-y-3">
              {news.slice(0, 5).map((item) => (
                <li key={item.id}>
                  <Link href={`/novinky/${item.slug}`} className="block rounded-lg border border-line bg-white px-4 py-4 hover:border-ink">
                    <p className="text-xs uppercase tracking-[0.14em] text-ink/60">{formatDate(item.publishedAt)}{item.category ? ` · ${item.category}` : ""}</p>
                    <h3 className="mt-1 font-serif text-2xl">{item.title}</h3>
                    <p className="mt-1 text-sm text-ink/75">{item.excerpt}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h2 className="mb-5 font-serif text-3xl text-ink-deep">Nejbližší akce</h2>
          {upcoming.length === 0 ? (
            <EmptyState title="Žádný zveřejněný termín" text="Výstavy, bonitace, svody a další akce se zobrazí, až je klub zapíše." />
          ) : (
            <ul className="space-y-3">
              {upcoming.map((event) => (
                <li key={event.id}>
                  <Link href={`/akce/${event.slug}`} className="block rounded-lg bg-white px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-deep">{eventCategoryLabel[event.category]}</p>
                    <h3 className="mt-1 font-serif text-xl">{event.title}</h3>
                    <p className="mt-1 text-sm text-ink/70">{formatDate(event.startDate)}{event.location ? ` · ${event.location}` : ""}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="bg-mist/70">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="font-serif text-3xl text-ink-deep">Chov</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {[
              ["/chov/stenata", "Aktuální štěňata", String(puppies.length)],
              ["/chov/nakryte-feny", "Nakryté feny", String(mated.length)],
              ["/chov/chovni-psi", "Chovní psi", String(breedingMales)],
              ["/chov/chovne-feny", "Chovné feny", String(breedingFemales)],
              ["/chov/stanice", "Stanice", String(kennels.length)],
            ].map(([href, label, count]) => (
              <Link key={href} href={href} className="rounded-lg bg-white px-4 py-5">
                <p className="font-serif text-3xl text-ink-deep">{count}</p>
                <p className="mt-1 text-sm font-semibold">{label}</p>
              </Link>
            ))}
          </div>
          <p className="mt-4 text-sm text-ink/70">Počty vycházejí jen ze záznamů, které správa zveřejnila. Nula znamená, že veřejná evidence je zatím prázdná.</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-14 md:grid-cols-[0.8fr_1.2fr]">
        <WolfMascot variant="allFours" className="mx-auto h-80 w-full max-w-sm" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-deep">O plemeni</p>
          <h2 className="mt-2 font-serif text-4xl text-ink-deep">Vlčí vzhled, pracovní povaha</h2>
          <p className="mt-4 text-lg leading-relaxed text-ink/80">{settings.breedIntro}</p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold">
            <Link href="/plemeno/historie" className="underline decoration-amber decoration-2 underline-offset-4">Historie</Link>
            <Link href="/plemeno/standard" className="underline decoration-amber decoration-2 underline-offset-4">Standard</Link>
            <a href={assets.fciStandard} className="underline decoration-amber decoration-2 underline-offset-4">PDF standardu FCI</a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-4">
        <h2 className="font-serif text-3xl text-ink-deep">Rychlé odkazy</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["/klub/clenstvi", "Členství", "Jak požádat o přijetí"],
            ["/formulare", "Formuláře", "Přihlášky a žádosti pro správu klubu"],
            ["/dokumenty", "Dokumenty", "Řády a stanovy ke stažení"],
            ["/poradna", "Poradna", "Pro majitele i chovatele"],
            ["/databaze", "Databáze", "Psi, feny, vrhy a zdraví"],
            ["/kontakty", "Kontakty", "Výbor a spojení na klub"],
          ].map(([href, title, text]) => (
            <Link key={href} href={href} className="rounded-lg border border-line bg-white px-4 py-4 hover:border-ink">
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-ink/70">{text}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#d8d3cc]">
        <div aria-hidden="true" className="pointer-events-none absolute -left-16 top-8 h-80 w-80 rounded-full bg-amber/35 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute right-[-4rem] bottom-0 h-[28rem] w-[36rem] rounded-full bg-white/80 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute left-1/3 top-1/3 h-72 w-72 rounded-full bg-ink/15 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-20">
          <div className="relative mx-auto max-w-3xl">
            <div className="pointer-events-none absolute left-0 top-0 z-20 h-48 w-40 -translate-x-[68%] -translate-y-2 md:h-[27rem] md:w-[23rem] md:-translate-x-[60%] md:-translate-y-6">
              <Image src={assets.mascotPeek} alt="" fill sizes="(min-width: 768px) 368px, 160px" className="object-contain object-right object-top" />
            </div>
            <div className="relative z-10 rounded-[1.6rem] border border-white/55 bg-white/15 p-6 pt-44 shadow-[0_30px_70px_-28px_rgba(24,24,24,0.5)] ring-1 ring-inset ring-white/60 backdrop-blur-lg md:p-10 md:pl-28">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-deep">Členství</p>
              <h2 className="mt-2 font-serif text-4xl text-ink-deep">Žádost o připojení do klubu</h2>
              <p className="mt-3 max-w-2xl text-ink/80">Vyplňte údaje a e-mail. Potvrzení přijde vám i správě klubu. Ve správě si žádost otevřou a mohou ji schválit, odpovědět, nechat bez reakce, nebo smazat.</p>
              <div className="mt-6 [&_form]:max-w-none">
                {membership ? <DynamicForm template={membership} dogs={[]} /> : <p className="text-sm text-ink/70">Formulář se zobrazí, až bude připojená databáze klubu.</p>}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="font-serif text-3xl text-ink-deep">Partneři</h2>
        {partners.length === 0 ? (
          <p className="mt-4 text-sm text-ink/70">Spolupracující organizace klub doplní ve správě. Cizí loga sem nedáváme.</p>
        ) : (
          <ul className="mt-5 flex flex-wrap gap-3">
            {partners.map((partner) => (
              <li key={partner.id}>
                {partner.url ? (
                  <a href={partner.url} target="_blank" rel="noopener noreferrer" className="rounded-md border border-line bg-white px-4 py-3 text-sm font-semibold">
                    {partner.name}
                  </a>
                ) : (
                  <span className="rounded-md border border-line bg-white px-4 py-3 text-sm font-semibold">{partner.name}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
