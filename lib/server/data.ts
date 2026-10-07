import "server-only";
import { adminDb } from "@/lib/firebase/admin";
import { fallbackPage } from "@/lib/content/defaults";
import {
  mapAudit,
  mapClassified,
  mapDocument,
  mapDog,
  mapDogPrivate,
  mapEvent,
  mapGallery,
  mapHealth,
  mapKennel,
  mapLitter,
  mapNews,
  mapPage,
  mapPartner,
  mapSettings,
  mapSubmission,
  mapTemplate,
  mapUser,
} from "@/lib/server/map";
import type { DocumentData } from "firebase-admin/firestore";

async function all(name: string) {
  const db = adminDb();
  if (!db) return [] as { id: string; data: DocumentData }[];
  const snap = await db.collection(name).limit(400).get();
  return snap.docs.map((doc) => ({ id: doc.id, data: doc.data() }));
}

export async function getSettings() {
  const db = adminDb();
  if (!db) return mapSettings(undefined);
  const snap = await db.collection("siteSettings").doc("general").get();
  return mapSettings(snap.data());
}

export async function saveSettings(data: Record<string, string>) {
  const db = adminDb();
  if (!db) throw new Error("Firebase Admin není nakonfigurovaný.");
  await db.collection("siteSettings").doc("general").set({ ...data, updatedAt: new Date().toISOString() }, { merge: true });
}

export async function getPage(slug: string) {
  const db = adminDb();
  if (db) {
    const snap = await db.collection("pages").doc(slug).get();
    if (snap.exists) {
      const page = mapPage(snap.id, snap.data() || {});
      if (page.published) return page;
    }
  }
  return fallbackPage(slug);
}

export async function listPagesAdmin() {
  const rows = await all("pages");
  return rows.map((row) => mapPage(row.id, row.data));
}

export async function savePage(slug: string, data: Record<string, unknown>) {
  const db = adminDb();
  if (!db) throw new Error("Firebase Admin není nakonfigurovaný.");
  await db.collection("pages").doc(slug).set({ ...data, slug, updatedAt: new Date().toISOString() }, { merge: true });
}

export async function listNews(publishedOnly = false) {
  const rows = (await all("news")).map((row) => mapNews(row.id, row.data));
  const filtered = publishedOnly ? rows.filter((item) => item.published) : rows;
  return filtered.sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.publishedAt.localeCompare(a.publishedAt));
}

export async function getNewsBySlug(slug: string) {
  const items = await listNews(true);
  return items.find((item) => item.slug === slug) || null;
}

export async function saveDoc(collection: string, id: string | null, data: Record<string, unknown>) {
  const db = adminDb();
  if (!db) throw new Error("Firebase Admin není nakonfigurovaný.");
  const ref = id ? db.collection(collection).doc(id) : db.collection(collection).doc();
  const now = new Date().toISOString();
  const existing = await ref.get();
  await ref.set(
    {
      ...data,
      createdAt: existing.exists ? existing.data()?.createdAt || now : now,
      updatedAt: now,
    },
    { merge: true },
  );
  return ref.id;
}

export async function removeDoc(collection: string, id: string) {
  const db = adminDb();
  if (!db) throw new Error("Firebase Admin není nakonfigurovaný.");
  await db.collection(collection).doc(id).delete();
}

export async function listEvents() {
  const rows = (await all("events")).map((row) => mapEvent(row.id, row.data));
  return rows.sort((a, b) => a.startDate.localeCompare(b.startDate));
}

export async function listDocuments() {
  return (await all("documents")).map((row) => mapDocument(row.id, row.data)).sort((a, b) => a.title.localeCompare(b.title, "cs"));
}

export async function listDogs() {
  return (await all("dogs")).map((row) => mapDog(row.id, row.data)).sort((a, b) => a.name.localeCompare(b.name, "cs"));
}

export async function getDog(id: string) {
  const db = adminDb();
  if (!db) return null;
  const snap = await db.collection("dogs").doc(id).get();
  if (!snap.exists) return null;
  const dog = mapDog(snap.id, snap.data() || {});
  return dog.published ? dog : null;
}

export async function getDogAdmin(id: string) {
  const db = adminDb();
  if (!db) return null;
  const snap = await db.collection("dogs").doc(id).get();
  if (!snap.exists) return null;
  const privateSnap = await db.collection("dogsPrivate").doc(id).get();
  const privateChip = String(privateSnap.data()?.chip || "");
  return {
    dog: mapDog(snap.id, snap.data() || {}),
    rawChip: String(snap.data()?.chip || privateChip),
    publishChip: snap.data()?.publishChip === true,
    privateData: privateSnap.exists ? mapDogPrivate(id, privateSnap.data() || {}) : mapDogPrivate(id, {}),
  };
}

export async function listKennels() {
  return (await all("kennels")).map((row) => mapKennel(row.id, row.data)).sort((a, b) => a.name.localeCompare(b.name, "cs"));
}

export async function listLitters() {
  return (await all("litters")).map((row) => mapLitter(row.id, row.data)).sort((a, b) => b.birthDate.localeCompare(a.birthDate) || b.matingDate.localeCompare(a.matingDate));
}

export async function listHealth() {
  return (await all("healthResults")).map((row) => mapHealth(row.id, row.data)).sort((a, b) => b.examinedAt.localeCompare(a.examinedAt));
}

export async function listPartners() {
  return (await all("partners")).map((row) => mapPartner(row.id, row.data)).sort((a, b) => a.order - b.order || a.name.localeCompare(b.name, "cs"));
}

export async function listGallery() {
  return (await all("gallery")).map((row) => mapGallery(row.id, row.data)).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function listClassifieds() {
  return (await all("classifieds")).map((row) => mapClassified(row.id, row.data)).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function listTemplates() {
  return (await all("formTemplates")).map((row) => mapTemplate(row.id, row.data)).sort((a, b) => a.title.localeCompare(b.title, "cs"));
}

export async function getTemplateBySlug(slug: string) {
  const items = await listTemplates();
  return items.find((item) => item.slug === slug) || null;
}

export async function listSubmissions() {
  return (await all("formSubmissions")).map((row) => mapSubmission(row.id, row.data)).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getSubmission(id: string) {
  const db = adminDb();
  if (!db) return null;
  const snap = await db.collection("formSubmissions").doc(id).get();
  if (!snap.exists) return null;
  return mapSubmission(snap.id, snap.data() || {});
}

export async function listUsers() {
  return (await all("users")).map((row) => mapUser(row.id, row.data)).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function listAuditLogs() {
  const rows = await all("auditLogs");
  return rows.map((row) => mapAudit(row.id, row.data)).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 200);
}

export async function dashboardCounts() {
  const [dogs, kennels, litters, submissions, users, events] = await Promise.all([
    listDogs(),
    listKennels(),
    listLitters(),
    listSubmissions(),
    listUsers(),
    listEvents(),
  ]);
  const now = new Date().toISOString();
  return {
    dogs: dogs.filter((item) => item.published).length,
    kennels: kennels.filter((item) => item.published).length,
    litters: litters.filter((item) => item.published && item.status !== "archived").length,
    pendingForms: submissions.filter((item) => item.status.startsWith("awaiting") || item.status === "submitted").length,
    pendingAdmins: users.filter((item) => item.role === "pending" && !item.disabled).length,
    upcoming: events.filter((item) => item.published && item.startDate >= now.slice(0, 10)).length,
  };
}
