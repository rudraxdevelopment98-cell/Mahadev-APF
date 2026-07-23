import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireSuperAdmin } from "@/lib/superadmin";
import { impersonateBusiness, setBusinessStatus } from "@/lib/actions/superadmin-actions";
import { PLATFORM } from "@/lib/platform";
import { planLimit, isUnlimited, getPlan } from "@/lib/plans";
import { getTheme } from "@/lib/themes";
import { normalizeSections, sectionDef } from "@/lib/sections";
import BusinessDetail from "@/components/rudrone/BusinessDetail";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: `${PLATFORM.name} — Business`, robots: { index: false } };

const statusStyle: Record<string, string> = {
  active: "bg-emerald-400/15 text-emerald-300",
  trial: "bg-amber-400/15 text-amber-300",
  suspended: "bg-red-400/15 text-red-300",
};

function monthStart(): Date {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function usage(used: number, limit: number): string {
  return isUnlimited(limit) ? `${used} · ∞` : `${used} / ${limit}`;
}

export default async function BusinessDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireSuperAdmin();
  const { id } = await params;

  const tenant = await prisma.tenant.findUnique({ where: { id } });
  if (!tenant) notFound();

  const [invMonth, invTotal, customers, users, setting] = await Promise.all([
    prisma.invoice.count({ where: { tenantId: id, createdAt: { gte: monthStart() } } }),
    prisma.invoice.count({ where: { tenantId: id } }),
    prisma.customer.count({ where: { tenantId: id } }),
    prisma.user.findMany({ where: { tenantId: id }, orderBy: { createdAt: "asc" } }),
    prisma.siteSetting.findUnique({ where: { tenantId: id } }),
  ]);

  const data = (setting?.data as Record<string, unknown> | undefined) ?? {};
  const theme = getTheme(data.theme as string | undefined);
  const sections = normalizeSections(data.sections);
  const plan = getPlan(tenant.plan);

  return (
    <div>
      <Link href="/rudrone/admin/businesses" className="text-sm text-muted hover:text-gold">← Businesses</Link>
      <div className="mt-2 mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-heading text-3xl font-bold">{tenant.name}</h1>
            <span className={`rounded-full px-2.5 py-0.5 text-[11px] uppercase tracking-wide ${statusStyle[tenant.status] ?? "bg-white/10 text-muted"}`}>
              {tenant.status}
            </span>
          </div>
          <p className="mt-1 font-mono text-xs text-gold">{PLATFORM.clientHost(tenant.slug)}</p>
          {tenant.domain && <p className="font-mono text-xs text-muted">also at {tenant.domain}</p>}
          <p className="mt-1 text-xs text-muted">
            {plan.name} plan · created {tenant.createdAt.toLocaleDateString("en-IN")}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <form action={impersonateBusiness}>
            <input type="hidden" name="tenantId" value={tenant.id} />
            <button className="rounded-full bg-gold px-5 py-2 text-sm font-semibold text-ink hover:bg-gold-soft">
              Open admin ↗
            </button>
          </form>
          <form action={setBusinessStatus}>
            <input type="hidden" name="tenantId" value={tenant.id} />
            <input type="hidden" name="status" value={tenant.status === "suspended" ? "active" : "suspended"} />
            <button className="rounded-full border border-white/15 px-5 py-2 text-sm text-muted hover:border-gold hover:text-gold">
              {tenant.status === "suspended" ? "Reactivate" : "Suspend"}
            </button>
          </form>
        </div>
      </div>

      {/* Usage + site summary */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Invoices this month", value: usage(invMonth, planLimit(tenant.plan, "invoicesPerMonth")) },
          { label: "Total invoices", value: String(invTotal) },
          { label: "Customers", value: String(customers) },
          { label: "Users", value: usage(users.length, planLimit(tenant.plan, "users")) },
        ].map((c) => (
          <div key={c.label} className="rounded-2xl border border-white/10 bg-ink-soft/40 p-4">
            <p className="text-xs uppercase tracking-[0.15em] text-muted">{c.label}</p>
            <p className="mt-1.5 font-heading text-xl font-bold">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="mb-8 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-ink-soft/40 p-5">
          <h2 className="mb-3 font-heading text-lg font-bold">Site</h2>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted">Theme:</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-3.5 w-3.5 rounded-full" style={{ background: theme.colors.gold }} />
              {theme.name}
            </span>
          </div>
          <p className="mt-2 text-sm text-muted">
            Sections: {sections.map((k) => sectionDef(k)?.label ?? k).join(", ")}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-ink-soft/40 p-5">
          <h2 className="mb-3 font-heading text-lg font-bold">Users ({users.length})</h2>
          <div className="space-y-2">
            {users.map((u) => (
              <div key={u.id} className="flex items-center justify-between gap-3 text-sm">
                <div className="min-w-0">
                  <p className="truncate">{u.name || u.email}</p>
                  <p className="truncate text-xs text-muted">{u.email}</p>
                </div>
                <span className="text-xs text-gold">{u.role}{u.isActive ? "" : " · off"}</span>
              </div>
            ))}
            {users.length === 0 && <p className="text-sm text-muted">No users.</p>}
          </div>
        </div>
      </div>

      <BusinessDetail
        tenant={{
          id: tenant.id,
          name: tenant.name,
          slug: tenant.slug,
          domain: tenant.domain,
          plan: tenant.plan,
          status: tenant.status,
        }}
      />
    </div>
  );
}
