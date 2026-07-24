import Link from "next/link";
import { prisma } from "@/lib/db";
import InvoiceListClient, { type InvoiceRow } from "@/components/admin/InvoiceListClient";

export const dynamic = "force-dynamic";

export default async function InvoicesPage() {
  const invoices = await prisma.invoice.findMany({
    orderBy: { createdAt: "desc" },
    include: { payments: { select: { amount: true } } },
  });

  const rows: InvoiceRow[] = invoices.map((inv) => {
    const paid = inv.payments.reduce((s, p) => s + p.amount, 0);
    return {
      id: inv.id,
      number: inv.number,
      billName: inv.billName,
      type: inv.type,
      dateLabel: inv.date.toLocaleDateString("en-IN"),
      grandTotal: inv.grandTotal,
      balance: Math.max(inv.grandTotal - paid, 0),
      status: inv.status,
    };
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

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 p-12 text-center text-muted">
          No invoices yet.{" "}
          <Link href="/admin/invoices/new" className="text-gold hover:underline">
            Create one
          </Link>
          .
        </div>
      ) : (
        <InvoiceListClient invoices={rows} />
      )}
    </div>
  );
}
