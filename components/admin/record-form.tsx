"use client";

import { useActionState } from "react";
import { saveAdminRecord, type ActionState } from "@/app/sprava/(panel)/actions";

export interface EditorField {
  name: string;
  label: string;
  type?: "text" | "textarea" | "email" | "date" | "number" | "select" | "checkbox" | "file";
  options?: { value: string; label: string }[];
  required?: boolean;
  help?: string;
}

export function RecordForm({
  kind,
  id,
  fields,
  defaults = {},
  fileName,
}: {
  kind: string;
  id?: string;
  fields: EditorField[];
  defaults?: Record<string, string>;
  fileName?: string;
}) {
  const [state, action, pending] = useActionState(saveAdminRecord, null as ActionState);
  return (
    <form action={action} className="grid gap-4 rounded-lg border border-line bg-white p-4">
      <input type="hidden" name="kind" value={kind} />
      {id ? <input type="hidden" name="id" value={id} /> : null}
      {fields.map((field) => {
        const type = field.type || "text";
        if (type === "checkbox") {
          return (
            <label key={field.name} className="flex items-center gap-2 text-sm font-semibold">
              <input type="checkbox" name={field.name} defaultChecked={defaults[field.name] === "true"} />
              {field.label}
            </label>
          );
        }
        return (
          <label key={field.name} className="text-sm font-semibold">
            {field.label}
            {type === "textarea" ? (
              <textarea name={field.name} required={field.required} rows={field.name === "content" || field.name === "description" ? 8 : 3} defaultValue={defaults[field.name] || ""} className="mt-1 w-full rounded-md border border-line px-3 py-2 font-normal" />
            ) : type === "select" ? (
              <select name={field.name} defaultValue={defaults[field.name] || field.options?.[0]?.value || ""} className="mt-1 w-full rounded-md border border-line px-3 py-2 font-normal">
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            ) : type === "file" ? (
              <input name={field.name} type="file" className="mt-1 block font-normal" />
            ) : (
              <input name={field.name} type={type} required={field.required} defaultValue={defaults[field.name] || ""} className="mt-1 w-full rounded-md border border-line px-3 py-2 font-normal" />
            )}
            {field.help ? <span className="mt-1 block font-normal text-ink/60">{field.help}</span> : null}
          </label>
        );
      })}
      {fileName ? <input type="file" name={fileName} className="text-sm" /> : null}
      {state?.error ? <p role="alert" className="text-sm text-danger">{state.error}</p> : null}
      <button disabled={pending} className="w-fit rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white">
        {pending ? "Ukládám…" : "Uložit"}
      </button>
    </form>
  );
}
