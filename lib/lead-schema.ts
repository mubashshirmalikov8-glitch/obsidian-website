import { z } from "zod";

/**
 * Canonical option keys stored in Supabase (language-independent). The UI maps
 * each key to a localized label via the dictionary.
 */
export const GENDERS = ["male", "female", "other"] as const;
export const AGE_RANGES = [
  "under18",
  "18_24",
  "25_34",
  "35_44",
  "45_plus",
] as const;

export const LOCALES = ["uz", "ru", "en"] as const;

/** Course intent carried over from the Final CTA (optional — consult-only and
 *  direct questionnaire leads have none). */
export const FORMATS = ["online", "offline"] as const;
export const TARIFFS = ["start", "pro", "premium"] as const;

export const leadSchema = z.object({
  name: z.string().trim().min(2, "name").max(80, "name"),
  phone: z
    .string()
    .trim()
    .min(7, "phone")
    .max(24, "phone")
    .refine((v) => v.replace(/\D/g, "").length >= 7, "phone"),
  gender: z.enum(GENDERS),
  age: z.enum(AGE_RANGES),
  locale: z.enum(LOCALES).optional(),
  format: z.enum(FORMATS).optional(),
  tariff: z.enum(TARIFFS).optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;

/** The ordered steps of the onboarding questionnaire (4 steps). */
export const LEAD_STEPS = ["name", "phone", "gender", "age"] as const;
export type LeadStep = (typeof LEAD_STEPS)[number];

/** Fields rendered as a single-select chip grid (vs. free text). */
export const CHOICE_OPTIONS: Record<"gender" | "age", readonly string[]> = {
  gender: GENDERS,
  age: AGE_RANGES,
};

/** Per-field grid layout so chips stay equal width (no orphan/short chips). */
export const CHOICE_COLS: Record<"gender" | "age", string> = {
  gender: "grid-cols-3",
  age: "grid-cols-1 sm:grid-cols-5",
};
