import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarkdownView } from "@/components/content/markdown-view";
import { PageShell } from "@/components/layout/page-shell";
import { renderMarkdown } from "@/lib/content/render";
import { getNewsBySlug } from "@/lib/server/data";
import { formatDate, mediaUrl, siteUrl } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article) return { title: "Novinka" };
  return { title: article.title, description: article.excerpt, alternates: { canonical: `/novinky/${article.slug}` } };
}

export default async function NewsDetail({ params }: Props) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article) notFound();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    datePublished: article.publishedAt,
    author: article.author || "Klub československého vlčáka",
    mainEntityOfPage: `${siteUrl()}/novinky/${article.slug}`,
  };
  return (
    <PageShell title={article.title} lead={article.excerpt} crumbs={[{ href: "/novinky", label: "Novinky" }, { label: article.title }]}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className="mb-6 text-sm text-ink/60">{formatDate(article.publishedAt)}{article.author ? ` · ${article.author}` : ""}</p>
      {article.coverImage ? <img src={mediaUrl(article.coverImage)} alt="" className="mb-6 max-h-96 w-full rounded-lg object-cover" /> : null}
      <MarkdownView html={renderMarkdown(article.content)} />
    </PageShell>
  );
}
