import type {
  AnswerValue,
  AuditLog,
  BreedingStatus,
  Classified,
  ClubDocument,
  ClubEvent,
  CmsPage,
  DocumentCategory,
  DogPrivate,
  DogPublic,
  EventCategory,
  FormField,
  FormSubmission,
  FormTemplate,
  GalleryItem,
  HealthResult,
  Kennel,
  LifeStatus,
  Litter,
  LitterStatus,
  NewsArticle,
  Partner,
  PartyRecord,
  Role,
  Sex,
  SiteSettings,
  SubmissionFile,
  SubmissionStatus,
  UserProfile,
} from "@/types/domain";
import { defaultSettings } from "@/lib/content/defaults";

type Data = Record<string, unknown>;

function str(data: Data, key: string, fallback = "") {
  const value = data[key];
  return typeof value === "string" ? value : fallback;
}
function num(data: Data, key: string) {
  const value = data[key];
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}
function bool(data: Data, key: string) {
  return data[key] === true;
}
function list(data: Data, key: string) {
  const value = data[key];
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

const roles = new Set<Role>(["pending", "admin", "superadmin"]);
const statuses = new Set<SubmissionStatus>([
  "draft",
  "submitted",
  "awaiting_party_a",
  "awaiting_party_b",
  "awaiting_approvals",
  "approved",
  "responded",
  "ignored",
  "rejected",
  "expired",
  "cancelled",
]);

export function mapUser(uid: string, data: Data): UserProfile {
  const role = data.role;
  return {
    uid,
    email: str(data, "email"),
    displayName: str(data, "displayName"),
    role: roles.has(role as Role) ? (role as Role) : "pending",
    approved: data.approved === true,
    disabled: data.disabled === true,
    createdAt: str(data, "createdAt"),
    updatedAt: str(data, "updatedAt"),
  };
}

export function mapPage(id: string, data: Data): CmsPage {
  return {
    slug: str(data, "slug", id),
    title: str(data, "title"),
    description: str(data, "description"),
    content: str(data, "content"),
    published: bool(data, "published"),
    updatedAt: str(data, "updatedAt"),
  };
}

export function mapNews(id: string, data: Data): NewsArticle {
  return {
    id,
    title: str(data, "title"),
    slug: str(data, "slug"),
    excerpt: str(data, "excerpt"),
    content: str(data, "content"),
    coverImage: str(data, "coverImage"),
    publishedAt: str(data, "publishedAt"),
    category: str(data, "category"),
    pinned: bool(data, "pinned"),
    published: bool(data, "published"),
    author: str(data, "author"),
    createdAt: str(data, "createdAt"),
    updatedAt: str(data, "updatedAt"),
  };
}

const eventCategories = new Set<EventCategory>([
  "show",
  "bonitation",
  "youth_review",
  "camp",
  "competition",
  "meeting",
  "seminar",
  "other",
]);

export function mapEvent(id: string, data: Data): ClubEvent {
  const category = data.category;
  return {
    id,
    title: str(data, "title"),
    slug: str(data, "slug"),
    category: eventCategories.has(category as EventCategory) ? (category as EventCategory) : "other",
    description: str(data, "description"),
    location: str(data, "location"),
    address: str(data, "address"),
    startDate: str(data, "startDate"),
    endDate: str(data, "endDate"),
    registrationDeadline: str(data, "registrationDeadline"),
    registrationEnabled: bool(data, "registrationEnabled"),
    registrationFormId: str(data, "registrationFormId"),
    capacity: num(data, "capacity"),
    organizer: str(data, "organizer"),
    files: list(data, "files"),
    images: list(data, "images"),
    results: str(data, "results"),
    published: bool(data, "published"),
    createdAt: str(data, "createdAt"),
    updatedAt: str(data, "updatedAt"),
  };
}

export function mapDocument(id: string, data: Data): ClubDocument {
  return {
    id,
    title: str(data, "title"),
    description: str(data, "description"),
    category: (str(data, "category", "other") || "other") as DocumentCategory,
    filePath: str(data, "filePath"),
    fileName: str(data, "fileName"),
    version: str(data, "version"),
    validFrom: str(data, "validFrom"),
    published: bool(data, "published"),
    uploadedAt: str(data, "uploadedAt"),
  };
}

export function mapDog(id: string, data: Data): DogPublic {
  const sex: Sex = data.sex === "female" ? "female" : "male";
  const life: LifeStatus = data.lifeStatus === "deceased" ? "deceased" : "active";
  const breeding = new Set<BreedingStatus>(["none", "pending", "breeding", "not_breeding"]);
  return {
    id,
    name: str(data, "name"),
    sex,
    birthDate: str(data, "birthDate"),
    registrationNumber: str(data, "registrationNumber"),
    chip: bool(data, "publishChip") ? str(data, "chip") : "",
    publishChip: bool(data, "publishChip"),
    kennelId: str(data, "kennelId"),
    kennelName: str(data, "kennelName"),
    sireName: str(data, "sireName"),
    damName: str(data, "damName"),
    sireId: str(data, "sireId"),
    damId: str(data, "damId"),
    breederName: str(data, "breederName"),
    country: str(data, "country"),
    breedingStatus: breeding.has(data.breedingStatus as BreedingStatus) ? (data.breedingStatus as BreedingStatus) : "none",
    bonitation: str(data, "bonitation"),
    titles: list(data, "titles"),
    exams: list(data, "exams"),
    healthSummary: str(data, "healthSummary"),
    photoPath: str(data, "photoPath"),
    lifeStatus: life,
    published: bool(data, "published"),
    createdAt: str(data, "createdAt"),
    updatedAt: str(data, "updatedAt"),
  };
}

export function mapDogPrivate(id: string, data: Data): DogPrivate {
  return {
    dogId: id,
    ownerName: str(data, "ownerName"),
    ownerEmail: str(data, "ownerEmail"),
    ownerPhone: str(data, "ownerPhone"),
    notes: str(data, "notes"),
    updatedAt: str(data, "updatedAt"),
  };
}

export function mapKennel(id: string, data: Data): Kennel {
  return {
    id,
    name: str(data, "name"),
    slug: str(data, "slug"),
    ownerName: str(data, "ownerName"),
    region: str(data, "region"),
    country: str(data, "country"),
    website: str(data, "website"),
    description: str(data, "description"),
    published: bool(data, "published"),
    createdAt: str(data, "createdAt"),
    updatedAt: str(data, "updatedAt"),
  };
}

export function mapLitter(id: string, data: Data): Litter {
  const status = new Set<LitterStatus>(["planned", "mated", "born", "checked", "archived"]);
  return {
    id,
    matingDate: str(data, "matingDate"),
    birthDate: str(data, "birthDate"),
    damName: str(data, "damName"),
    sireName: str(data, "sireName"),
    damId: str(data, "damId"),
    sireId: str(data, "sireId"),
    kennelId: str(data, "kennelId"),
    kennelName: str(data, "kennelName"),
    breederName: str(data, "breederName"),
    city: str(data, "city"),
    region: str(data, "region"),
    malesBorn: num(data, "malesBorn"),
    femalesBorn: num(data, "femalesBorn"),
    status: status.has(data.status as LitterStatus) ? (data.status as LitterStatus) : "planned",
    puppyAvailability:
      data.puppyAvailability === "available" || data.puppyAvailability === "reserved" || data.puppyAvailability === "placed"
        ? data.puppyAvailability
        : "none",
    photoPath: str(data, "photoPath"),
    note: str(data, "note"),
    published: bool(data, "published"),
    createdAt: str(data, "createdAt"),
    updatedAt: str(data, "updatedAt"),
  };
}

export function mapHealth(id: string, data: Data): HealthResult {
  return {
    id,
    dogId: str(data, "dogId"),
    dogName: str(data, "dogName"),
    type: str(data, "type"),
    result: str(data, "result"),
    examinedAt: str(data, "examinedAt"),
    note: str(data, "note"),
    published: bool(data, "published"),
    createdAt: str(data, "createdAt"),
    updatedAt: str(data, "updatedAt"),
  };
}

function mapParty(value: unknown): PartyRecord {
  const data = value && typeof value === "object" ? (value as Data) : {};
  return {
    name: str(data, "name"),
    email: str(data, "email"),
    approvedAt: typeof data.approvedAt === "string" ? data.approvedAt : null,
    rejectedAt: typeof data.rejectedAt === "string" ? data.rejectedAt : null,
    rejectReason: str(data, "rejectReason"),
  };
}

export function mapTemplate(id: string, data: Data): FormTemplate {
  const fields = Array.isArray(data.fields) ? (data.fields as FormField[]) : [];
  const approval = data.approvalType === "single" || data.approvalType === "dual" ? data.approvalType : "none";
  return {
    id,
    title: str(data, "title"),
    slug: str(data, "slug", id),
    description: str(data, "description"),
    active: bool(data, "active"),
    startsAt: str(data, "startsAt"),
    endsAt: str(data, "endsAt"),
    confirmationText: str(data, "confirmationText"),
    approvalType: approval,
    notificationEmails: list(data, "notificationEmails"),
    fields,
    createdAt: str(data, "createdAt"),
    updatedAt: str(data, "updatedAt"),
  };
}

export function mapSubmission(id: string, data: Data): FormSubmission {
  const answers = data.answers && typeof data.answers === "object" ? (data.answers as Record<string, AnswerValue>) : {};
  const files = Array.isArray(data.files) ? (data.files as SubmissionFile[]) : [];
  const status = statuses.has(data.status as SubmissionStatus) ? (data.status as SubmissionStatus) : "submitted";
  const snapshot = data.finalSnapshot && typeof data.finalSnapshot === "object" ? (data.finalSnapshot as FormSubmission["finalSnapshot"]) : null;
  return {
    id,
    formId: str(data, "formId"),
    formTitle: str(data, "formTitle"),
    formSlug: str(data, "formSlug"),
    approvalType: data.approvalType === "single" || data.approvalType === "dual" ? data.approvalType : "none",
    status,
    answers,
    files,
    partyA: mapParty(data.partyA),
    partyB: data.partyB ? mapParty(data.partyB) : null,
    locked: bool(data, "locked"),
    finalSnapshot: snapshot,
    revisionOf: typeof data.revisionOf === "string" ? data.revisionOf : null,
    revision: typeof data.revision === "number" ? data.revision : 1,
    createdAt: str(data, "createdAt"),
    updatedAt: str(data, "updatedAt"),
    approvedAt: typeof data.approvedAt === "string" ? data.approvedAt : null,
    adminMessage: str(data, "adminMessage"),
  };
}

export function mapPartner(id: string, data: Data): Partner {
  return {
    id,
    name: str(data, "name"),
    url: str(data, "url"),
    logoPath: str(data, "logoPath"),
    order: typeof data.order === "number" ? data.order : 0,
    published: bool(data, "published"),
  };
}

export function mapGallery(id: string, data: Data): GalleryItem {
  return {
    id,
    title: str(data, "title"),
    alt: str(data, "alt"),
    imagePath: str(data, "imagePath"),
    published: bool(data, "published"),
    createdAt: str(data, "createdAt"),
  };
}

export function mapClassified(id: string, data: Data): Classified {
  return {
    id,
    title: str(data, "title"),
    body: str(data, "body"),
    category: str(data, "category"),
    contact: str(data, "contact"),
    published: bool(data, "published"),
    createdAt: str(data, "createdAt"),
    updatedAt: str(data, "updatedAt"),
  };
}

export function mapSettings(data: Data | undefined): SiteSettings {
  const source = data ?? {};
  return {
    ...defaultSettings,
    clubName: str(source, "clubName", defaultSettings.clubName) || defaultSettings.clubName,
    claim: str(source, "claim", defaultSettings.claim) || defaultSettings.claim,
    email: str(source, "email"),
    phone: str(source, "phone"),
    address: str(source, "address"),
    ico: str(source, "ico"),
    bankAccount: str(source, "bankAccount"),
    iban: str(source, "iban"),
    heroTitle: str(source, "heroTitle", defaultSettings.heroTitle) || defaultSettings.heroTitle,
    heroLead: str(source, "heroLead", defaultSettings.heroLead) || defaultSettings.heroLead,
    breedIntro: str(source, "breedIntro", defaultSettings.breedIntro) || defaultSettings.breedIntro,
  };
}

export function mapAudit(id: string, data: Data): AuditLog {
  return {
    id,
    actorUid: str(data, "actorUid"),
    actorEmail: str(data, "actorEmail"),
    action: str(data, "action"),
    entity: str(data, "entity"),
    entityId: str(data, "entityId"),
    message: str(data, "message"),
    createdAt: str(data, "createdAt"),
  };
}
