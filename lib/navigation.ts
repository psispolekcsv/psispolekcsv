export interface NavItem {
  href?: string;
  label: string;
  children?: { href: string; label: string; description?: string }[];
}

export const mainNav: NavItem[] = [
  { href: "/", label: "Domů" },
  { href: "/novinky", label: "Novinky" },
  {
    label: "Klub",
    children: [
      { href: "/klub/o-klubu", label: "O klubu" },
      { href: "/klub/clenstvi", label: "Členství" },
      { href: "/klub/vybor", label: "Výbor a kontakty" },
      { href: "/klub/cenik", label: "Ceník a platby" },
      { href: "/klub/partneri", label: "Partneři" },
      { href: "/galerie", label: "Fotogalerie" },
    ],
  },
  {
    label: "Plemeno",
    children: [
      { href: "/plemeno", label: "O československém vlčákovi" },
      { href: "/plemeno/historie", label: "Historie plemene" },
      { href: "/plemeno/standard", label: "Standard FCI" },
      { href: "/plemeno/povaha", label: "Povaha a využití" },
      { href: "/plemeno/pece", label: "Péče a soužití" },
      { href: "/plemeno/faq", label: "Časté dotazy" },
    ],
  },
  {
    label: "Chov",
    children: [
      { href: "/chov/jak-uchovnit", label: "Jak uchovnit" },
      { href: "/chov/pro-chovatele", label: "Informace pro chovatele" },
      { href: "/chov/chovni-psi", label: "Chovní psi" },
      { href: "/chov/chovne-feny", label: "Chovné feny" },
      { href: "/chov/stanice", label: "Chovatelské stanice" },
      { href: "/chov/nakryte-feny", label: "Nakryté feny" },
      { href: "/chov/stenata", label: "Aktuální štěňata" },
      { href: "/chov/vrhy", label: "Přehled vrhů" },
      { href: "/chov/zdravi", label: "Zdraví a vyšetření" },
    ],
  },
  {
    label: "Akce",
    children: [
      { href: "/akce", label: "Přehled akcí" },
      { href: "/akce/vystavy", label: "Výstavy" },
      { href: "/akce/bonitace", label: "Bonitace" },
      { href: "/akce/svody", label: "Svody mladých" },
      { href: "/akce/tabor", label: "Klubový tábor" },
      { href: "/akce/zavody", label: "Závody" },
      { href: "/akce/schuze", label: "Členské schůze" },
      { href: "/akce/seminare", label: "Semináře" },
      { href: "/akce/vysledky", label: "Výsledky minulých akcí" },
    ],
  },
  {
    label: "Výcvik",
    children: [
      { href: "/vycvik", label: "Informace" },
      { href: "/vycvik/discipliny", label: "Sportovní disciplíny" },
      { href: "/vycvik/vysledky", label: "Výsledky" },
      { href: "/vycvik/zkousky", label: "Psi se zkouškami" },
      { href: "/vycvik/souteze", label: "Klubové soutěže" },
      { href: "/vycvik/rady", label: "Zkušební řády" },
    ],
  },
  {
    label: "Poradna",
    children: [
      { href: "/poradna", label: "Přehled poradny" },
      { href: "/poradna/budouci-majitele", label: "Pro budoucí majitele" },
      { href: "/poradna/chovatele", label: "Pro chovatele" },
      { href: "/poradna/zdravi", label: "Zdraví" },
      { href: "/poradna/veterina", label: "Veterinární informace" },
      { href: "/chov/jak-uchovnit", label: "Jak uchovnit" },
    ],
  },
  { href: "/dokumenty", label: "Dokumenty" },
];

export const footerNav = [
  { href: "/databaze", label: "Databáze" },
  { href: "/dokumenty", label: "Dokumenty" },
  { href: "/formulare", label: "Formuláře" },
  { href: "/inzerce", label: "Inzerce" },
  { href: "/galerie", label: "Galerie" },
  { href: "/kontakty", label: "Kontakty" },
  { href: "/ochrana-osobnich-udaju", label: "Ochrana osobních údajů" },
];

export const adminNav: { href: string; label: string; exact?: boolean; superadmin?: boolean }[] = [
  { href: "/sprava", label: "Přehled", exact: true },
  { href: "/sprava/novinky", label: "Novinky" },
  { href: "/sprava/stranky", label: "Stránky" },
  { href: "/sprava/akce", label: "Akce" },
  { href: "/sprava/psi", label: "Psi" },
  { href: "/sprava/stanice", label: "Chovatelské stanice" },
  { href: "/sprava/vrhy", label: "Vrhy" },
  { href: "/sprava/zdravi", label: "Zdraví" },
  { href: "/sprava/formulare", label: "Formuláře" },
  { href: "/sprava/podani", label: "Podání" },
  { href: "/sprava/dokumenty", label: "Dokumenty" },
  { href: "/sprava/galerie", label: "Galerie" },
  { href: "/sprava/inzerce", label: "Inzerce" },
  { href: "/sprava/kontakty", label: "Kontakty" },
  { href: "/sprava/partneri", label: "Partneři" },
  { href: "/sprava/administrator", label: "Administrátoři", superadmin: true },
  { href: "/sprava/audit", label: "Audit", superadmin: true },
  { href: "/sprava/nastaveni", label: "Nastavení" },
];
