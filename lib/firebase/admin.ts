import "server-only";
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

let cached: App | null | undefined;

export function getAdminApp() {
  if (cached !== undefined) return cached;
  const existing = getApps()[0];
  if (existing) {
    cached = existing;
    return cached;
  }
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (!raw) {
    cached = null;
    return null;
  }
  try {
    const json = JSON.parse(raw) as { client_email?: string; private_key?: string; project_id?: string };
    if (!json.client_email || !json.private_key) {
      cached = null;
      return null;
    }
    cached = initializeApp({
      credential: cert({
        projectId: json.project_id,
        clientEmail: json.client_email,
        privateKey: json.private_key,
      }),
      projectId: json.project_id || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
    return cached;
  } catch (error) {
    console.error("Firebase Admin se nepodařilo spustit.", error);
    cached = null;
    return null;
  }
}

export function adminDb() {
  const app = getAdminApp();
  return app ? getFirestore(app) : null;
}

export function adminAuth() {
  const app = getAdminApp();
  return app ? getAuth(app) : null;
}

export function adminBucket() {
  const app = getAdminApp();
  return app ? getStorage(app).bucket() : null;
}

export function adminConfigured() {
  return Boolean(getAdminApp());
}
