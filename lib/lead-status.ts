import { z } from "zod";

/** Lead pipeline (approved): new → contacted → qualified → won / lost. */
export const LEAD_STATUSES = ["new", "contacted", "qualified", "won", "lost"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const leadStatusSchema = z.enum(LEAD_STATUSES);

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  won: "Won",
  lost: "Lost",
};

/** Badge classes drawn from the existing OBSIDIAN palette (no new tokens). */
export const LEAD_STATUS_BADGE: Record<LeadStatus, string> = {
  new: "border-white/15 bg-white/[0.05] text-dust",
  contacted: "border-ion/40 bg-ion/[0.10] text-ion",
  qualified: "border-magenta/40 bg-magenta/[0.10] text-magenta",
  won: "border-ember/45 bg-ember/[0.12] text-ember",
  lost: "border-white/10 bg-white/[0.02] text-dust-dim",
};

/** A lead row as stored in Supabase (admin view). */
export type AdminLead = {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  gender: string | null;
  age: string | null;
  locale: string | null;
  format: string | null;
  tariff: string | null;
  source: string | null;
  user_agent: string | null;
  status: LeadStatus;
};
