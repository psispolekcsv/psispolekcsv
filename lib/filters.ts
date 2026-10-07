import type { DogPublic } from "@/types/domain";

export function textParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] || "" : value || "";
}

export function pageParam(value: string | string[] | undefined) {
  const parsed = Number(textParam(value) || "1");
  if (!Number.isFinite(parsed) || parsed < 1) return 1;
  return Math.floor(parsed);
}

export function filterDogs(
  dogs: DogPublic[],
  filters: { q?: string; sex?: string; breeding?: string; year?: string; exams?: boolean },
) {
  const q = (filters.q || "").trim().toLocaleLowerCase("cs");
  return dogs.filter((dog) => {
    if (!dog.published) return false;
    if (filters.sex && dog.sex !== filters.sex) return false;
    if (filters.breeding && dog.breedingStatus !== filters.breeding) return false;
    if (filters.year && !dog.birthDate.startsWith(filters.year)) return false;
    if (filters.exams && dog.exams.length === 0) return false;
    if (!q) return true;
    const haystack = [dog.name, dog.kennelName, dog.registrationNumber, dog.titles.join(" ")].join(" ").toLocaleLowerCase("cs");
    return haystack.includes(q);
  });
}

export function slicePage<T>(items: T[], page: number, size = 24) {
  const pages = Math.max(1, Math.ceil(items.length / size));
  const current = Math.min(page, pages);
  const start = (current - 1) * size;
  return { items: items.slice(start, start + size), page: current, pages, total: items.length };
}
