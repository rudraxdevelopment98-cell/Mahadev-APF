"use client";

import { useActionState, useState } from "react";
import { signUp, type SignupState } from "@/lib/actions/signup-actions";
import { PLATFORM } from "@/lib/platform";
import { normalizeSlug } from "@/lib/slug";

const inputCls =
  "w-full rounded-lg border border-white/10 bg-ink/60 px-3 py-2.5 text-sm outline-none focus:border-gold";

export default function SignupPage() {
  const [state, action, pending] = useActionState<SignupState, FormData>(signUp, {});
  const [slug, setSlug] = useState("");

  if (state.ok) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ink px-6">
        <div className="glass w-full max-w-md rounded-2xl p-8 text-center">
          <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl border border-gold/50 text-2xl">
            🎉
          </div>
          <h1 className="font-heading text-2xl font-bold">You&apos;re on {PLATFORM.name}!</h1>
          <p className="mt-2 text-sm text-muted">
            Your business is live at{" "}
            <span className="font-medium text-gold">{PLATFORM.clientHost(state.slug!)}</span>
          </p>
          <a
            href={state.loginUrl}
            className="mt-6 inline-block rounded-full bg-gold px-6 py-2.5 text-sm font-semibold text-ink hover:bg-gold-soft"
          >
            Go to your dashboard →
          </a>
        </div>
      </main>
    );
  }

  const err = (field: string) =>
    state.field === field ? (
      <p className="mt-1 text-xs text-red-300">{state.error}</p>
    ) : null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-6 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="font-heading text-3xl font-bold">
            Start your business on <span className="text-gold">{PLATFORM.name}</span>
          </h1>
          <p className="mt-2 text-sm text-muted">{PLATFORM.tagline}</p>
        </div>

        <form action={action} className="glass space-y-4 rounded-2xl p-6">
          {state.error && !state.field && (
            <p className="rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-300">
              {state.error}
            </p>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium">Business name</label>
            <input name="businessName" required className={inputCls} placeholder="e.g. Acme Interiors" />
            {err("businessName")}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Your address</label>
            <div className="flex items-center gap-1">
              <input
                name="slug"
                required
                className={inputCls}
                placeholder="acme"
                value={slug}
                onChange={(e) => setSlug(normalizeSlug(e.target.value))}
              />
            </div>
            <p className="mt-1 text-xs text-muted">
              {slug ? `${slug}.${PLATFORM.domain}` : `yourname.${PLATFORM.domain}`}
            </p>
            {err("slug")}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Your name</label>
            <input name="ownerName" required className={inputCls} placeholder="Full name" />
            {err("ownerName")}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input name="ownerEmail" type="email" required className={inputCls} placeholder="you@example.com" />
            {err("ownerEmail")}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input name="password" type="password" required minLength={8} className={inputCls} placeholder="At least 8 characters" />
            {err("password")}
          </div>

          <button
            disabled={pending}
            className="w-full rounded-full bg-gold py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-gold-soft disabled:opacity-60"
          >
            {pending ? "Creating…" : `Create my business`}
          </button>
          <p className="text-center text-xs text-muted">
            Free to start. No card required.
          </p>
        </form>
      </div>
    </main>
  );
}
