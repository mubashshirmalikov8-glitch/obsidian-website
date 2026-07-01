"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { leadStatusSchema } from "@/lib/lead-status";

type Result = { ok: true } | { ok: false; error: string };

/** Update a lead's status. Requires an admin session; writes via service-role. */
export async function updateLeadStatus(id: string, status: string): Promise<Result> {
  await requireAdmin();

  const parsed = leadStatusSchema.safeParse(status);
  if (!parsed.success) return { ok: false, error: "invalid_status" };
  if (typeof id !== "string" || id.length < 10) return { ok: false, error: "invalid_id" };

  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: false, error: "not_configured" };

  const { error } = await supabase
    .from("leads")
    .update({ status: parsed.data })
    .eq("id", id);
  if (error) return { ok: false, error: "db_error" };

  revalidatePath("/admin/leads");
  return { ok: true };
}
