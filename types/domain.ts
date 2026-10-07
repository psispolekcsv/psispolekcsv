export type Role = "pending" | "admin" | "superadmin";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: Role;
  approved: boolean;
  disabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CmsPage {
  slug: string;
  title: string;
  description: string;
  content: string;
  published: boolean;
  updatedAt: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  publishedAt: string;
  category: string;
  pinned: boolean;
  published: boolean;
  author: string;
  createdAt: string;
  updatedAt: string;
}

export type EventCategory =
  | "show"
  | "bonitation"
  | "youth_review"
  | "camp"
  | "competition"
  | "meeting"
  | "seminar"
  | "other";

export interface ClubEvent {
  id: string;
  title: string;
  slug: string;
  category: EventCategory;
  description: string;
  location: string;
  address: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  registrationEnabled: boolean;
  registrationFormId: string;
  capacity: number | null;
  organizer: string;
  files: string[];
  images: string[];
  results: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export type DocumentCategory =
  | "forms"
  | "statutes"
  | "club_rules"
  | "bonitation_rules"
  | "youth_review_rules"
  | "registration_rules"
  | "disciplinary_rules"
  | "procedural_rules"
  | "cmku"
  | "fci"
  | "other";

export interface ClubDocument {
  id: string;
  title: string;
  description: string;
  category: DocumentCategory;
  filePath: string;
  fileName: string;
  version: string;
  validFrom: string;
  published: boolean;
  uploadedAt: string;
}

export type Sex = "male" | "female";
export type LifeStatus = "active" | "deceased";
export type BreedingStatus = "none" | "pending" | "breeding" | "not_breeding";

export interface DogPublic {
  id: string;
  name: string;
  sex: Sex;
  birthDate: string;
  registrationNumber: string;
  chip: string;
  publishChip: boolean;
  kennelId: string;
  kennelName: string;
  sireName: string;
  damName: string;
  sireId: string;
  damId: string;
  breederName: string;
  country: string;
  breedingStatus: BreedingStatus;
  bonitation: string;
  titles: string[];
  exams: string[];
  healthSummary: string;
  photoPath: string;
  lifeStatus: LifeStatus;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DogPrivate {
  dogId: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  notes: string;
  updatedAt: string;
}

export interface Kennel {
  id: string;
  name: string;
  slug: string;
  ownerName: string;
  region: string;
  country: string;
  website: string;
  description: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export type LitterStatus = "planned" | "mated" | "born" | "checked" | "archived";
export type PuppyAvailability = "none" | "available" | "reserved" | "placed";

export interface Litter {
  id: string;
  matingDate: string;
  birthDate: string;
  damName: string;
  sireName: string;
  damId: string;
  sireId: string;
  kennelId: string;
  kennelName: string;
  breederName: string;
  city: string;
  region: string;
  malesBorn: number | null;
  femalesBorn: number | null;
  status: LitterStatus;
  puppyAvailability: PuppyAvailability;
  photoPath: string;
  note: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HealthResult {
  id: string;
  dogId: string;
  dogName: string;
  type: string;
  result: string;
  examinedAt: string;
  note: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export type FieldType =
  | "text"
  | "textarea"
  | "email"
  | "tel"
  | "number"
  | "date"
  | "select"
  | "radio"
  | "checkbox"
  | "consent"
  | "file"
  | "photo"
  | "dog";

export type FieldBinding = "party_a_name" | "party_a_email" | "party_b_name" | "party_b_email";

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  description: string;
  placeholder: string;
  required: boolean;
  order: number;
  options: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
  };
  binding?: FieldBinding;
}

export type ApprovalType = "none" | "single" | "dual";

export interface FormTemplate {
  id: string;
  title: string;
  slug: string;
  description: string;
  active: boolean;
  startsAt: string;
  endsAt: string;
  confirmationText: string;
  approvalType: ApprovalType;
  notificationEmails: string[];
  fields: FormField[];
  createdAt: string;
  updatedAt: string;
}

export type SubmissionStatus =
  | "draft"
  | "submitted"
  | "awaiting_party_a"
  | "awaiting_party_b"
  | "awaiting_approvals"
  | "approved"
  | "responded"
  | "ignored"
  | "rejected"
  | "expired"
  | "cancelled";

export interface PartyRecord {
  name: string;
  email: string;
  approvedAt: string | null;
  rejectedAt: string | null;
  rejectReason: string;
}

export interface SubmissionFile {
  fieldId: string;
  path: string;
  name: string;
  contentType: string;
}

export type AnswerValue = string | boolean | string[];

export interface FormSubmission {
  id: string;
  formId: string;
  formTitle: string;
  formSlug: string;
  approvalType: ApprovalType;
  status: SubmissionStatus;
  answers: Record<string, AnswerValue>;
  files: SubmissionFile[];
  partyA: PartyRecord;
  partyB: PartyRecord | null;
  locked: boolean;
  finalSnapshot: {
    answers: Record<string, AnswerValue>;
    files: SubmissionFile[];
    approvedAt: string;
  } | null;
  revisionOf: string | null;
  revision: number;
  createdAt: string;
  updatedAt: string;
  approvedAt: string | null;
  adminMessage: string;
}

export interface ApprovalTokenRecord {
  hash: string;
  submissionId: string;
  party: "a" | "b";
  expiresAt: string;
  usedAt: string | null;
  createdAt: string;
}

export interface Partner {
  id: string;
  name: string;
  url: string;
  logoPath: string;
  order: number;
  published: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  alt: string;
  imagePath: string;
  published: boolean;
  createdAt: string;
}

export interface Classified {
  id: string;
  title: string;
  body: string;
  category: string;
  contact: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SiteSettings {
  clubName: string;
  claim: string;
  email: string;
  phone: string;
  address: string;
  ico: string;
  bankAccount: string;
  iban: string;
  heroTitle: string;
  heroLead: string;
  breedIntro: string;
}

export interface AuditLog {
  id: string;
  actorUid: string;
  actorEmail: string;
  action: string;
  entity: string;
  entityId: string;
  message: string;
  createdAt: string;
}
