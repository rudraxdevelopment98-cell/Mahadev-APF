import Link from "next/link";
import { prisma } from "@/lib/db";
import InvoiceBuilder from "@/components/admin/InvoiceBuilder";

export const dynamic = "force-dynamic";

export default async function NewInvoicePage() {
  const [customers, materials] = await Promise.all([
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

  return (
    <div>
      <Link href="/admin/invoices" className="text-sm text-muted hover:text-gold">
        ← Invoices
      </Link>
      <h1 className="mb-6 mt-2 font-heading text-3xl font-bold">New Invoice</h1>
      <InvoiceBuilder customers={customers} materials={materials} />
    </div>
  );
}
