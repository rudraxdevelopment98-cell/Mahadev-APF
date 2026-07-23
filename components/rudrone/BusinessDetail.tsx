"use client";

import { useActionState, useState } from "react";
import {
  updateBusinessDetails,
  deleteBusiness,
  type DetailState,
} from "@/lib/actions/superadmin-actions";
import { normalizeSlug } from "@/lib/slug";
import { PLAN_ORDER } from "@/lib/plans";
import { PLATFORM } from "@/lib/platform";

const STATUSES = ["active", "trial", "suspended"];
const field =
  "w-full rounded-lg border border-white/10 bg-ink/60 px-3 py-2 text-sm outline-none focus:border-gold";

type T = { id: string; name: string; slug: string; domain: string | null; plan: string; status: string };

export default function BusinessDetail({ tenant }: { tenant: T }) {
  const [state, action, pending] = useActionState<DetailState, FormData>(updateBusinessDetails, {});
  const [slug, setSlug] = useState(tenant.slug);
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="space-y-8">
      <form action={action} className="rounded-2xl border border-white/10 bg-ink-soft/40 p-5">
        <input type="hidden" name="tenantId" value={tenant.id} />
        <h2 className="mb-4 font-heading text-lg font-bold">Details</h2>

        {state.error && (
          <p className="mb-3 rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-300">{state.error}</p>
        )}
        {state.ok && (
          <p className="mb-3 rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-300">Saved.</p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-xs text-muted">
            Business name
            <input name="name" defaultValue={tenant.name} className={`mt-1 ${field}`} />
          </label>
          <label className="text-xs text-muted">
            Address (subdomain)
            <input name="slug" value={slug} onChange={(e) => setSlug(normalizeSlug(e.target.value))} className={`mt-1 ${field}`} />
            <span className="mt-1 block font-mono text-[11px] text-muted">{slug || "…"}.{PLATFORM.domain}</span>
          </label>
          <label className="text-xs text-muted">
            Plan
            <select name="plan" defaultValue={tenant.plan} className={`mt-1 ${field}`}>
              {PLAN_ORDER.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </label>
          <label className="text-xs text-muted">
            Status
            <select name="status" defaultValue={tenant.status} className={`mt-1 ${field}`}>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <label className="text-xs text-muted sm:col-span-2">
            Custom domain (its own URL)
            <input name="domain" defaultValue={tenant.domain ?? ""} placeholder="e.g. acme.com" className={`mt-1 ${field}`} />
          </label>
        </div>
        <button disabled={pending} className="mt-4 rounded-full bg-gold px-6 py-2 text-sm font-semibold text-ink hover:bg-gold-soft disabled:opacity-60">
          {pending ? "Saving…" : "Save changes"}
        </button>
      </form>

      {/* Danger zone */}
      <div className="rounded-2xl border border-red-400/20 bg-red-400/5 p-5">
        <h2 className="font-heading text-lg font-bold text-red-300">Danger zone</h2>
        <p className="mt-1 text-sm text-muted">
          Permanently delete <b>{tenant.name}</b> and all its data — invoices, customers, content and users. This cannot be undone.
        </p>
        {!confirming ? (
          <button
            onClick={() => setConfirming(true)}
            className="mt-4 rounded-full border border-red-400/40 px-5 py-2 text-sm text-red-300 hover:bg-red-400/10"
          >
            Delete this business
          </button>
        ) : (
          <form action={deleteBusiness} className="mt-4 flex flex-wrap items-center gap-3">
            <input type="hidden" name="tenantId" value={tenant.id} />
            <span className="text-sm text-red-300">Are you sure?</span>
            <button className="rounded-full bg-red-500 px-5 py-2 text-sm font-semibold text-white hover:bg-red-600">
              Yes, delete permanently
            </button>
            <button type="button" onClick={() => setConfirming(false)} className="text-sm text-muted hover:text-paper">
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
