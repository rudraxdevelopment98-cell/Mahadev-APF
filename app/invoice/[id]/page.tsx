import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/settings-server";
import { InvoiceSheet } from "@/components/InvoiceSheet";
import { invoiceTypeLabel } from "@/lib/invoice-types";
import PrintButton from "@/components/admin/PrintButton";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const inv = await prisma.invoice.findUnique({ where: { id } });
  if (!inv) return { title: "Invoice not found" };
  return {
    title: `${invoiceTypeLabel(inv.type)} ${inv.number}`,
    robots: { index: false },
  };
}

/**
 * Public, no-login invoice view. Shared as a link over WhatsApp so the
 * customer can open and save the invoice/estimate as a PDF themselves.
 */
export default async function PublicInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [inv, shop] = await Promise.all([
    prisma.invoice.findUnique({
      where: { id },
      include: { items: true, payments: true },
    }),
    getSettings(),
  ]);
  if (!inv || inv.status === "CANCELLED") notFound();

  return (
    <main className="min-h-screen bg-neutral-200 py-6">
      <div className="mx-auto max-w-[820px] px-3">
        <div className="no-print mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-neutral-700">
            {shop.name}
          </p>
          <PrintButton />
        </div>

        <InvoiceSheet inv={inv} shop={shop} />

        <p className="no-print mt-4 text-center text-xs text-neutral-500">
          Tap “Print / Save as PDF” and choose “Save as PDF” to download.
        </p>
      </div>
    </main>
  );
}
