"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { loginAction, type LoginState } from "@/lib/actions/auth-actions";
import { shop } from "@/lib/shop";

function LoginForm() {
  const params = useSearchParams();
  const next = params.get("next") ?? "/admin";
  const [state, action, pending] = useActionState<LoginState, FormData>(
    loginAction,
    {},
  );

  return (
    <form action={action} className="w-full max-w-sm">
      <input type="hidden" name="next" value={next} />
      <div className="mb-5 text-center">
        <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl border border-gold/50 font-heading text-lg font-bold text-gold">
          M
        </div>
        <h1 className="font-heading text-2xl font-bold">{shop.name} Admin</h1>
        <p className="mt-1 text-sm text-muted">Billing & shop management</p>
      </div>

      <div className="glass space-y-4 rounded-2xl p-6">
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-[0.2em] text-muted">
            Email
          </label>
          <input
            name="email"
            type="email"
            autoComplete="username"
            defaultValue="admin@mahadevapf.com"
            required
            className="w-full rounded-lg border border-white/10 bg-ink/60 px-4 py-2.5 text-sm outline-none focus:border-gold"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-[0.2em] text-muted">
            Password
          </label>
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="w-full rounded-lg border border-white/10 bg-ink/60 px-4 py-2.5 text-sm outline-none focus:border-gold"
          />
        </div>

        {state.error && (
          <p className="text-sm text-red-400" role="alert">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-gold py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-gold-soft disabled:opacity-60"
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>
        <p className="text-center text-xs text-muted">
          Demo: admin@mahadevapf.com / admin123
        </p>
      </div>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-6">
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
