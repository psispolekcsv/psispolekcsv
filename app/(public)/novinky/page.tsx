import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/content/empty-state";
import { PageShell } from "@/components/layout/page-shell";
import { listNews } from "@/lib/server/data";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Novinky" };

export default async function NewsPage() {
  const news = await listNews(true);
  return (
    <PageShell title="Novinky" lead="Zprávy klubu. Archiv je stejný seznam, starší texty zůstávají dohledatelné." crumbs={[{ label: "Novinky" }]}>
      {news.length === 0 ? (
        <EmptyState title="Žádná zveřejněná novinka" text="Správa klubu tu publikuje oznámení. Dokud žádné není, seznam zůstane prázdný." />
      ) : (
        <ul className="space-y-4">
          {news.map((item) => (
            <li key={item.id}>
              <article className="rounded-lg border border-line bg-white p-5">
                <p className="text-xs uppercase tracking-[0.14em] text-ink/60">{formatDate(item.publishedAt)}{item.pinned ? " · připnuto" : ""}</p>
                <h2 className="mt-1 font-serif text-3xl">
                  <Link href={`/novinky/${item.slug}`}>{item.title}</Link>
                </h2>
                <p className="mt-2 text-ink/80">{item.excerpt}</p>
              </article>
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
