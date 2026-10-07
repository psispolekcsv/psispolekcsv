"use client";

import { useState } from "react";
import { sortedFields } from "@/lib/forms/fields";
import type { FormTemplate } from "@/types/domain";

export function DynamicForm({ template, dogs }: { template: FormTemplate; dogs: { id: string; name: string }[] }) {
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const fields = sortedFields(template.fields);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    setErrors({});
    const form = event.currentTarget;
    const response = await fetch("/api/forms/submit", { method: "POST", body: new FormData(form) });
    const data = (await response.json()) as { ok?: boolean; message?: string; errors?: Record<string, string>; confirmation?: string };
    setPending(false);
    if (!response.ok || !data.ok) {
      setErrors(data.errors || {});
      setMessage(data.message || "Podání se nepodařilo odeslat.");
      return;
    }
    form.reset();
    setMessage(data.confirmation || "Podání jsme přijali. Zkontrolujte e-mail.");
  }

  return (
    <form onSubmit={onSubmit} className="grid max-w-2xl gap-5" noValidate>
      <input type="hidden" name="slug" value={template.slug} />
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label>
          Webová stránka
          <input name="company_website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {fields.map((field) => {
        const error = errors[field.id];
        const describedBy = error ? `${field.id}-chyba` : field.description ? `${field.id}-popis` : undefined;
        const common = {
          id: field.id,
          name: field.id,
          required: field.required,
          placeholder: field.placeholder || undefined,
          "aria-invalid": Boolean(error) || undefined,
          "aria-describedby": describedBy,
          className: "mt-1 w-full rounded-md border border-line bg-white px-3 py-2",
        };
        return (
          <div key={field.id}>
            {field.type === "consent" ? null : (
              <label htmlFor={field.id} className="text-sm font-semibold">
                {field.label}
                {field.required ? <span className="text-amber-deep"> *</span> : null}
              </label>
            )}
            {field.description ? (
              <p id={`${field.id}-popis`} className="mt-1 text-sm text-ink/70">
                {field.description}
              </p>
            ) : null}
            {field.type === "textarea" ? <textarea {...common} rows={5} /> : null}
            {field.type === "select" || field.type === "dog" ? (
              <select {...common} defaultValue="">
                <option value="">Vyberte</option>
                {(field.type === "dog" ? dogs.map((dog) => ({ value: dog.id, label: dog.name })) : field.options).map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : null}
            {field.type === "radio" ? (
              <div className="mt-2 space-y-2" role="radiogroup" aria-labelledby={field.id}>
                {field.options.map((option) => (
                  <label key={option.value} className="flex items-center gap-2 text-sm">
                    <input type="radio" name={field.id} value={option.value} required={field.required} />
                    {option.label}
                  </label>
                ))}
              </div>
            ) : null}
            {field.type === "checkbox" || field.type === "consent" ? (
              <label className="mt-2 flex items-start gap-2 text-sm">
                <input id={field.id} name={field.id} type="checkbox" required={field.required} className="mt-1" />
                <span>{field.type === "consent" ? field.label : "Ano"}</span>
              </label>
            ) : null}
            {field.type === "file" || field.type === "photo" ? (
              <input id={field.id} name={`file__${field.id}`} type="file" accept={field.type === "photo" ? "image/jpeg,image/png,image/webp" : "image/jpeg,image/png,image/webp,application/pdf"} className="mt-2 block text-sm" />
            ) : null}
            {["text", "email", "tel", "number", "date"].includes(field.type) ? (
              <input {...common} type={field.type === "tel" ? "tel" : field.type} />
            ) : null}
            {error ? (
              <p id={`${field.id}-chyba`} role="alert" className="mt-1 text-sm text-danger">
                {error}
              </p>
            ) : null}
          </div>
        );
      })}
      {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ? (
        <div className="cf-turnstile" data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} />
      ) : null}
      {message ? <p role="status" className="rounded-md bg-mist px-3 py-2 text-sm">{message}</p> : null}
      <button type="submit" disabled={pending} className="w-fit rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
        {pending ? "Odesílám…" : "Odeslat podání"}
      </button>
    </form>
  );
}
