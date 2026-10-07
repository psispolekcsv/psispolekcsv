import type { Metadata } from "next";
import { Newsreader, Source_Sans_3 } from "next/font/google";
import { AnalyticsInit } from "@/components/analytics";
import { siteUrl } from "@/lib/utils";
import "./globals.css";

const sans = Source_Sans_3({
  subsets: ["latin", "latin-ext"],
  variable: "--font-source",
  display: "swap",
});

const serif = Newsreader({
  subsets: ["latin", "latin-ext"],
  variable: "--font-newsreader",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "Klub československého vlčáka",
    template: "%s | Klub československého vlčáka",
  },
  description:
    "Informační portál Klubu československého vlčáka: plemeno, chov, akce, dokumenty a databáze.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Klub československého vlčáka",
    description: "Portál pro chovatele, majitele a zájemce o československého vlčáka.",
    locale: "cs_CZ",
    type: "website",
    images: ["/fotky/logo/logo.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="cs" className={`${sans.variable} ${serif.variable}`}>
      <body>
        <a href="#obsah" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-white focus:px-3 focus:py-2">
          Přeskočit na obsah
        </a>
        {children}
        <AnalyticsInit />
      </body>
    </html>
  );
}
