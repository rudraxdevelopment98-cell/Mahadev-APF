import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatINR } from "@/lib/money";
import { StatusBadge } from "@/components/admin/StatusBadge";

export const dynamic = "force-dynamic";

export default async function InvoicesPage() {
  const invoices = await prisma.invoice.findMany({
    orderBy: { createdAt: "desc" },
    include: { payments: { select: { amount: true } } },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-3xl font-bold">Invoices</h1>
        <Link
          href="/admin/invoices/new"
          className="rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-ink hover:bg-gold-soft"
        >
          + New Invoice
        </Link>
      </div>

      {invoices.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 p-12 text-center text-muted">
          No invoices yet.{" "}
          <Link href="/admin/invoices/new" className="text-gold hover:underline">
            Create one
          </Link>
          .
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-white/5 text-left text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-4 py-3">Invoice</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3 text-right">Balance</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => {
                const paid = inv.payments.reduce((s, p) => s + p.amount, 0);
                const balance = Math.max(inv.grandTotal - paid, 0);
                return (
                  <tr key={inv.id} className="border-t border-white/5 hover:bg-white/5">
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
                      {inv.type === "TAX" ? "Tax" : "Estimate"}
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {inv.date.toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-4 py-3 text-right">{formatINR(inv.grandTotal)}</td>
                    <td className="px-4 py-3 text-right">
                      {balance > 0 ? (
                        <span className="text-amber-300">{formatINR(balance)}</span>
                      ) : (
                        <span className="text-emerald-300">Paid</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge status={inv.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
