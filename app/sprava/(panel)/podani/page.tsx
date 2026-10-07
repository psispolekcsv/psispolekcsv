import Link from "next/link";
import { submissionStatusLabel } from "@/lib/labels";
import { listSubmissions } from "@/lib/server/data";
import { formatDateTime } from "@/lib/utils";

export default async function Page() {
  const items = await listSubmissions();
  return (
    <div>
      <h1 className="font-serif text-4xl">Podání</h1>
      <div className="mt-5 overflow-x-auto rounded-lg border border-line bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-mist/70 text-xs uppercase">
            <tr>
              <th className="px-3 py-3">Formulář</th>
              <th className="px-3 py-3">Stav</th>
              <th className="px-3 py-3">Vytvořeno</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? <tr><td className="px-3 py-4" colSpan={3}>Žádné podání.</td></tr> : null}
            {items.map((item) => (
              <tr key={item.id} className="border-t border-line">
                <td className="px-3 py-3"><Link href={`/sprava/podani/${item.id}`} className="font-semibold">{item.formTitle}</Link><p className="text-xs text-ink/60">{item.id}</p></td>
                <td className="px-3 py-3">{submissionStatusLabel[item.status]}</td>
                <td className="px-3 py-3">{formatDateTime(item.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
