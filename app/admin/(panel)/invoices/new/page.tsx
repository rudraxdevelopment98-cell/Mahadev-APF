import Link from "next/link";
import { prisma } from "@/lib/db";
import InvoiceBuilder from "@/components/admin/InvoiceBuilder";
import HelpHint from "@/components/admin/HelpHint";

export const dynamic = "force-dynamic";

const invoiceSteps = [
  "Bill to: pick a saved customer from the dropdown to auto-fill, or just type the customer's name and phone.",
  "Choose the type: 'GST Tax Invoice' (adds GST) or 'Estimate' (a plain quote).",
  "Add items: type the description, choose a unit, then enter quantity and rate. Or use 'Add from rate list' to pick a saved item.",
  "Tap '+ Add another item / extra charge' for extras like hardware, basket or fitting charges.",
  "Optionally set a Discount (₹ or %) and turn Round-off on/off in the Summary on the right.",
  "Tap 'Save Invoice'. Your work auto-saves as a draft, so you can switch tabs and come back without losing it.",
  "On the saved invoice you can Print / Save PDF, send it on WhatsApp, Edit it, or record payments.",
];

async function loadEstimates() {
  // Defensive: the import-from-estimate picker is a convenience. Never let it
  // take down the whole "New Invoice" page if the query fails for any reason.
  try {
    return await prisma.invoice.findMany({
      where: { type: "ESTIMATE", status: { not: "CANCELLED" } },
      orderBy: { date: "desc" },
      take: 50,
      select: {
        id: true,
        number: true,
        billName: true,
        billPhone: true,
        billGstin: true,
        billAddress: true,
        customerId: true,
        discount: true,
        discountType: true,
        items: {
          select: {
            description: true,
            hsn: true,
            unit: true,
            quantity: true,
            rate: true,
            taxRate: true,
          },
        },
      },
    });
  } catch (e) {
    console.error("Failed to load estimates for import:", e);
    return [];
  }
}

export default async function NewInvoicePage() {
  const [customers, materials, estimates] = await Promise.all([
    prisma.customer.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, phone: true, gstin: true, address: true },
    }),
    prisma.material.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, unit: true, hsn: true, rate: true, taxRate: true },
    }),
    loadEstimates(),
  ]);

  return (
    <div>
      <Link href="/admin/invoices" className="text-sm text-muted hover:text-gold">
        ← Invoices
      </Link>
      <div className="mb-6 mt-2 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-3xl font-bold">New Invoice</h1>
        <HelpHint title="How to make an invoice" steps={invoiceSteps} />
      </div>
      <InvoiceBuilder
        customers={customers}
        materials={materials}
        estimates={estimates}
      />
    </div>
  );
}
