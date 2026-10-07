"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { assertRoleChange } from "@/lib/auth/permissions";
import { readVerifiedFile } from "@/lib/files/sniff";
import { formTemplateInputSchema } from "@/lib/forms/fields";
import { seedFormTemplates } from "@/lib/forms/seed";
import { reservedEventSlugs } from "@/lib/labels";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { sendEmail } from "@/lib/mail/service";
import { mailAdminApproved, mailAdminRejected } from "@/lib/mail/templates";
import { writeAudit, writeEmailLog } from "@/lib/server/audit";
import { getTemplateBySlug, removeDoc, saveDoc, saveSettings } from "@/lib/server/data";
import { requireAdmin, requireSuperadmin } from "@/lib/server/session";
import { saveBuffer, storageId } from "@/lib/server/storage";
import { createRevision, reviewSubmission } from "@/lib/server/submissions";
import { asBool, asString, siteUrl, slugify } from "@/lib/utils";
import type { Role, UserProfile } from "@/types/domain";

export type ActionState = { error: string } | null;

function isRedirect(error: unknown) {
  return typeof error === "object" && error !== null && "digest" in error && String((error as { digest: unknown }).digest).includes("NEXT_REDIRECT");
}

function listText(value: string) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

async function storedFile(formData: FormData, name: string, kind: "image" | "document", folder: string) {
  const file = formData.get(name);
  if (!(file instanceof File) || file.size === 0) return "";
  const verified = await readVerifiedFile(file, kind);
  const path = `${folder}/${storageId()}`;
  await saveBuffer(path, verified.bytes, verified.type);
  return path;
}

async function perform(user: UserProfile, formData: FormData) {
  const kind = asString(formData.get("kind"));
  const id = asString(formData.get("id")) || null;
  const now = new Date().toISOString();

  if (kind === "news") {
    const title = asString(formData.get("title"));
    if (title.length < 2) throw new Error("Vyplňte název.");
    const slug = slugify(asString(formData.get("slug")) || title);
    const cover = await storedFile(formData, "cover", "image", "public/news");
    const saved = await saveDoc("news", id, {
      title,
      slug,
      excerpt: asString(formData.get("excerpt")),
      content: asString(formData.get("content")),
      category: asString(formData.get("category")),
      author: asString(formData.get("author")) || user.displayName || user.email,
      pinned: asBool(formData.get("pinned")),
      published: asBool(formData.get("published")),
      publishedAt: asString(formData.get("publishedAt")) || now,
      ...(cover ? { coverImage: cover } : {}),
    });
    await writeAudit({ actorUid: user.uid, actorEmail: user.email, action: asBool(formData.get("published")) ? "content_published" : "content_saved", entity: "news", entityId: saved, message: title });
    return "/sprava/novinky?ulozeno=1";
  }

  if (kind === "page") {
    const slug = slugify(asString(formData.get("slug")));
    const title = asString(formData.get("title"));
    if (!slug || !title) throw new Error("Stránka potřebuje adresu a název.");
    await saveDoc("pages", slug, {
      slug,
      title,
      description: asString(formData.get("description")),
      content: asString(formData.get("content")),
      published: asBool(formData.get("published")),
    });
    await writeAudit({ actorUid: user.uid, actorEmail: user.email, action: "content_saved", entity: "pages", entityId: slug, message: title });
    return "/sprava/stranky?ulozeno=1";
  }

  if (kind === "event") {
    const title = asString(formData.get("title"));
    const slug = slugify(asString(formData.get("slug")) || title);
    if (reservedEventSlugs.has(slug)) throw new Error("Tuto adresu používá přehled akcí. Zvolte jinou.");
    if (!title || !asString(formData.get("startDate"))) throw new Error("Akce potřebuje název a začátek.");
    const saved = await saveDoc("events", id, {
      title,
      slug,
      category: asString(formData.get("category")) || "other",
      description: asString(formData.get("description")),
      location: asString(formData.get("location")),
      address: asString(formData.get("address")),
      startDate: asString(formData.get("startDate")),
      endDate: asString(formData.get("endDate")),
      registrationDeadline: asString(formData.get("registrationDeadline")),
      registrationEnabled: asBool(formData.get("registrationEnabled")),
      registrationFormId: asString(formData.get("registrationFormId")),
      capacity: asString(formData.get("capacity")) ? Number(asString(formData.get("capacity"))) : null,
      organizer: asString(formData.get("organizer")),
      results: asString(formData.get("results")),
      published: asBool(formData.get("published")),
      files: [],
      images: [],
    });
    await writeAudit({ actorUid: user.uid, actorEmail: user.email, action: "content_saved", entity: "events", entityId: saved, message: title });
    return "/sprava/akce?ulozeno=1";
  }

  if (kind === "dog") {
    const name = asString(formData.get("name"));
    if (name.length < 2) throw new Error("Vyplňte jméno psa.");
    const publishChip = asBool(formData.get("publishChip"));
    const chip = asString(formData.get("chip"));
    const photo = await storedFile(formData, "photo", "image", "public/dogs");
    const saved = await saveDoc("dogs", id, {
      name,
      sex: asString(formData.get("sex")) === "female" ? "female" : "male",
      birthDate: asString(formData.get("birthDate")),
      registrationNumber: asString(formData.get("registrationNumber")),
      chip: publishChip ? chip : "",
      publishChip,
      kennelId: asString(formData.get("kennelId")),
      kennelName: asString(formData.get("kennelName")),
      sireName: asString(formData.get("sireName")),
      damName: asString(formData.get("damName")),
      sireId: "",
      damId: "",
      breederName: asString(formData.get("breederName")),
      country: asString(formData.get("country")),
      breedingStatus: asString(formData.get("breedingStatus")) || "none",
      bonitation: asString(formData.get("bonitation")),
      titles: listText(asString(formData.get("titles"))),
      exams: listText(asString(formData.get("exams"))),
      healthSummary: asString(formData.get("healthSummary")),
      lifeStatus: asString(formData.get("lifeStatus")) === "deceased" ? "deceased" : "active",
      published: asBool(formData.get("published")),
      ...(photo ? { photoPath: photo } : {}),
    });
    const db = adminDb();
    if (!db) throw new Error("Firebase Admin není nakonfigurovaný.");
    await db.collection("dogsPrivate").doc(saved).set(
      {
        chip,
        ownerName: asString(formData.get("ownerName")),
        ownerEmail: asString(formData.get("ownerEmail")),
        ownerPhone: asString(formData.get("ownerPhone")),
        notes: asString(formData.get("notes")),
        updatedAt: now,
      },
      { merge: true },
    );
    await writeAudit({ actorUid: user.uid, actorEmail: user.email, action: "content_saved", entity: "dogs", entityId: saved, message: name });
    return "/sprava/psi?ulozeno=1";
  }

  if (kind === "kennel") {
    const name = asString(formData.get("name"));
    if (!name) throw new Error("Vyplňte název stanice.");
    const saved = await saveDoc("kennels", id, {
      name,
      slug: slugify(asString(formData.get("slug")) || name),
      ownerName: asString(formData.get("ownerName")),
      region: asString(formData.get("region")),
      country: asString(formData.get("country")) || "Česko",
      website: asString(formData.get("website")),
      description: asString(formData.get("description")),
      published: asBool(formData.get("published")),
    });
    await writeAudit({ actorUid: user.uid, actorEmail: user.email, action: "content_saved", entity: "kennels", entityId: saved, message: name });
    return "/sprava/stanice?ulozeno=1";
  }

  if (kind === "litter") {
    const saved = await saveDoc("litters", id, {
      matingDate: asString(formData.get("matingDate")),
      birthDate: asString(formData.get("birthDate")),
      damName: asString(formData.get("damName")),
      sireName: asString(formData.get("sireName")),
      damId: "",
      sireId: "",
      kennelId: "",
      kennelName: asString(formData.get("kennelName")),
      breederName: asString(formData.get("breederName")),
      city: asString(formData.get("city")),
      region: asString(formData.get("region")),
      malesBorn: asString(formData.get("malesBorn")) ? Number(asString(formData.get("malesBorn"))) : null,
      femalesBorn: asString(formData.get("femalesBorn")) ? Number(asString(formData.get("femalesBorn"))) : null,
      status: asString(formData.get("status")) || "planned",
      puppyAvailability: asString(formData.get("puppyAvailability")) || "none",
      note: asString(formData.get("note")),
      published: asBool(formData.get("published")),
    });
    await writeAudit({ actorUid: user.uid, actorEmail: user.email, action: "content_saved", entity: "litters", entityId: saved, message: `${asString(formData.get("damName"))} x ${asString(formData.get("sireName"))}` });
    return "/sprava/vrhy?ulozeno=1";
  }

  if (kind === "health") {
    const saved = await saveDoc("healthResults", id, {
      dogId: asString(formData.get("dogId")),
      dogName: asString(formData.get("dogName")),
      type: asString(formData.get("type")),
      result: asString(formData.get("result")),
      examinedAt: asString(formData.get("examinedAt")),
      note: asString(formData.get("note")),
      published: asBool(formData.get("published")),
    });
    await writeAudit({ actorUid: user.uid, actorEmail: user.email, action: "content_saved", entity: "healthResults", entityId: saved, message: asString(formData.get("dogName")) });
    return "/sprava/zdravi?ulozeno=1";
  }

  if (kind === "document") {
    const title = asString(formData.get("title"));
    const filePath = await storedFile(formData, "file", "document", "public/documents");
    if (!id && !filePath) throw new Error("Nahrajte soubor.");
    const saved = await saveDoc("documents", id, {
      title,
      description: asString(formData.get("description")),
      category: asString(formData.get("category")) || "other",
      ...(filePath ? { filePath, fileName: filePath } : {}),
      version: asString(formData.get("version")),
      validFrom: asString(formData.get("validFrom")),
      published: asBool(formData.get("published")),
      uploadedAt: now,
    });
    await writeAudit({ actorUid: user.uid, actorEmail: user.email, action: "content_saved", entity: "documents", entityId: saved, message: title });
    return "/sprava/dokumenty?ulozeno=1";
  }

  if (kind === "gallery") {
    const imagePath = await storedFile(formData, "image", "image", "public/gallery");
    if (!id && !imagePath) throw new Error("Nahrajte fotografii.");
    const saved = await saveDoc("gallery", id, {
      title: asString(formData.get("title")),
      alt: asString(formData.get("alt")) || asString(formData.get("title")),
      ...(imagePath ? { imagePath } : {}),
      published: asBool(formData.get("published")),
    });
    await writeAudit({ actorUid: user.uid, actorEmail: user.email, action: "content_saved", entity: "gallery", entityId: saved, message: asString(formData.get("title")) });
    return "/sprava/galerie?ulozeno=1";
  }

  if (kind === "classified") {
    const saved = await saveDoc("classifieds", id, {
      title: asString(formData.get("title")),
      body: asString(formData.get("body")),
      category: asString(formData.get("category")) || "nabidka",
      contact: asString(formData.get("contact")),
      published: asBool(formData.get("published")),
    });
    await writeAudit({ actorUid: user.uid, actorEmail: user.email, action: "content_saved", entity: "classifieds", entityId: saved, message: asString(formData.get("title")) });
    return "/sprava/inzerce?ulozeno=1";
  }

  if (kind === "partner") {
    const saved = await saveDoc("partners", id, {
      name: asString(formData.get("name")),
      url: asString(formData.get("url")),
      order: Number(asString(formData.get("order")) || 0),
      published: asBool(formData.get("published")),
      logoPath: "",
    });
    await writeAudit({ actorUid: user.uid, actorEmail: user.email, action: "content_saved", entity: "partners", entityId: saved, message: asString(formData.get("name")) });
    return "/sprava/partneri?ulozeno=1";
  }

  if (kind === "settings") {
    await saveSettings({
      clubName: asString(formData.get("clubName")),
      claim: asString(formData.get("claim")),
      email: asString(formData.get("email")),
      phone: asString(formData.get("phone")),
      address: asString(formData.get("address")),
      ico: asString(formData.get("ico")),
      bankAccount: asString(formData.get("bankAccount")),
      iban: asString(formData.get("iban")),
      heroTitle: asString(formData.get("heroTitle")),
      heroLead: asString(formData.get("heroLead")),
      breedIntro: asString(formData.get("breedIntro")),
    });
    await writeAudit({ actorUid: user.uid, actorEmail: user.email, action: "settings_saved", entity: "siteSettings", entityId: "general", message: "Nastavení webu" });
    return "/sprava/nastaveni?ulozeno=1";
  }

  if (kind === "template") {
    const parsed = formTemplateInputSchema.safeParse({
      title: asString(formData.get("title")),
      slug: slugify(asString(formData.get("slug")) || asString(formData.get("title"))),
      description: asString(formData.get("description")),
      active: asBool(formData.get("active")),
      startsAt: asString(formData.get("startsAt")),
      endsAt: asString(formData.get("endsAt")),
      confirmationText: asString(formData.get("confirmationText")),
      approvalType: asString(formData.get("approvalType")) || "single",
      notificationEmails: asString(formData.get("notificationEmails")).split(/[\s,;]+/).map((item) => item.trim()).filter(Boolean),
      fields: JSON.parse(asString(formData.get("fieldsJson")) || "[]"),
    });
    if (!parsed.success) throw new Error(parsed.error.issues[0]?.message || "Formulář není platný.");
    await saveDoc("formTemplates", parsed.data.slug, parsed.data);
    await writeAudit({ actorUid: user.uid, actorEmail: user.email, action: "content_saved", entity: "formTemplates", entityId: parsed.data.slug, message: parsed.data.title });
    return "/sprava/formulare?ulozeno=1";
  }

  throw new Error("Neznámý typ záznamu.");
}

export async function saveAdminRecord(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireAdmin();
  try {
    const destination = await perform(user, formData);
    revalidatePath("/", "layout");
    redirect(destination);
  } catch (error) {
    if (isRedirect(error)) throw error;
    return { error: error instanceof Error ? error.message : "Uložení selhalo." };
  }
}

export async function deleteAdminRecord(formData: FormData) {
  const user = await requireAdmin();
  const collection = asString(formData.get("collection"));
  const id = asString(formData.get("id"));
  const allowed = new Set(["news", "pages", "events", "dogs", "kennels", "litters", "healthResults", "documents", "gallery", "classifieds", "partners", "formTemplates"]);
  if (!allowed.has(collection) || !id) throw new Error("Záznam nelze smazat.");
  await removeDoc(collection, id);
  if (collection === "dogs") await removeDoc("dogsPrivate", id);
  await writeAudit({ actorUid: user.uid, actorEmail: user.email, action: "content_deleted", entity: collection, entityId: id, message: "Smazání" });
  revalidatePath("/", "layout");
}

export async function seedTemplatesAction() {
  const user = await requireAdmin();
  for (const template of seedFormTemplates) {
    const existing = await getTemplateBySlug(template.slug);
    if (existing) continue;
    await saveDoc("formTemplates", template.slug, template);
  }
  await writeAudit({ actorUid: user.uid, actorEmail: user.email, action: "content_saved", entity: "formTemplates", entityId: "seed", message: "Výchozí formuláře" });
  revalidatePath("/formulare");
  redirect("/sprava/formulare?ulozeno=1");
}

export async function reviewSubmissionAction(formData: FormData) {
  const user = await requireAdmin();
  const id = asString(formData.get("id"));
  const decision = asString(formData.get("decision"));
  if (!id) throw new Error("Podání neexistuje.");
  if (decision === "delete") {
    await removeDoc("formSubmissions", id);
    await writeAudit({ actorUid: user.uid, actorEmail: user.email, action: "content_deleted", entity: "formSubmissions", entityId: id, message: "Smazání podání" });
    revalidatePath("/sprava/podani");
    redirect("/sprava/podani");
  }
  if (decision !== "approve" && decision !== "respond" && decision !== "ignore") {
    throw new Error("Neznámá reakce.");
  }
  await reviewSubmission(user, id, decision, asString(formData.get("message")));
  revalidatePath("/sprava/podani");
  redirect(`/sprava/podani/${id}`);
}

export async function reviseSubmissionAction(formData: FormData) {
  const user = await requireAdmin();
  const id = await createRevision(user, asString(formData.get("id")));
  revalidatePath("/sprava/podani");
  redirect(`/sprava/podani/${id}`);
}

export async function setUserRoleAction(formData: FormData) {
  const actor = await requireSuperadmin();
  const targetUid = asString(formData.get("uid"));
  const nextRole = asString(formData.get("role")) as Role;
  const disabled = asBool(formData.get("disabled"));
  const decision = assertRoleChange({ actor, targetUid, nextRole });
  if (!decision.ok) throw new Error(decision.reason);
  const db = adminDb();
  const auth = adminAuth();
  if (!db || !auth) throw new Error("Firebase Admin není nakonfigurovaný.");
  const approved = nextRole === "admin" || nextRole === "superadmin";
  await db.collection("users").doc(targetUid).set(
    { role: nextRole, approved: approved && !disabled, disabled, updatedAt: new Date().toISOString() },
    { merge: true },
  );
  await auth.updateUser(targetUid, { disabled });
  const email = asString(formData.get("email"));
  const mail = approved && !disabled ? mailAdminApproved({ siteUrl: siteUrl() }) : mailAdminRejected({ siteUrl: siteUrl() });
  if (email) {
    const sent = await sendEmail({ to: email, subject: mail.subject, html: mail.html });
    await writeEmailLog({ to: email, subject: mail.subject, template: "admin-role", submissionId: targetUid, provider: sent.provider, ok: sent.ok });
  }
  await writeAudit({
    actorUid: actor.uid,
    actorEmail: actor.email,
    action: disabled ? "admin_deactivated" : approved ? "admin_approved" : "role_changed",
    entity: "users",
    entityId: targetUid,
    message: `${nextRole}`,
  });
  revalidatePath("/sprava/administrator");
}
