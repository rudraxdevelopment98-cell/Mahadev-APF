import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import InvoiceBuilder, { type InitialInvoice } from "@/components/admin/InvoiceBuilder";

export const dynamic = "force-dynamic";

export default async function EditInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [inv, customers, materials] = await Promise.all([
    prisma.invoice.findUnique({ where: { id }, include: { items: true } }),
    prisma.customer.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, phone: true, gstin: true, address: true },
    }),
    prisma.material.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, unit: true, hsn: true, rate: true, taxRate: true },
    }),
  ]);
  if (!inv) notFound();

  const initial: InitialInvoice = {
    type:
      inv.type === "ESTIMATE" ? "ESTIMATE" : inv.type === "NOGST" ? "NOGST" : "TAX",
    interState: inv.interState,
    showBank: inv.showBank,
    customerId: inv.customerId ?? "",
    billName: inv.billName,
    billPhone: inv.billPhone ?? "",
    billGstin: inv.billGstin ?? "",
    billAddress: inv.billAddress ?? "",
    date: inv.date.toISOString().slice(0, 10),
    discount: inv.discount,
    discountType: inv.discountType === "PERCENT" ? "PERCENT" : "AMOUNT",
    roundOff: true,
    notes: inv.notes ?? "",
    items: inv.items.map((i) => ({
      description: i.description,
      hsn: i.hsn ?? "",
      unit: i.unit,
      quantity: i.quantity,
      rate: i.rate,
      taxRate: i.taxRate,
    })),
  };

  return (
    <div>
      <Link href={`/admin/invoices/${inv.id}`} className="text-sm text-muted hover:text-gold">
        ← Back to invoice
      </Link>
      <h1 className="mb-6 mt-2 font-heading text-3xl font-bold">
        Edit {inv.number}
      </h1>
      <InvoiceBuilder
        customers={customers}
        materials={materials}
        mode="edit"
        invoiceId={inv.id}
        initial={initial}
      />
    </div>
  );
}
