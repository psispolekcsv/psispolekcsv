import { requireSuperadmin } from "@/lib/server/session";
import { listAuditLogs } from "@/lib/server/data";
import { formatDateTime } from "@/lib/utils";

export default async function Page() {
  await requireSuperadmin();
  const logs = await listAuditLogs();
  return (
    <div>
      <h1 className="font-serif text-4xl">Audit</h1>
      <p className="mt-2 text-sm text-ink/70">Záznamy zapisuje jen server. Upravovat je nelze.</p>
      <ul className="mt-5 divide-y divide-line rounded-lg border border-line bg-white">
        {logs.length === 0 ? <li className="px-4 py-4 text-sm">Zatím prázdné.</li> : null}
        {logs.map((item) => (
          <li key={item.id} className="px-4 py-3 text-sm">
            <p className="font-semibold">{item.action}</p>
            <p className="text-ink/70">{formatDateTime(item.createdAt)} · {item.actorEmail} · {item.entity} {item.entityId}</p>
            <p>{item.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
