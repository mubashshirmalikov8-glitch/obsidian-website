import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

/**
 * Server-only Supabase admin client (service-role key). Used by the /api/lead
 * route handler to insert leads. The service-role key bypasses RLS, so the
 * `leads` table stays private (RLS enabled, no public policies) while the
 * server can still write to it.
 *
 * Returns null when env vars are absent so the app degrades gracefully in
 * local/dev without credentials (the route logs the lead instead).
 *
 * NEVER import this from a client component — the service-role key must never
 * reach the browser.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  if (!cached) {
    cached = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cached;
}
