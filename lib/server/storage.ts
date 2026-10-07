import "server-only";
import { randomBytes } from "crypto";
import { adminBucket } from "@/lib/firebase/admin";

export async function saveBuffer(path: string, bytes: Uint8Array, contentType: string) {
  const bucket = adminBucket();
  if (!bucket) throw new Error("Úložiště Firebase není nakonfigurované.");
  await bucket.file(path).save(Buffer.from(bytes), {
    resumable: false,
    metadata: { contentType, cacheControl: "public, max-age=86400" },
  });
  return path;
}

export function storageId() {
  return randomBytes(9).toString("base64url");
}

export async function readBuffer(path: string) {
  const bucket = adminBucket();
  if (!bucket) return null;
  const file = bucket.file(path);
  const [exists] = await file.exists();
  if (!exists) return null;
  const [bytes] = await file.download();
  const [metadata] = await file.getMetadata();
  return { bytes, contentType: metadata.contentType || "application/octet-stream" };
}
