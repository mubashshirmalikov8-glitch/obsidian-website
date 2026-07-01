"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

export function GoogleLoginForm({ error }: { error?: string }) {
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const denied = error === "access_denied";
  const authErr = error === "auth";

  async function signIn() {
    setLoading(true);
    setFailed(false);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/admin/auth/callback` },
      });
      if (error) {
        setFailed(true);
        setLoading(false);
      }
      // on success the browser navigates to Google
    } catch {
      setFailed(true);
      setLoading(false);
    }
  }

  return (
    <div className="rounded-[24px] border border-hairline bg-white/[0.04] p-8 shadow-elev-3 backdrop-blur-2xl">
      {denied && (
        <p className="mb-6 rounded-xl border border-ember/30 bg-ember/[0.06] px-4 py-3 text-center text-sm text-ember/90">
          Access denied — this Google account isn&apos;t authorized.
        </p>
      )}
      {(authErr || failed) && !denied && (
        <p className="mb-6 rounded-xl border border-ember/30 bg-ember/[0.06] px-4 py-3 text-center text-sm text-ember/90">
          Sign-in failed. Please try again.
        </p>
      )}

      <button
        type="button"
        onClick={signIn}
        disabled={loading}
        className="flex w-full items-center justify-center gap-3 rounded-full border border-white/15 bg-white/[0.05] px-6 py-3 text-sm font-medium text-starlight outline-none transition-[border-color,background-color] duration-300 hover:border-white/30 hover:bg-white/[0.08] focus-visible:ring-2 focus-visible:ring-ion/50 focus-visible:ring-offset-2 focus-visible:ring-offset-void disabled:cursor-not-allowed disabled:opacity-60"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
          <path
            fill="#4285F4"
            d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.71-1.57 2.68-3.89 2.68-6.62z"
          />
          <path
            fill="#34A853"
            d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z"
          />
          <path
            fill="#FBBC05"
            d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33z"
          />
          <path
            fill="#EA4335"
            d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.47.9 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"
          />
        </svg>
        {loading ? "Redirecting…" : "Continue with Google"}
      </button>

      <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-label text-muted">
        Authorized accounts only
      </p>
    </div>
  );
}
