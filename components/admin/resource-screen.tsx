import Link from "next/link";
import { deleteAdminRecord } from "@/app/sprava/(panel)/actions";
import { RecordForm, type EditorField } from "@/components/admin/record-form";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";

export function ResourceScreen({
  title,
  kind,
  collection,
  fields,
  items,
  defaults,
  editId,
  intro,
  fileName,
}: {
  title: string;
  kind: string;
  collection: string;
  fields: EditorField[];
  items: { id: string; title: string; meta?: string }[];
  defaults?: Record<string, string>;
  editId?: string;
  intro?: string;
  fileName?: string;
}) {
  return (
    <div className="grid gap-8 xl:grid-cols-[1fr_0.9fr]">
      <section>
        <h1 className="font-serif text-4xl text-ink-deep">{title}</h1>
        {intro ? <p className="mt-2 max-w-xl text-sm text-ink/70">{intro}</p> : null}
        <ul className="mt-5 divide-y divide-line rounded-lg border border-line bg-white">
          {items.length === 0 ? <li className="px-4 py-6 text-sm text-ink/70">Zatím tu nic není.</li> : null}
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div>
                <Link href={`?id=${item.id}`} className="font-semibold">{item.title || "Bez názvu"}</Link>
                {item.meta ? <p className="text-xs text-ink/60">{item.meta}</p> : null}
              </div>
              <ConfirmSubmit action={deleteAdminRecord} id={item.id} collection={collection} label="Smazat" message="Opravdu smazat tento záznam?" />
            </li>
          ))}
        </ul>
      </section>
      <RecordForm kind={kind} id={editId} fields={fields} defaults={defaults} fileName={fileName} />
    </div>
  );
}
