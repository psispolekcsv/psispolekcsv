import Link from "next/link";
import { seedTemplatesAction } from "@/app/sprava/(panel)/actions";
import { textParam } from "@/lib/filters";
import { listTemplates } from "@/lib/server/data";
import { FormBuilder } from "@/components/admin/form-builder";

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const id = textParam((await searchParams).id);
  const templates = await listTemplates();
  const current = templates.find((item) => item.id === id || item.slug === id) || null;
  return (
    <div className="grid gap-8 xl:grid-cols-[0.8fr_1.2fr]">
      <section>
        <h1 className="font-serif text-4xl">Formuláře</h1>
        <form action={seedTemplatesAction} className="mt-4">
          <button className="rounded-md border border-ink px-3 py-2 text-sm font-semibold">Doplnit výchozí formuláře</button>
        </form>
        <ul className="mt-4 divide-y divide-line rounded-lg border border-line bg-white">
          {templates.length === 0 ? <li className="px-4 py-4 text-sm">Zatím žádná šablona.</li> : null}
          {templates.map((item) => (
            <li key={item.id} className="px-4 py-3">
              <Link href={`?id=${item.slug}`} className="font-semibold">{item.title}</Link>
              <p className="text-xs text-ink/60">{item.active ? "aktivní" : "vypnutý"} · {item.approvalType}</p>
            </li>
          ))}
        </ul>
      </section>
      <FormBuilder template={current} />
    </div>
  );
}
