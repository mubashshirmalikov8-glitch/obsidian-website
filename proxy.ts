import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Edge proxy (Next 16's renamed middleware). Scoped to /admin/* ONLY — the
 * public site's request path is never touched.
 *
 * Responsibilities:
 *  - Refresh the Supabase session cookies on each admin request.
 *  - Redirect unauthenticated visitors to /admin/login.
 *  - Redirect already-authenticated users away from /admin/login → /admin.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLogin = pathname === "/admin/login";
  // The OAuth callback must run without a session (it establishes one).
  const isPublicAdmin = isLogin || pathname.startsWith("/admin/auth");

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Auth not configured yet → keep the admin area locked (allow login + callback).
  if (!url || !anonKey) {
    if (!isPublicAdmin) return NextResponse.redirect(new URL("/admin/login", request.url));
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !isPublicAdmin) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  if (user && isLogin) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
