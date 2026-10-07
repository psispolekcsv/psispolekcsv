import "server-only";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

marked.setOptions({ gfm: true, breaks: true });

export function renderMarkdown(source: string) {
  const raw = marked.parse(source, { async: false }) as string;
  return sanitizeHtml(raw, {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, "h1", "h2", "img"],
    allowedAttributes: {
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          rel: "noopener noreferrer",
          target: attribs.href?.startsWith("http") ? "_blank" : attribs.target || "",
        },
      }),
    },
  });
}
