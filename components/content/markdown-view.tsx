export function MarkdownView({ html }: { html: string }) {
  return <div className="prose-club" dangerouslySetInnerHTML={{ __html: html }} />;
}
