import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { shop } from "@/lib/shop";
import { formatINR, amountInWords } from "@/lib/money";
import PrintButton from "@/components/admin/PrintButton";

export const dynamic = "force-dynamic";

export default async function InvoicePrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const inv = await prisma.invoice.findUnique({
    where: { id },
    include: { items: true, payments: true },
  });
  if (!inv) notFound();

  const isTax = inv.type === "TAX";
  const paid = inv.payments.reduce((s, p) => s + p.amount, 0);
  const balance = Math.max(inv.grandTotal - paid, 0);
  const cgst = inv.interState ? 0 : inv.taxTotal / 2;
  const sgst = inv.interState ? 0 : inv.taxTotal - cgst;

  return (
    <div className="mx-auto max-w-[820px]">
      {/* Toolbar (hidden when printing) */}
      <div className="no-print mb-4 flex items-center justify-between">
        <Link href={`/admin/invoices/${inv.id}`} className="text-sm text-muted hover:text-gold">
          ← Back
        </Link>
        <PrintButton />
      </div>

      {/* The printable sheet */}
      <div className="print-sheet mx-auto bg-white p-8 text-[13px] text-black shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b-2 border-black pb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{shop.legalName}</h1>
            <p className="mt-1 max-w-xs text-xs text-gray-600">{shop.address}</p>
            <p className="text-xs text-gray-600">
              Ph: {shop.phone} · {shop.email}
            </p>
            {isTax && (
              <p className="mt-1 text-xs font-medium">
                GSTIN: {shop.gstin} &nbsp; PAN: {shop.pan}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-lg font-bold uppercase">
              {isTax ? "Tax Invoice" : "Estimate"}
            </p>
            <p className="mt-1 text-xs">
              <span className="text-gray-500">No: </span>
              <span className="font-semibold">{inv.number}</span>
            </p>
            <p className="text-xs">
              <span className="text-gray-500">Date: </span>
              {inv.date.toLocaleDateString("en-IN")}
            </p>
          </div>
        </div>

        {/* Bill to */}
        <div className="flex justify-between gap-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase text-gray-500">Bill To</p>
            <p className="font-semibold">{inv.billName}</p>
            {inv.billAddress && (
              <p className="max-w-xs text-xs text-gray-600">{inv.billAddress}</p>
            )}
            {inv.billPhone && <p className="text-xs text-gray-600">Ph: {inv.billPhone}</p>}
            {inv.billGstin && (
              <p className="text-xs text-gray-600">GSTIN: {inv.billGstin}</p>
            )}
          </div>
        </div>

        {/* Items */}
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border border-gray-300 px-2 py-1.5">#</th>
              <th className="border border-gray-300 px-2 py-1.5">Description</th>
              {isTax && <th className="border border-gray-300 px-2 py-1.5">HSN</th>}
              <th className="border border-gray-300 px-2 py-1.5 text-right">Qty</th>
              <th className="border border-gray-300 px-2 py-1.5 text-right">Rate</th>
              {isTax && (
                <th className="border border-gray-300 px-2 py-1.5 text-right">GST%</th>
              )}
              <th className="border border-gray-300 px-2 py-1.5 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {inv.items.map((it, i) => (
              <tr key={it.id}>
                <td className="border border-gray-300 px-2 py-1.5">{i + 1}</td>
                <td className="border border-gray-300 px-2 py-1.5">{it.description}</td>
                {isTax && (
                  <td className="border border-gray-300 px-2 py-1.5">{it.hsn ?? "-"}</td>
                )}
                <td className="border border-gray-300 px-2 py-1.5 text-right">
                  {it.quantity} {it.unit}
                </td>
                <td className="border border-gray-300 px-2 py-1.5 text-right">
                  {formatINR(it.rate)}
                </td>
                {isTax && (
                  <td className="border border-gray-300 px-2 py-1.5 text-right">
                    {it.taxRate}%
                  </td>
                )}
                <td className="border border-gray-300 px-2 py-1.5 text-right">
                  {formatINR(it.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="mt-4 flex justify-between gap-6">
          <div className="max-w-[55%] text-xs">
            <p className="font-semibold">Amount in words:</p>
            <p className="text-gray-700">{amountInWords(inv.grandTotal)}</p>

            <div className="mt-4">
              <p className="font-semibold">Bank Details:</p>
              <p className="text-gray-700">
                {shop.bank.name} · A/c {shop.bank.account} · IFSC {shop.bank.ifsc}
              </p>
            </div>
          </div>

          <div className="w-64 text-xs">
            <Row label="Sub-total" value={formatINR(inv.subTotal)} />
            {inv.discount > 0 && (
              <Row label="Discount" value={`– ${formatINR(inv.discount)}`} />
            )}
            {isTax && !inv.interState && (
              <>
                <Row label="CGST" value={formatINR(cgst)} />
                <Row label="SGST" value={formatINR(sgst)} />
              </>
            )}
            {isTax && inv.interState && (
              <Row label="IGST" value={formatINR(inv.taxTotal)} />
            )}
            <div className="my-1 border-t border-black" />
            <Row label="Grand Total" value={formatINR(inv.grandTotal)} bold />
            {paid > 0 && (
              <>
                <Row label="Received" value={formatINR(paid)} />
                <Row label="Balance Due" value={formatINR(balance)} bold />
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex items-end justify-between border-t border-gray-300 pt-4">
          <div className="max-w-[55%] text-[10px] text-gray-600">
            <p className="font-semibold">Terms &amp; Conditions:</p>
            <ol className="list-decimal pl-4">
              {shop.terms.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ol>
          </div>
          <div className="text-center text-xs">
            <p className="mb-10">For {shop.legalName}</p>
            <p className="border-t border-gray-400 pt-1">Authorised Signatory</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between py-0.5 ${bold ? "font-bold" : ""}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
