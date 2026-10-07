import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import { DynamicForm } from "@/components/forms/dynamic-form";
import { PageShell } from "@/components/layout/page-shell";
import { listDogs, getTemplateBySlug } from "@/lib/server/data";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const template = await getTemplateBySlug(slug);
  return { title: template?.title || "Formulář", description: template?.description };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const template = await getTemplateBySlug(slug);
  if (!template || !template.active) notFound();
  const dogs = (await listDogs()).filter((dog) => dog.published).map((dog) => ({ id: dog.id, name: dog.name }));
  return (
    <PageShell title={template.title} lead={template.description} crumbs={[{ href: "/formulare", label: "Formuláře" }, { label: template.title }]}>
      {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ? <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer /> : null}
      <DynamicForm template={template} dogs={dogs} />
    </PageShell>
  );
}
