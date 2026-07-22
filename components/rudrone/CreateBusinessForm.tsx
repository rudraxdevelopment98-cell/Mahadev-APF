"use client";

import { useActionState, useState } from "react";
import { createBusiness, type CreateBusinessState } from "@/lib/actions/superadmin-actions";
import { normalizeSlug } from "@/lib/slug";
import { PLATFORM } from "@/lib/platform";

const input =
  "w-full rounded-lg border border-white/10 bg-ink/60 px-3 py-2 text-sm outline-none focus:border-gold";

export default function CreateBusinessForm() {
  const [state, action, pending] = useActionState<CreateBusinessState, FormData>(
    createBusiness,
    {},
  );
  const [slug, setSlug] = useState("");
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-ink hover:bg-gold-soft"
      >
        + Add a business
      </button>
    );
  }

  return (
    <form action={action} className="rounded-2xl border border-white/10 bg-ink-soft/40 p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-heading text-lg font-bold">New business</h2>
        <button type="button" onClick={() => setOpen(false)} className="text-sm text-muted hover:text-paper">
          Close
        </button>
      </div>
      {state.error && (
        <p className="mb-3 rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-300">
          {state.error}
        </p>
      )}
      {state.ok && (
        <p className="mb-3 rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-300">
          Created {state.slug}.{PLATFORM.domain} — it now appears below.
        </p>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="businessName" required placeholder="Business name" className={input} />
        <div>
          <input
            name="slug"
            required
            placeholder="address (e.g. acme)"
            className={input}
            value={slug}
            onChange={(e) => setSlug(normalizeSlug(e.target.value))}
          />
          <p className="mt-1 text-xs text-muted">{slug || "acme"}.{PLATFORM.domain}</p>
        </div>
        <input name="ownerName" required placeholder="Owner name" className={input} />
        <input name="ownerEmail" type="email" required placeholder="Owner email" className={input} />
        <input name="password" type="password" required minLength={8} placeholder="Owner password (min 8)" className={input} />
      </div>
      <button
        disabled={pending}
        className="mt-4 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-ink hover:bg-gold-soft disabled:opacity-60"
      >
        {pending ? "Creating…" : "Create business"}
      </button>
    </form>
  );
}
