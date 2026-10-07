import type { AnswerValue, FormField } from "@/types/domain";
import { sortedFields } from "@/lib/forms/fields";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ValidationResult {
  ok: boolean;
  errors: Record<string, string>;
  answers: Record<string, AnswerValue>;
}

function textOf(value: unknown) {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  return "";
}

export function validateAnswers(
  fields: FormField[],
  raw: Record<string, unknown>,
  files: Record<string, boolean> = {},
): ValidationResult {
  const errors: Record<string, string> = {};
  const answers: Record<string, AnswerValue> = {};

  for (const field of sortedFields(fields)) {
    if (field.type === "file" || field.type === "photo") {
      if (field.required && !files[field.id]) errors[field.id] = "Nahrajte soubor.";
      continue;
    }

    if (field.type === "consent" || field.type === "checkbox") {
      const checked = raw[field.id] === true || raw[field.id] === "on" || raw[field.id] === "true";
      answers[field.id] = checked;
      if (field.required && !checked) errors[field.id] = "Toto pole je povinné.";
      continue;
    }

    const value = textOf(raw[field.id]);
    if (field.required && !value) {
      errors[field.id] = "Toto pole je povinné.";
      continue;
    }
    if (!value) {
      answers[field.id] = "";
      continue;
    }

    if ((field.type === "email" || field.binding?.endsWith("email")) && !emailPattern.test(value)) {
      errors[field.id] = "Zadejte platný e-mail.";
    }
    if (field.type === "number") {
      const number = Number(value.replace(",", "."));
      if (!Number.isFinite(number)) errors[field.id] = "Zadejte číslo.";
      if (field.validation?.min !== undefined && number < field.validation.min) {
        errors[field.id] = `Hodnota musí být alespoň ${field.validation.min}.`;
      }
      if (field.validation?.max !== undefined && number > field.validation.max) {
        errors[field.id] = `Hodnota může být nejvýše ${field.validation.max}.`;
      }
    }
    if (field.validation?.minLength && value.length < field.validation.minLength) {
      errors[field.id] = `Zadejte alespoň ${field.validation.minLength} znaků.`;
    }
    if (field.validation?.maxLength && value.length > field.validation.maxLength) {
      errors[field.id] = `Text může mít nejvýše ${field.validation.maxLength} znaků.`;
    }
    if ((field.type === "select" || field.type === "radio") && !field.options.some((option) => option.value === value)) {
      errors[field.id] = "Vyberte jednu z nabízených možností.";
    }
    answers[field.id] = value;
  }

  return { ok: Object.keys(errors).length === 0, errors, answers };
}
