import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatINR } from "@/lib/money";
import { StatusBadge } from "@/components/admin/StatusBadge";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [invoices, customerCount, materialCount, payAgg, recent] =
    await Promise.all([
      prisma.invoice.findMany({
        where: { status: { not: "CANCELLED" } },
        select: { grandTotal: true },
      }),
      prisma.customer.count(),
      prisma.material.count(),
      prisma.payment.aggregate({ _sum: { amount: true } }),
      prisma.invoice.findMany({
        orderBy: { createdAt: "desc" },
        take: 6,
        include: { payments: { select: { amount: true } } },
      }),
    ]);

  const totalSales = invoices.reduce((s, i) => s + i.grandTotal, 0);
  const totalReceived = payAgg._sum.amount ?? 0;
  const outstanding = Math.max(totalSales - totalReceived, 0);

  const cards = [
    { label: "Total Sales", value: formatINR(totalSales), accent: true },
    { label: "Received", value: formatINR(totalReceived) },
    { label: "Outstanding Dues", value: formatINR(outstanding) },
    { label: "Invoices", value: String(invoices.length) },
  ];

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold">Dashboard</h1>
          <p className="mt-1 text-sm text-muted">
            {customerCount} customers · {materialCount} rate-list items
          </p>
        </div>
        <Link
          href="/admin/invoices/new"
          className="rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-gold-soft"
        >
          + New Invoice
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className={`rounded-2xl border p-5 ${
              c.accent
                ? "border-gold/30 bg-gold/5"
                : "border-white/10 bg-ink-soft/40"
            }`}
          >
            <p className="text-xs uppercase tracking-[0.15em] text-muted">
              {c.label}
            </p>
            <p
              className={`mt-2 font-heading text-2xl font-bold ${
                c.accent ? "text-gold" : ""
              }`}
            >
              {c.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold">Recent Invoices</h2>
          <Link href="/admin/invoices" className="text-sm text-gold hover:underline">
            View all →
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 p-10 text-center text-muted">
            No invoices yet.{" "}
            <Link href="/admin/invoices/new" className="text-gold hover:underline">
              Create your first invoice
            </Link>
            .
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-left text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-4 py-3">Invoice</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((inv) => (
                  <tr
                    key={inv.id}
                    className="border-t border-white/5 hover:bg-white/5"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/invoices/${inv.id}`}
                        className="font-medium text-gold hover:underline"
                      >
                        {inv.number}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{inv.billName}</td>
                    <td className="px-4 py-3 text-muted">
                      {inv.date.toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {formatINR(inv.grandTotal)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge status={inv.status} />
                    </td>
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
