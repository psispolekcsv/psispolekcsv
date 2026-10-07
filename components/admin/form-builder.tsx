"use client";

import { useActionState, useState } from "react";
import { saveAdminRecord, type ActionState } from "@/app/sprava/(panel)/actions";
import { fieldTypeLabel } from "@/lib/labels";
import type { FormField, FormTemplate } from "@/types/domain";

const types = Object.entries(fieldTypeLabel);

function emptyField(order: number): FormField {
  return { id: `pole_${order}`, type: "text", label: "", description: "", placeholder: "", required: false, order, options: [] };
}

export function FormBuilder({ template }: { template?: FormTemplate | null }) {
  const [fields, setFields] = useState<FormField[]>(template?.fields?.length ? template.fields : [emptyField(1)]);
  const [state, action, pending] = useActionState(saveAdminRecord, null as ActionState);

  function update(index: number, patch: Partial<FormField>) {
    setFields((current) => current.map((field, i) => (i === index ? { ...field, ...patch } : field)));
  }

  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="kind" value="template" />
      <input type="hidden" name="fieldsJson" value={JSON.stringify(fields)} />
      <label className="text-sm font-semibold">Název<input name="title" required defaultValue={template?.title || ""} className="mt-1 w-full rounded-md border border-line px-3 py-2 font-normal" /></label>
      <label className="text-sm font-semibold">Adresa<input name="slug" defaultValue={template?.slug || ""} className="mt-1 w-full rounded-md border border-line px-3 py-2 font-normal" /></label>
      <label className="text-sm font-semibold">Popis<textarea name="description" rows={3} defaultValue={template?.description || ""} className="mt-1 w-full rounded-md border border-line px-3 py-2 font-normal" /></label>
      <label className="text-sm font-semibold">
        Schvalování
        <select name="approvalType" defaultValue={template?.approvalType || "single"} className="mt-1 w-full rounded-md border border-line px-3 py-2 font-normal">
          <option value="none">Bez potvrzení, jen záznam</option>
          <option value="single">Potvrzení jedné osoby</option>
          <option value="dual">Potvrzení dvou osob</option>
        </select>
      </label>
      <label className="text-sm font-semibold">Text po odeslání<textarea name="confirmationText" rows={2} defaultValue={template?.confirmationText || ""} className="mt-1 w-full rounded-md border border-line px-3 py-2 font-normal" /></label>
      <label className="text-sm font-semibold">E-maily správy, oddělené čárkou<input name="notificationEmails" defaultValue={template?.notificationEmails.join(", ") || ""} className="mt-1 w-full rounded-md border border-line px-3 py-2 font-normal" /></label>
      <label className="text-sm font-semibold">Spustit od<input name="startsAt" type="date" defaultValue={template?.startsAt?.slice(0, 10) || ""} className="mt-1 w-full rounded-md border border-line px-3 py-2 font-normal" /></label>
      <label className="text-sm font-semibold">Ukončit<input name="endsAt" type="date" defaultValue={template?.endsAt?.slice(0, 10) || ""} className="mt-1 w-full rounded-md border border-line px-3 py-2 font-normal" /></label>
      <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" name="active" defaultChecked={template ? template.active : true} /> Aktivní</label>

      <div className="space-y-3">
        {fields.map((field, index) => (
          <fieldset key={`${field.id}-${index}`} className="rounded-lg border border-line p-3">
            <legend className="px-1 text-sm font-semibold">Pole {index + 1}</legend>
            <div className="grid gap-2 md:grid-cols-2">
              <label className="text-sm">Popisek<input value={field.label} onChange={(event) => update(index, { label: event.target.value })} className="mt-1 w-full rounded-md border border-line px-2 py-1" /></label>
              <label className="text-sm">Technické ID<input value={field.id} onChange={(event) => update(index, { id: event.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "") })} className="mt-1 w-full rounded-md border border-line px-2 py-1" /></label>
              <label className="text-sm">Typ
                <select value={field.type} onChange={(event) => update(index, { type: event.target.value as FormField["type"] })} className="mt-1 w-full rounded-md border border-line px-2 py-1">
                  {types.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </label>
              <label className="text-sm">Pořadí<input type="number" value={field.order} onChange={(event) => update(index, { order: Number(event.target.value) })} className="mt-1 w-full rounded-md border border-line px-2 py-1" /></label>
              <label className="text-sm">Vazba
                <select value={field.binding || ""} onChange={(event) => update(index, { binding: (event.target.value || undefined) as FormField["binding"] })} className="mt-1 w-full rounded-md border border-line px-2 py-1">
                  <option value="">Žádná</option>
                  <option value="party_a_name">Jméno první osoby</option>
                  <option value="party_a_email">E-mail první osoby</option>
                  <option value="party_b_name">Jméno druhé osoby</option>
                  <option value="party_b_email">E-mail druhé osoby</option>
                </select>
              </label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={field.required} onChange={(event) => update(index, { required: event.target.checked })} /> Povinné</label>
              <label className="text-sm md:col-span-2">Nápověda<input value={field.description} onChange={(event) => update(index, { description: event.target.value })} className="mt-1 w-full rounded-md border border-line px-2 py-1" /></label>
              {(field.type === "select" || field.type === "radio") ? (
                <label className="text-sm md:col-span-2">Možnosti, každá na řádek jako hodnota|text
                  <textarea
                    rows={3}
                    value={field.options.map((option) => `${option.value}|${option.label}`).join("\n")}
                    onChange={(event) => update(index, { options: event.target.value.split("\n").map((line) => line.trim()).filter(Boolean).map((line) => {
                      const [value, label] = line.split("|");
                      return { value: (value || "").trim(), label: (label || value || "").trim() };
                    }) })}
                    className="mt-1 w-full rounded-md border border-line px-2 py-1"
                  />
                </label>
              ) : null}
            </div>
            <button type="button" className="mt-2 text-sm text-danger" onClick={() => setFields((current) => current.filter((_, i) => i !== index))}>Odebrat pole</button>
          </fieldset>
        ))}
      </div>
      <button type="button" className="w-fit rounded-md border border-line px-3 py-2 text-sm" onClick={() => setFields((current) => [...current, emptyField(current.length + 1)])}>Přidat pole</button>
      {state?.error ? <p role="alert" className="text-sm text-danger">{state.error}</p> : null}
      <button disabled={pending} className="w-fit rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white">{pending ? "Ukládám…" : "Uložit formulář"}</button>
    </form>
  );
}
