"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

/**
 * Invite-only admin login. Email/password via Supabase Auth. There is NO
 * sign-up path — accounts are created by inviting users in the Supabase
 * dashboard (public sign-ups disabled).
 */
export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Sign-in is not available. Check the server configuration.");
      setLoading(false);
    }
  }

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

        <form
          onSubmit={onSubmit}
          className="rounded-[24px] border border-hairline bg-white/[0.04] p-8 shadow-elev-3 backdrop-blur-2xl"
        >
          <label className="block">
            <span className="font-mono text-[11px] uppercase tracking-label text-dust">Email</span>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-xl border border-white/12 bg-white/[0.03] px-4 py-3 text-sm text-starlight outline-none transition-colors duration-300 placeholder:text-dust-dim/50 focus:border-ion/70"
            />
          </label>

          <label className="mt-5 block">
            <span className="font-mono text-[11px] uppercase tracking-label text-dust">Password</span>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-xl border border-white/12 bg-white/[0.03] px-4 py-3 text-sm text-starlight outline-none transition-colors duration-300 placeholder:text-dust-dim/50 focus:border-ion/70"
            />
          </label>

          {error && <p className="mt-5 font-mono text-xs text-ember/90">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-8 w-full rounded-full border border-ion/45 bg-[linear-gradient(180deg,rgba(94,230,255,0.16),rgba(94,230,255,0.07))] px-6 py-3 text-sm font-medium tracking-wide text-starlight outline-none transition-[border-color,box-shadow] duration-300 [box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.16)] hover:border-ion/70 focus-visible:ring-2 focus-visible:ring-ion/50 focus-visible:ring-offset-2 focus-visible:ring-offset-void disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
