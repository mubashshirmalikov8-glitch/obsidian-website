import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getActiveAdmin } from "@/lib/admins";

export const dynamic = "force-dynamic";

/**
 * Google OAuth callback. Exchanges the code for a session, then enforces the
 * admins allowlist: allowed → /admin; otherwise sign out + access-denied.
 * (Route handler → cookies are writable, so exchange + sign-out persist.)
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const origin = url.origin;

  if (!code) {
    return NextResponse.redirect(`${origin}/admin/login?error=auth`);
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(`${origin}/admin/login?error=auth`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const admin = await getActiveAdmin(user?.email);
  if (!admin) {
    await supabase.auth.signOut();
    return NextResponse.redirect(`${origin}/admin/login?error=access_denied`);
  }

  return NextResponse.redirect(`${origin}/admin`);
}
