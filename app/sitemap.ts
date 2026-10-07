import type { MetadataRoute } from "next";
import { listEvents, listNews } from "@/lib/server/data";
import { siteUrl } from "@/lib/utils";

const paths = [
  "",
  "/novinky",
  "/klub/o-klubu",
  "/klub/clenstvi",
  "/klub/vybor",
  "/klub/cenik",
  "/klub/partneri",
  "/plemeno",
  "/plemeno/historie",
  "/plemeno/standard",
  "/plemeno/povaha",
  "/plemeno/pece",
  "/plemeno/faq",
  "/chov/jak-uchovnit",
  "/chov/pro-chovatele",
  "/chov/chovni-psi",
  "/chov/chovne-feny",
  "/chov/stanice",
  "/chov/nakryte-feny",
  "/chov/stenata",
  "/chov/vrhy",
  "/chov/zdravi",
  "/akce",
  "/akce/vystavy",
  "/akce/bonitace",
  "/akce/svody",
  "/akce/tabor",
  "/akce/zavody",
  "/akce/schuze",
  "/akce/seminare",
  "/akce/vysledky",
  "/vycvik",
  "/vycvik/discipliny",
  "/vycvik/vysledky",
  "/vycvik/zkousky",
  "/vycvik/souteze",
  "/vycvik/rady",
  "/poradna",
  "/poradna/budouci-majitele",
  "/poradna/chovatele",
  "/poradna/zdravi",
  "/poradna/veterina",
  "/dokumenty",
  "/databaze",
  "/databaze/psi",
  "/databaze/feny",
  "/databaze/stanice",
  "/databaze/vrhy",
  "/databaze/zdravi",
  "/databaze/statistiky",
  "/galerie",
  "/inzerce",
  "/kontakty",
  "/formulare",
  "/ochrana-osobnich-udaju",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const now = new Date();
  const entries: MetadataRoute.Sitemap = paths.map((path) => ({
    url: `${base}${path || "/"}`,
    lastModified: now,
  }));
  try {
    const [news, events] = await Promise.all([listNews(true), listEvents()]);
    for (const item of news) entries.push({ url: `${base}/novinky/${item.slug}`, lastModified: now });
    for (const item of events.filter((event) => event.published)) entries.push({ url: `${base}/akce/${item.slug}`, lastModified: now });
  } catch {
    return entries;
  }
  return entries;
}
