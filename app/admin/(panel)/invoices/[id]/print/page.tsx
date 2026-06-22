import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/settings-server";
import { InvoiceSheet } from "@/components/InvoiceSheet";
import PrintButton from "@/components/admin/PrintButton";

export const dynamic = "force-dynamic";

export default async function InvoicePrintPage({
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
  if (!inv) notFound();

  return (
    <div className="mx-auto max-w-[820px]">
      {/* Toolbar (hidden when printing) */}
      <div className="no-print mb-4 flex items-center justify-between">
        <Link href={`/admin/invoices/${inv.id}`} className="text-sm text-muted hover:text-gold">
          ← Back
        </Link>
        <PrintButton />
      </div>

      <InvoiceSheet inv={inv} shop={shop} />
    </div>
  );
}
