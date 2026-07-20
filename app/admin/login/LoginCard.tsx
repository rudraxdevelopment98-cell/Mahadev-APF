"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { signInWithPassword, type LoginState } from "@/lib/actions/login-actions";
import { PLATFORM } from "@/lib/platform";

const inputCls =
  "w-full rounded-lg border border-white/10 bg-ink/60 px-3 py-2.5 text-sm outline-none focus:border-gold";

export default function LoginCard({ tenantName }: { tenantName: string }) {
  const params = useSearchParams();
  const errCode = params.get("error");
  const oauthError =
    errCode === "not_allowed"
      ? "This Google account isn't allowed. Please use an approved email."
      : errCode === "google_not_configured"
        ? "Google sign-in isn't set up yet."
        : errCode === "google_failed"
          ? "Google sign-in failed. Please try again."
          : null;

  const [state, action, pending] = useActionState<LoginState, FormData>(
    signInWithPassword,
    {},
  );

  return (
    <div className="w-full max-w-sm">
      <div className="mb-5 text-center">
        <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl border border-gold/50 font-heading text-lg font-bold text-gold">
          {tenantName.charAt(0).toUpperCase()}
        </div>
        <h1 className="font-heading text-2xl font-bold">{tenantName} Admin</h1>
        <p className="mt-1 text-sm text-muted">Billing &amp; business management</p>
      </div>

      <div className="glass space-y-4 rounded-2xl p-6">
        {oauthError && (
          <p className="rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-300" role="alert">
            {oauthError}
          </p>
        )}

        <form action={action} className="space-y-3">
          {state.error && (
            <p className="rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-300" role="alert">
              {state.error}
            </p>
          )}
          <input name="email" type="email" required placeholder="Email" className={inputCls} autoComplete="username" />
          <input name="password" type="password" required placeholder="Password" className={inputCls} autoComplete="current-password" />
          <button
            disabled={pending}
            className="w-full rounded-full bg-gold py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-gold-soft disabled:opacity-60"
          >
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="flex items-center gap-3 text-xs text-muted">
          <span className="h-px flex-1 bg-white/10" />
          or
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <a
          href="/api/auth/google"
          className="flex w-full items-center justify-center gap-3 rounded-lg bg-white px-4 py-3 text-sm font-medium text-[#1f1f1f] transition-opacity hover:opacity-90"
        >
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
          </svg>
          Sign in with Google
        </a>
      </div>

      <p className="mt-5 text-center text-xs text-muted">
        New here?{" "}
        <Link href="/signup" className="text-gold hover:underline">
          Start your business on {PLATFORM.name}
        </Link>
      </p>
    </div>
  );
}
