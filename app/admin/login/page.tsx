import { GoogleLoginForm } from "./GoogleLoginForm";

type SearchParams = Record<string, string | string[] | undefined>;

/**
 * Admin login. Google OAuth only (no email/password). Access is gated by the
 * `admins` allowlist after sign-in; non-authorized accounts are signed out and
 * returned here with ?error=access_denied.
 */
export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const error = Array.isArray(sp.error) ? sp.error[0] : sp.error;

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <span className="font-display text-lg font-semibold tracking-wordmark text-starlight">
            OBSIDIAN
          </span>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-label text-muted">
            Admin access
          </p>
        </div>
        <GoogleLoginForm error={error} />
      </div>
    </main>
  );
}
