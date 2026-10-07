import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EventList } from "@/components/data/collections";
import { MarkdownView } from "@/components/content/markdown-view";
import { PageShell } from "@/components/layout/page-shell";
import { renderMarkdown } from "@/lib/content/render";
import { eventCategoryLabel, eventCategorySlug, reservedEventSlugs } from "@/lib/labels";
import { listEvents } from "@/lib/server/data";
import { formatDate, siteUrl } from "@/lib/utils";
import type { EventCategory } from "@/types/domain";

type Props = { params: Promise<{ slug: string }> };

const titles: Record<string, string> = {
  vystavy: "Výstavy",
  bonitace: "Bonitace",
  svody: "Svody mladých",
  tabor: "Klubový tábor",
  zavody: "Závody",
  schuze: "Členské schůze",
  seminare: "Semináře",
  vysledky: "Výsledky minulých akcí",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (titles[slug]) return { title: titles[slug] };
  const event = (await listEvents()).find((item) => item.published && item.slug === slug);
  return { title: event?.title || "Akce", description: event?.location };
}

export default async function EventRoute({ params }: Props) {
  const { slug } = await params;
  const events = (await listEvents()).filter((event) => event.published);
  if (slug === "vysledky") {
    const past = events.filter((event) => event.results || event.startDate.slice(0, 10) < new Date().toISOString().slice(0, 10));
    return (
      <PageShell title="Výsledky minulých akcí" crumbs={[{ href: "/akce", label: "Akce" }, { label: "Výsledky" }]}>
        <EventList events={past} archive />
      </PageShell>
    );
  }
  if (reservedEventSlugs.has(slug) && eventCategorySlug[slug]) {
    const category = eventCategorySlug[slug] as EventCategory;
    return (
      <PageShell title={titles[slug] || eventCategoryLabel[category]} crumbs={[{ href: "/akce", label: "Akce" }, { label: titles[slug] || "" }]}>
        <EventList events={events.filter((event) => event.category === category)} />
        <div className="mt-8">
          <h2 className="mb-4 font-serif text-2xl">Archiv</h2>
          <EventList events={events.filter((event) => event.category === category)} archive />
        </div>
      </PageShell>
    );
  }
  const event = events.find((item) => item.slug === slug);
  if (!event) notFound();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate: event.startDate,
    endDate: event.endDate || undefined,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: event.location ? { "@type": "Place", name: event.location, address: event.address || undefined } : undefined,
    url: `${siteUrl()}/akce/${event.slug}`,
    description: event.description.slice(0, 300),
  };
  return (
    <PageShell title={event.title} lead={`${eventCategoryLabel[event.category]} · ${formatDate(event.startDate)}`} crumbs={[{ href: "/akce", label: "Akce" }, { label: event.title }]}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className="mb-4 text-sm text-ink/70">{[event.location, event.address].filter(Boolean).join(", ")}{event.organizer ? ` · pořádá ${event.organizer}` : ""}</p>
      <MarkdownView html={renderMarkdown(event.description)} />
      {event.results ? (
        <section className="mt-8">
          <h2 className="font-serif text-2xl">Výsledky</h2>
          <MarkdownView html={renderMarkdown(event.results)} />
        </section>
      ) : null}
      {event.registrationEnabled ? (
        <p className="mt-6 text-sm">
          Uzávěrka přihlášek: {formatDate(event.registrationDeadline) || "neuvedena"}.{" "}
          {event.registrationFormId ? <Link href={`/formulare/${event.registrationFormId}`} className="font-semibold text-amber-deep">Přihlásit se</Link> : <Link href="/formulare" className="font-semibold text-amber-deep">Formuláře</Link>}
        </p>
      ) : null}
    </PageShell>
  );
}
