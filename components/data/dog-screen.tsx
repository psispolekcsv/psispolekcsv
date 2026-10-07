import { DogFilters, DogTable } from "@/components/data/collections";
import { PageShell } from "@/components/layout/page-shell";
import { filterDogs, pageParam, slicePage, textParam } from "@/lib/filters";
import { listDogs } from "@/lib/server/data";

export async function DogScreen({
  title,
  lead,
  crumbs,
  searchParams,
  preset = {},
}: {
  title: string;
  lead: string;
  crumbs: { label: string }[];
  searchParams: Promise<Record<string, string | string[] | undefined>>;
  preset?: { sex?: string; breeding?: string; exams?: boolean };
}) {
  const params = await searchParams;
  const filters = {
    q: textParam(params.q),
    sex: preset.sex || textParam(params.sex),
    breeding: preset.breeding || textParam(params.breeding),
    year: textParam(params.year),
    exams: preset.exams,
  };
  const filtered = filterDogs(await listDogs(), filters);
  const paged = slicePage(filtered, pageParam(params.strana));
  return (
    <PageShell title={title} lead={lead} crumbs={crumbs}>
      <DogFilters values={filters} />
      <DogTable dogs={paged.items} />
      <p className="mt-4 text-sm text-ink/70">
        Zobrazeno {paged.items.length} z {paged.total}. Strana {paged.page}/{paged.pages}.
      </p>
    </PageShell>
  );
}
