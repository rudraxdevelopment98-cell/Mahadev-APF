import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireSuperAdmin } from "@/lib/superadmin";
import { getPlan, PLAN_ORDER } from "@/lib/plans";
import { formatINR } from "@/lib/money";
import { PLATFORM } from "@/lib/platform";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: `${PLATFORM.name} — Control Room`, robots: { index: false } };

const statusStyle: Record<string, string> = {
  active: "text-emerald-300",
  trial: "text-amber-300",
  suspended: "text-red-300",
};

function monthStart(): Date {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export default async function ControlRoomDashboard() {
  await requireSuperAdmin();

  const [tenants, invMonth, invTotal, users, customers, recentInvoices] = await Promise.all([
    prisma.tenant.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.invoice.count({ where: { createdAt: { gte: monthStart() } } }),
    prisma.invoice.count(),
    prisma.user.count(),
    prisma.customer.count(),
    prisma.invoice.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      select: { id: true, number: true, billName: true, grandTotal: true, tenantId: true },
    }),
  ]);
  const nameById = new Map(tenants.map((t) => [t.id, t.name]));
  const newThisMonth = tenants.filter((t) => t.createdAt >= monthStart()).length;

  const byPlan = tenants.reduce<Record<string, number>>((a, t) => ((a[t.plan] = (a[t.plan] ?? 0) + 1), a), {});
  const byStatus = tenants.reduce<Record<string, number>>((a, t) => ((a[t.status] = (a[t.status] ?? 0) + 1), a), {});
  const mrr = tenants
    .filter((t) => t.status === "active")
    .reduce((s, t) => s + (getPlan(t.plan).priceInr ?? 0), 0);

  const cards = [
    { label: "Businesses", value: String(tenants.length), accent: true },
    { label: "New this month", value: `+${newThisMonth}` },
    { label: "Est. MRR", value: formatINR(mrr) },
    { label: "Invoices this month", value: String(invMonth) },
    { label: "Total invoices", value: String(invTotal) },
    { label: "Users · Customers", value: `${users} · ${customers}` },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold">Dashboard</h1>
        <p className="mt-1 text-sm text-muted">Everything running on {PLATFORM.name}, at a glance.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div
            key={c.label}
            className={`rounded-2xl border p-5 ${c.accent ? "border-gold/30 bg-gold/5" : "border-white/10 bg-ink-soft/40"}`}
          >
            <p className="text-xs uppercase tracking-[0.15em] text-muted">{c.label}</p>
            <p className={`mt-2 font-heading text-2xl font-bold ${c.accent ? "text-gold" : ""}`}>{c.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-ink-soft/40 p-5">
          <h2 className="font-heading text-lg font-bold">By plan</h2>
          <div className="mt-4 space-y-2">
            {PLAN_ORDER.filter((p) => byPlan[p]).length === 0 && (
              <p className="text-sm text-muted">No businesses yet.</p>
            )}
            {PLAN_ORDER.filter((p) => byPlan[p]).map((p) => (
              <div key={p} className="flex items-center gap-3">
                <span className="w-16 text-sm capitalize">{p}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gold" style={{ width: `${(byPlan[p] / tenants.length) * 100}%` }} />
                </div>
                <span className="w-6 text-right text-sm tabular-nums text-muted">{byPlan[p]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-ink-soft/40 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-lg font-bold">Newest businesses</h2>
            <Link href="/rudrone/admin/businesses" className="text-sm text-gold hover:underline">
              Manage all →
            </Link>
          </div>
          <div className="space-y-3">
            {tenants.slice(0, 5).map((t) => (
              <div key={t.id} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{t.name}</p>
                  <p className="truncate font-mono text-xs text-muted">{PLATFORM.clientHost(t.slug)}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs capitalize text-gold">{t.plan}</span>
                  <span className={`ml-2 text-xs capitalize ${statusStyle[t.status] ?? "text-muted"}`}>{t.status}</span>
                </div>
              </div>
            ))}
            {tenants.length === 0 && <p className="text-sm text-muted">No businesses yet.</p>}
          </div>
          <p className="mt-4 text-xs text-muted">
            Statuses: {Object.entries(byStatus).map(([k, v]) => `${v} ${k}`).join(" · ") || "—"}
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-ink-soft/40 p-5">
        <h2 className="mb-4 font-heading text-lg font-bold">Recent invoices across all businesses</h2>
        {recentInvoices.length === 0 ? (
          <p className="text-sm text-muted">No invoices yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-muted">
                  <th className="pb-2 font-medium">Invoice</th>
                  <th className="pb-2 font-medium">Business</th>
                  <th className="pb-2 font-medium">Customer</th>
                  <th className="pb-2 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentInvoices.map((inv) => (
                  <tr key={inv.id} className="border-t border-white/5">
                    <td className="py-2 font-mono text-xs">{inv.number}</td>
                    <td className="py-2 text-muted">{nameById.get(inv.tenantId) ?? "—"}</td>
                    <td className="py-2">{inv.billName}</td>
                    <td className="py-2 text-right tabular-nums">{formatINR(inv.grandTotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
