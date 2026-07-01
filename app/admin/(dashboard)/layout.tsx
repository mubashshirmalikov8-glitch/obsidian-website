import { requireAdmin } from "@/lib/admin-auth";
import { signOutAction } from "./actions";

// Auth-gated + per-request (reads the session cookie): never prerender.
export const dynamic = "force-dynamic";

/**
 * Guarded admin shell. requireAdmin() verifies the Google session AND the
 * admins allowlist (active) on every request; non-admins are signed out and
 * bounced to the access-denied screen.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireAdmin();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-hairline bg-void/80 px-6 py-4 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <span className="font-display text-base font-semibold tracking-wordmark text-starlight">
            OBSIDIAN
          </span>
          <span className="font-mono text-[10px] uppercase tracking-label text-muted">Admin</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden font-mono text-[11px] text-dust sm:inline">{user.email}</span>
          <form action={signOutAction}>
            <button
              type="submit"
              className="rounded-full border border-hairline bg-white/[0.03] px-4 py-1.5 font-mono text-[11px] uppercase tracking-label text-dust outline-none transition-colors duration-300 hover:border-hairline-strong hover:text-starlight focus-visible:ring-2 focus-visible:ring-ion/50 focus-visible:ring-offset-2 focus-visible:ring-offset-void"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <div className="flex flex-1">
        <nav className="hidden w-56 shrink-0 border-r border-hairline p-5 md:block">
          <ul className="space-y-1">
            <li>
              <span className="block rounded-lg bg-white/[0.05] px-3 py-2 text-sm text-starlight">
                Dashboard
              </span>
            </li>
            <li>
              <span className="block rounded-lg px-3 py-2 text-sm text-dust-dim">
                Leads
                <span className="ml-2 font-mono text-[9px] uppercase tracking-label text-muted">
                  soon
                </span>
              </span>
            </li>
          </ul>
        </nav>
        <main className="flex-1 p-6 sm:p-10">{children}</main>
      </div>
    </div>
  );
}
