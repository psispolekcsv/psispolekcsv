import { MarkdownView } from "@/components/content/markdown-view";
import { PageShell } from "@/components/layout/page-shell";
import { renderMarkdown } from "@/lib/content/render";
import { getPage } from "@/lib/server/data";

export async function CmsScreen({
  slug,
  crumbs,
  extra,
}: {
  slug: string;
  crumbs: { href?: string; label: string }[];
  extra?: React.ReactNode;
}) {
  const page = await getPage(slug);
  if (!page) {
    return (
      <PageShell title="Stránka není k dispozici" crumbs={crumbs}>
        <p>Tento text správa klubu ještě nezveřejnila.</p>
      </PageShell>
    );
  }
  return (
    <PageShell title={page.title} lead={page.description} crumbs={crumbs}>
      {extra}
      <MarkdownView html={renderMarkdown(page.content)} />
    </PageShell>
  );
}
