import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getActiveAdmin, type AdminRow } from "@/lib/admins";

export type AdminContext = { user: User; admin: AdminRow };

/**
 * Server-side admin gate. Verifies BOTH:
 *   1. a valid Supabase (Google) session, and
 *   2. the user's email is an active row in the `admins` allowlist.
 *
 * Re-checked on every admin request (guarded layout, pages, server actions),
 * so deactivating an admin blocks them on their next request. A signed-in but
 * non-allowlisted user is signed out and sent to the access-denied screen.
 */
export async function requireAdmin(): Promise<AdminContext> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const admin = await getActiveAdmin(user.email);
  if (!admin) {
    await supabase.auth.signOut();
    redirect("/admin/login?error=access_denied");
  }

  return { user, admin };
}
