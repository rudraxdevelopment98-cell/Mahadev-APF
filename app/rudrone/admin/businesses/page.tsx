import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireSuperAdmin } from "@/lib/superadmin";
import { updateTenant } from "@/lib/actions/superadmin-actions";
import { PLATFORM } from "@/lib/platform";
import { PLAN_ORDER, planLimit, isUnlimited } from "@/lib/plans";
import CreateBusinessForm from "@/components/rudrone/CreateBusinessForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: `${PLATFORM.name} — Businesses`, robots: { index: false } };

const STATUSES = ["active", "trial", "suspended"] as const;
const statusStyle: Record<string, string> = {
  active: "bg-emerald-400/15 text-emerald-300",
  trial: "bg-amber-400/15 text-amber-300",
  suspended: "bg-red-400/15 text-red-300",
};
const fieldCls =
  "rounded-lg border border-white/10 bg-ink/60 px-2.5 py-1.5 text-sm outline-none focus:border-gold";

function monthStart(): Date {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function usage(used: number, limit: number): string {
  return isUnlimited(limit) ? `${used} · ∞` : `${used} / ${limit}`;
}

export default async function BusinessesPage() {
  await requireSuperAdmin();

  const [tenants, invAgg, userAgg] = await Promise.all([
    prisma.tenant.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.invoice.groupBy({ by: ["tenantId"], where: { createdAt: { gte: monthStart() } }, _count: { _all: true } }),
    prisma.user.groupBy({ by: ["tenantId"], _count: { _all: true } }),
  ]);
  const invBy = new Map(invAgg.map((r) => [r.tenantId, r._count._all]));
  const userBy = new Map(userAgg.map((r) => [r.tenantId, r._count._all]));

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold">Businesses</h1>
          <p className="mt-1 text-sm text-muted">{tenants.length} on {PLATFORM.name} · set each one&apos;s plan, status and custom domain.</p>
        </div>
        <CreateBusinessForm />
      </div>

      <div className="space-y-3">
        {tenants.length === 0 && (
          <p className="rounded-2xl border border-dashed border-white/15 p-10 text-center text-muted">No businesses yet.</p>
        )}

        {tenants.map((t) => {
          const inv = invBy.get(t.id) ?? 0;
          const users = userBy.get(t.id) ?? 0;
          return (
            <form key={t.id} action={updateTenant} className="rounded-2xl border border-white/10 bg-ink-soft/40 p-5">
              <input type="hidden" name="tenantId" value={t.id} />
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Link href={`/rudrone/admin/businesses/${t.id}`} className="font-heading text-lg font-bold hover:text-gold">{t.name}</Link>
                    <span className={`rounded-full px-2 py-0.5 text-[11px] uppercase tracking-wide ${statusStyle[t.status] ?? "bg-white/10 text-muted"}`}>
                      {t.status}
                    </span>
                  </div>
                  <p className="mt-0.5 font-mono text-xs text-gold">{PLATFORM.clientHost(t.slug)}</p>
                  {t.domain && <p className="font-mono text-xs text-muted">also at {t.domain}</p>}
                </div>
                <div className="text-right text-xs text-muted">
                  <div>Invoices this month: <span className="text-paper">{usage(inv, planLimit(t.plan, "invoicesPerMonth"))}</span></div>
                  <div>Users: <span className="text-paper">{usage(users, planLimit(t.plan, "users"))}</span></div>
                </div>
              </div>

              <div className="mt-4 grid items-end gap-3 sm:grid-cols-[1fr_1fr_2fr_auto]">
                <label className="text-xs text-muted">
                  Plan
                  <select name="plan" defaultValue={t.plan} className={`mt-1 block w-full ${fieldCls}`}>
                    {PLAN_ORDER.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </label>
                <label className="text-xs text-muted">
                  Status
                  <select name="status" defaultValue={t.status} className={`mt-1 block w-full ${fieldCls}`}>
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </label>
                <label className="text-xs text-muted">
                  Custom domain (its own URL)
                  <input name="domain" defaultValue={t.domain ?? ""} placeholder="e.g. acme.com or acme.vercel.app" className={`mt-1 block w-full ${fieldCls}`} />
                </label>
                <button className="rounded-full bg-gold px-5 py-2 text-sm font-semibold text-ink hover:bg-gold-soft">Save</button>
              </div>
            </form>
          );
        })}
      </div>
    </div>
  );
}
