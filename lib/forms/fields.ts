import { z } from "zod";
import type { FormField } from "@/types/domain";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const formFieldSchema = z.object({
  id: z.string().trim().min(1).max(64).regex(/^[a-z0-9_-]+$/),
  type: z.enum([
    "text",
    "textarea",
    "email",
    "tel",
    "number",
    "date",
    "select",
    "radio",
    "checkbox",
    "consent",
    "file",
    "photo",
    "dog",
  ]),
  label: z.string().trim().min(1).max(160),
  description: z.string().max(500).optional().default(""),
  placeholder: z.string().max(160).optional().default(""),
  required: z.boolean(),
  order: z.number().int(),
  options: z
    .array(z.object({ value: z.string().trim().min(1).max(80), label: z.string().trim().min(1).max(160) }))
    .optional()
    .default([]),
  validation: z
    .object({
      min: z.number().optional(),
      max: z.number().optional(),
      minLength: z.number().int().nonnegative().optional(),
      maxLength: z.number().int().positive().optional(),
    })
    .optional(),
  binding: z.enum(["party_a_name", "party_a_email", "party_b_name", "party_b_email"]).optional(),
});

export const formTemplateInputSchema = z
  .object({
    title: z.string().trim().min(2).max(160),
    slug: z.string().trim().min(2).max(80).regex(/^[a-z0-9-]+$/),
    description: z.string().max(4000).default(""),
    active: z.boolean(),
    startsAt: z.string().default(""),
    endsAt: z.string().default(""),
    confirmationText: z.string().max(2000).default(""),
    approvalType: z.enum(["none", "single", "dual"]),
    notificationEmails: z.array(z.string().trim().regex(emailPattern)).max(10),
    fields: z.array(formFieldSchema).min(1).max(40),
  })
  .superRefine((value, ctx) => {
    const ids = new Set<string>();
    for (const field of value.fields) {
      if (ids.has(field.id)) {
        ctx.addIssue({ code: "custom", message: `Duplicitní pole ${field.id}.`, path: ["fields"] });
      }
      ids.add(field.id);
      if ((field.type === "select" || field.type === "radio") && field.options.length < 2) {
        ctx.addIssue({
          code: "custom",
          message: `Pole ${field.label} potřebuje alespoň dvě možnosti.`,
          path: ["fields"],
        });
      }
    }
    if (value.approvalType === "dual" && !value.fields.some((field) => field.binding === "party_b_email")) {
      ctx.addIssue({
        code: "custom",
        message: "Oboustranný formulář musí mít pole s vazbou na e-mail druhé osoby.",
        path: ["fields"],
      });
    }
    if (value.approvalType !== "none" && !value.fields.some((field) => field.binding === "party_a_email")) {
      ctx.addIssue({
        code: "custom",
        message: "Formulář se schvalováním musí mít e-mail první osoby.",
        path: ["fields"],
      });
    }
  });

export type FormTemplateInput = z.infer<typeof formTemplateInputSchema>;

export function sortedFields(fields: FormField[]) {
  return [...fields].sort((a, b) => a.order - b.order || a.label.localeCompare(b.label, "cs"));
}

export function boundValue(fields: FormField[], answers: Record<string, unknown>, binding: FormField["binding"]) {
  const field = fields.find((item) => item.binding === binding);
  if (!field) return "";
  const value = answers[field.id];
  return typeof value === "string" ? value.trim() : "";
}
