import type {
  BreedingStatus,
  DocumentCategory,
  EventCategory,
  LifeStatus,
  LitterStatus,
  PuppyAvailability,
  Role,
  Sex,
  SubmissionStatus,
} from "@/types/domain";

export const eventCategoryLabel: Record<EventCategory, string> = {
  show: "Výstava",
  bonitation: "Bonitace",
  youth_review: "Svod mladých",
  camp: "Klubový tábor",
  competition: "Závod",
  meeting: "Členská schůze",
  seminar: "Seminář",
  other: "Ostatní",
};

export const eventCategorySlug: Record<string, EventCategory> = {
  vystavy: "show",
  bonitace: "bonitation",
  svody: "youth_review",
  tabor: "camp",
  zavody: "competition",
  schuze: "meeting",
  seminare: "seminar",
  vysledky: "other",
};

export const reservedEventSlugs = new Set([
  ...Object.keys(eventCategorySlug),
  "kategorie",
  "udalost",
]);

export const documentCategoryLabel: Record<DocumentCategory, string> = {
  forms: "Formuláře",
  statutes: "Stanovy",
  club_rules: "Klubové řády",
  bonitation_rules: "Bonitační řád",
  youth_review_rules: "Řád svodu mladých",
  registration_rules: "Zápisní řád",
  disciplinary_rules: "Kárný řád",
  procedural_rules: "Jednací řády",
  cmku: "Dokumenty ČMKU",
  fci: "Dokumenty FCI",
  other: "Ostatní",
};

export const sexLabel: Record<Sex, string> = {
  male: "Pes",
  female: "Fena",
};

export const lifeLabel: Record<LifeStatus, string> = {
  active: "Aktivní",
  deceased: "Zemřelý",
};

export const breedingLabel: Record<BreedingStatus, string> = {
  none: "Nezařazen",
  pending: "V řízení",
  breeding: "Chovný",
  not_breeding: "Nechovný",
};

export const litterStatusLabel: Record<LitterStatus, string> = {
  planned: "Plánovaný",
  mated: "Nakrytá",
  born: "Narozený",
  checked: "Zkontrolovaný",
  archived: "Archiv",
};

export const puppyLabel: Record<PuppyAvailability, string> = {
  none: "Bez nabídky",
  available: "Štěňata k dispozici",
  reserved: "Rezervováno",
  placed: "Umístěno",
};

export const submissionStatusLabel: Record<SubmissionStatus, string> = {
  draft: "Koncept",
  submitted: "Odesláno",
  awaiting_party_a: "Čeká na první stranu",
  awaiting_party_b: "Čeká na druhou stranu",
  awaiting_approvals: "Čeká na obě strany",
  approved: "Schváleno",
  rejected: "Zamítnuto",
  expired: "Vypršelo",
  cancelled: "Zrušeno",
};

export const roleLabel: Record<Role, string> = {
  pending: "Čeká na schválení",
  admin: "Administrátor",
  superadmin: "Hlavní administrátor",
};

export const fieldTypeLabel = {
  text: "Text",
  textarea: "Delší text",
  email: "E-mail",
  tel: "Telefon",
  number: "Číslo",
  date: "Datum",
  select: "Výběr",
  radio: "Přepínač",
  checkbox: "Zaškrtnutí",
  consent: "Souhlas",
  file: "Soubor",
  photo: "Fotografie",
  dog: "Výběr psa",
} as const;
