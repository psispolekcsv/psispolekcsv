import Link from "next/link";
import { dashboardCounts, listAuditLogs, listEvents, listSubmissions, listUsers } from "@/lib/server/data";
import { formatDate } from "@/lib/utils";
import { submissionStatusLabel } from "@/lib/labels";
import { adminConfigured } from "@/lib/firebase/admin";

export default async function DashboardPage() {
  const ready = adminConfigured();
  const counts = ready ? await dashboardCounts() : null;
  const submissions = ready ? (await listSubmissions()).slice(0, 5) : [];
  const users = ready ? (await listUsers()).filter((user) => user.role === "pending").slice(0, 5) : [];
  const events = ready ? (await listEvents()).filter((event) => event.published).slice(0, 4) : [];
  const audit = ready ? (await listAuditLogs()).slice(0, 6) : [];
  const cards = counts
    ? [
        ["Nová podání", counts.pendingForms, "/sprava/podani"],
        ["Účty ke schválení", counts.pendingAdmins, "/sprava/administrator"],
        ["Nejbližší akce", counts.upcoming, "/sprava/akce"],
        ["Psi", counts.dogs, "/sprava/psi"],
        ["Stanice", counts.kennels, "/sprava/stanice"],
        ["Aktivní vrhy", counts.litters, "/sprava/vrhy"],
      ]
    : [];

  return (
    <div>
      <h1 className="font-serif text-4xl text-ink-deep">Přehled</h1>
      {!ready ? (
        <p className="mt-4 max-w-2xl rounded-lg bg-white p-4 text-sm">
          Server Firebase ještě není připojený. Doplňte `FIREBASE_SERVICE_ACCOUNT_JSON` podle README. Veřejný web funguje s výchozími texty, zápis do databáze až po tomto kroku.
        </p>
      ) : null}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map(([label, value, href]) => (
          <Link key={String(label)} href={String(href)} className="rounded-lg bg-white px-4 py-5">
            <p className="text-sm text-ink/70">{label}</p>
            <p className="mt-1 font-serif text-4xl">{value}</p>
          </Link>
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg bg-white p-4">
          <h2 className="font-serif text-2xl">Poslední podání</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {submissions.length === 0 ? <li>Žádné podání.</li> : submissions.map((item) => (
              <li key={item.id}><Link href={`/sprava/podani/${item.id}`}>{item.formTitle}</Link> · {submissionStatusLabel[item.status]}</li>
            ))}
          </ul>
        </section>
        <section className="rounded-lg bg-white p-4">
          <h2 className="font-serif text-2xl">Čekající účty</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {users.length === 0 ? <li>Nikdo nečeká.</li> : users.map((user) => <li key={user.uid}>{user.email}</li>)}
          </ul>
        </section>
        <section className="rounded-lg bg-white p-4">
          <h2 className="font-serif text-2xl">Akce</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {events.length === 0 ? <li>Žádná zveřejněná akce.</li> : events.map((event) => <li key={event.id}>{formatDate(event.startDate)} · {event.title}</li>)}
          </ul>
        </section>
        <section className="rounded-lg bg-white p-4">
          <h2 className="font-serif text-2xl">Poslední změny</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {audit.length === 0 ? <li>Audit je prázdný.</li> : audit.map((item) => <li key={item.id}>{formatDate(item.createdAt)} · {item.message}</li>)}
          </ul>
        </section>
      </div>
    </div>
  );
}
