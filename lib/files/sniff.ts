const MAX_IMAGE = 8 * 1024 * 1024;
const MAX_DOC = 12 * 1024 * 1024;

export function detectFileType(bytes: Uint8Array) {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return "image/png";
  }
  if (
    bytes.length >= 12 &&
    String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]) === "RIFF" &&
    String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11]) === "WEBP"
  ) {
    return "image/webp";
  }
  if (bytes.length >= 5 && String.fromCharCode(...bytes.slice(0, 5)) === "%PDF-") return "application/pdf";
  return null;
}

export function assertUpload(file: File, kind: "image" | "document") {
  const limit = kind === "image" ? MAX_IMAGE : MAX_DOC;
  if (file.size <= 0 || file.size > limit) {
    throw new Error(kind === "image" ? "Fotografie může mít nejvýše 8 MB." : "Soubor může mít nejvýše 12 MB.");
  }
  return limit;
}

export async function readVerifiedFile(file: File, kind: "image" | "document") {
  assertUpload(file, kind);
  const bytes = new Uint8Array(await file.arrayBuffer());
  const type = detectFileType(bytes);
  const allowed = kind === "image" ? ["image/jpeg", "image/png", "image/webp"] : ["image/jpeg", "image/png", "image/webp", "application/pdf"];
  if (!type || !allowed.includes(type)) {
    throw new Error("Povolené jsou jen JPG, PNG, WEBP a u dokumentů také PDF.");
  }
  return { bytes, type, name: file.name.slice(0, 120) };
}
