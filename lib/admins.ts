import { getSupabaseAdmin } from "@/lib/supabase";

export type AdminRow = {
  id: string;
  email: string;
  role: "owner" | "admin";
  active: boolean;
  created_at: string;
};

/**
 * Return the active admin allowlist row for an email (case-insensitive), or
 * null if the email isn't an active admin. Service-role, server-only — this is
 * the authorization gate for the whole /admin area.
 */
export async function getActiveAdmin(
  email: string | null | undefined,
): Promise<AdminRow | null> {
  if (!email) return null;
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("admins")
    .select("id,email,role,active,created_at")
    .eq("email", email.toLowerCase())
    .eq("active", true)
    .maybeSingle();

  if (error) return null;
  return (data as AdminRow) ?? null;
}
