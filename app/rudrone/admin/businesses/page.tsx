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

export default async function BusinessesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; plan?: string; status?: string }>;
}) {
  await requireSuperAdmin();
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  const plan = sp.plan ?? "all";
  const status = sp.status ?? "all";

  const where = {
    AND: [
      q ? { OR: [{ name: { contains: q, mode: "insensitive" as const } }, { slug: { contains: q, mode: "insensitive" as const } }] } : {},
      plan !== "all" ? { plan } : {},
      status !== "all" ? { status } : {},
    ],
  };

  const [tenants, total, invAgg, userAgg] = await Promise.all([
    prisma.tenant.findMany({ where, orderBy: { createdAt: "asc" } }),
    prisma.tenant.count(),
    prisma.invoice.groupBy({ by: ["tenantId"], where: { createdAt: { gte: monthStart() } }, _count: { _all: true } }),
    prisma.user.groupBy({ by: ["tenantId"], _count: { _all: true } }),
  ]);
  const invBy = new Map(invAgg.map((r) => [r.tenantId, r._count._all]));
  const userBy = new Map(userAgg.map((r) => [r.tenantId, r._count._all]));

  // Preserve active filters when building filter links.
  const link = (over: Record<string, string>) => {
    const p = new URLSearchParams();
    const merged = { q, plan, status, ...over };
    if (merged.q) p.set("q", merged.q);
    if (merged.plan !== "all") p.set("plan", merged.plan);
    if (merged.status !== "all") p.set("status", merged.status);
    const s = p.toString();
    return s ? `/rudrone/admin/businesses?${s}` : "/rudrone/admin/businesses";
  };
  const chip = (active: boolean) =>
    `rounded-full px-3 py-1 text-xs transition-colors ${active ? "bg-gold text-ink" : "border border-white/10 text-muted hover:text-paper"}`;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold">Businesses</h1>
          <p className="mt-1 text-sm text-muted">
            {tenants.length} of {total} on {PLATFORM.name} · set each one&apos;s plan, status and custom domain.
          </p>
        </div>
        <CreateBusinessForm />
      </div>

      {/* Search + filters */}
      <div className="mb-6 space-y-3">
        <form method="GET" className="flex gap-2">
          {plan !== "all" && <input type="hidden" name="plan" value={plan} />}
          {status !== "all" && <input type="hidden" name="status" value={status} />}
          <input
            name="q"
            defaultValue={q}
            placeholder="Search by name or address…"
            className="w-full max-w-sm rounded-lg border border-white/10 bg-ink/60 px-3 py-2 text-sm outline-none focus:border-gold"
          />
          <button className="rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-ink hover:bg-gold-soft">Search</button>
          {(q || plan !== "all" || status !== "all") && (
            <Link href="/rudrone/admin/businesses" className="rounded-lg border border-white/10 px-4 py-2 text-sm text-muted hover:text-paper">
              Clear
            </Link>
          )}
        </form>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-wide text-muted">Plan:</span>
          <Link href={link({ plan: "all" })} className={chip(plan === "all")}>all</Link>
          {PLAN_ORDER.map((p) => <Link key={p} href={link({ plan: p })} className={chip(plan === p)}>{p}</Link>)}
          <span className="ml-3 text-xs uppercase tracking-wide text-muted">Status:</span>
          {["all", ...STATUSES].map((s) => <Link key={s} href={link({ status: s })} className={chip(status === s)}>{s}</Link>)}
        </div>
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
