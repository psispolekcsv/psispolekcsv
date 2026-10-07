import type { Metadata } from "next";
import { HomeView } from "@/components/home/home-view";
import { getSettings, listDogs, listEvents, listKennels, listLitters, listNews, listPartners } from "@/lib/server/data";
import { siteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: { absolute: "Klub československého vlčáka" },
  description: "Oficiální informační portál Klubu československého vlčáka.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [settings, news, events, litters, kennels, dogs, partners] = await Promise.all([
    getSettings(),
    listNews(true),
    listEvents(),
    listLitters(),
    listKennels(),
    listDogs(),
    listPartners(),
  ]);
  const publishedDogs = dogs.filter((dog) => dog.published && dog.lifeStatus === "active");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.clubName,
    url: siteUrl(),
    email: settings.email || undefined,
    description: settings.claim,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HomeView
        settings={settings}
        news={news}
        events={events.filter((event) => event.published)}
        litters={litters.filter((item) => item.published)}
        kennels={kennels.filter((item) => item.published)}
        partners={partners.filter((item) => item.published)}
        breedingMales={publishedDogs.filter((dog) => dog.sex === "male" && dog.breedingStatus === "breeding").length}
        breedingFemales={publishedDogs.filter((dog) => dog.sex === "female" && dog.breedingStatus === "breeding").length}
      />
    </>
  );
}
