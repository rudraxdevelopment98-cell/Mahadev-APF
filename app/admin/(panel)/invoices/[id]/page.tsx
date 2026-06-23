import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { formatINR } from "@/lib/money";
import { StatusBadge } from "@/components/admin/StatusBadge";
import {
  addPayment,
  setInvoiceStatus,
  deleteInvoice,
  duplicateInvoice,
  deletePayment,
  convertEstimateToInvoice,
} from "@/lib/actions/invoice-actions";
import { shop } from "@/lib/shop";
import { invoiceTypeLabel } from "@/lib/invoice-types";

export const dynamic = "force-dynamic";

/** Build a wa.me link to send the customer a short invoice summary. */
function whatsappLink(phone: string | null, text: string): string | null {
  if (!phone) return null;
  let digits = phone.replace(/\D/g, "");
  if (digits.length === 10) digits = "91" + digits; // assume India
  if (digits.length < 11) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

const inputCls =
  "w-full rounded-lg border border-white/10 bg-ink/60 px-3 py-2 text-sm outline-none focus:border-gold";

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const inv = await prisma.invoice.findUnique({
    where: { id },
    include: { items: true, payments: { orderBy: { date: "desc" } } },
  });
  if (!inv) notFound();

  const isEstimate = inv.type === "ESTIMATE";
  const paid = inv.payments.reduce((s, p) => s + p.amount, 0);
  const balance = Math.max(inv.grandTotal - paid, 0);

  // Public, shareable link to the invoice (for WhatsApp).
  const h = await headers();
  const host = h.get("host") ?? "";
  const proto = host.includes("localhost") ? "http" : "https";
  const publicUrl = host ? `${proto}://${host}/invoice/${inv.id}` : "";

  const waText =
    `${shop.name}\n${invoiceTypeLabel(inv.type)}: ${inv.number}\n` +
    `Date: ${inv.date.toLocaleDateString("en-IN")}\n` +
    `Total: ${formatINR(inv.grandTotal)}` +
    (!isEstimate && balance > 0 ? `\nBalance due: ${formatINR(balance)}` : "") +
    (publicUrl ? `\n\nView / download: ${publicUrl}` : "") +
    `\n\nThank you!`;
  const wa = whatsappLink(inv.billPhone, waText);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/admin/invoices" className="text-sm text-muted hover:text-gold">
            ← Invoices
          </Link>
          <h1 className="mt-1 flex items-center gap-3 font-heading text-3xl font-bold">
            {inv.number}
            <StatusBadge status={inv.status} />
          </h1>
          <p className="mt-1 text-sm text-muted">
            {inv.type === "TAX"
              ? "GST Tax Invoice"
              : inv.type === "NOGST"
                ? "Invoice (No GST)"
                : "Quotation"}{" "}
            · {inv.date.toLocaleDateString("en-IN")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/admin/invoices/${inv.id}/print`}
            className="rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-ink hover:bg-gold-soft"
          >
            Download PDF
          </Link>
          {wa && (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-emerald-400/40 px-4 py-2.5 text-sm text-emerald-300 hover:bg-emerald-400/10"
            >
              WhatsApp link
            </a>
          )}
          {isEstimate && (
            <form action={convertEstimateToInvoice.bind(null, inv.id)}>
              <button className="rounded-full border border-gold/50 bg-gold/10 px-4 py-2.5 text-sm font-semibold text-gold hover:bg-gold/20">
                Create Invoice from this
              </button>
            </form>
          )}
          <Link
            href={`/admin/invoices/${inv.id}/edit`}
            className="rounded-full border border-white/15 px-4 py-2.5 text-sm text-paper hover:border-gold hover:text-gold"
          >
            Edit
          </Link>
          <form action={duplicateInvoice.bind(null, inv.id)}>
            <button className="rounded-full border border-white/15 px-4 py-2.5 text-sm text-paper hover:border-gold hover:text-gold">
              Duplicate
            </button>
          </form>
          {inv.status !== "CANCELLED" && (
            <form action={setInvoiceStatus.bind(null, inv.id, "CANCELLED")}>
              <button className="rounded-full border border-white/15 px-4 py-2.5 text-sm text-muted hover:border-red-400/40 hover:text-red-300">
                Cancel
              </button>
            </form>
          )}
          <form action={deleteInvoice.bind(null, inv.id)}>
            <button className="rounded-full border border-white/15 px-4 py-2.5 text-sm text-muted hover:border-red-400/40 hover:text-red-300">
              Delete
            </button>
          </form>
        </div>
      </div>

      <p className="mb-6 rounded-xl border border-white/10 bg-ink-soft/40 px-4 py-2.5 text-xs text-muted">
        📎 To send on WhatsApp as a file: tap <b className="text-paper">Download PDF</b>,
        save it, then open WhatsApp and attach the PDF from your files.
        “WhatsApp link” instead sends a tap-to-open link to the {isEstimate ? "quotation" : "bill"}.
      </p>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Items + bill-to */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-ink-soft/40 p-5">
            <p className="text-xs uppercase tracking-[0.15em] text-muted">Bill To</p>
            <p className="mt-1 font-medium">{inv.billName}</p>
            {inv.billPhone && <p className="text-sm text-muted">{inv.billPhone}</p>}
            {inv.billGstin && (
              <p className="text-sm text-muted">GSTIN: {inv.billGstin}</p>
            )}
            {inv.billAddress && (
              <p className="text-sm text-muted">{inv.billAddress}</p>
            )}
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-left text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-4 py-3">Item</th>
                  <th className="px-4 py-3 text-right">Qty</th>
                  <th className="px-4 py-3 text-right">Rate</th>
                  {inv.type === "TAX" && <th className="px-4 py-3 text-right">GST%</th>}
                  <th className="px-4 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {inv.items.map((it) => (
                  <tr key={it.id} className="border-t border-white/5">
                    <td className="px-4 py-3">
                      {it.description}
                      {it.hsn && (
                        <span className="ml-2 text-xs text-muted">HSN {it.hsn}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {it.quantity} {it.unit}
                    </td>
                    <td className="px-4 py-3 text-right">{formatINR(it.rate)}</td>
                    {inv.type === "TAX" && (
                      <td className="px-4 py-3 text-right text-muted">{it.taxRate}%</td>
                    )}
                    <td className="px-4 py-3 text-right">{formatINR(it.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {inv.notes && (
            <p className="rounded-2xl border border-white/10 bg-ink-soft/40 p-5 text-sm text-muted">
              {inv.notes}
            </p>
          )}
        </div>

        {/* Totals + payments */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-gold/20 bg-gold/5 p-5">
            <Line label="Sub-total" value={formatINR(inv.subTotal)} />
            {inv.type === "TAX" && (
              <Line label="Tax" value={formatINR(inv.taxTotal)} />
            )}
            {inv.roundOff !== 0 && (
              <Line
                label="Round off"
                value={`${inv.roundOff > 0 ? "+" : ""}${formatINR(inv.roundOff)}`}
              />
            )}
            <div className="my-2 border-t border-white/10" />
            <Line label="Grand Total" value={formatINR(inv.grandTotal)} strong />
            {!isEstimate && (
              <>
                <Line label="Received" value={formatINR(paid)} />
                <Line
                  label="Balance"
                  value={formatINR(balance)}
                  strong
                  tone={balance > 0 ? "warn" : "ok"}
                />
              </>
            )}
          </div>

          {/* Record payment */}
          {!isEstimate && balance > 0 && inv.status !== "CANCELLED" && (
            <form
              action={addPayment.bind(null, inv.id)}
              className="space-y-3 rounded-2xl border border-white/10 bg-ink-soft/40 p-5"
            >
              <h2 className="font-heading font-bold">Record Payment</h2>
              <input
                name="amount"
                type="number"
                step="0.01"
                placeholder="Amount ₹"
                defaultValue={balance.toFixed(2)}
                className={inputCls}
              />
              <select name="mode" className={inputCls} defaultValue="CASH">
                <option value="CASH">Cash</option>
                <option value="UPI">UPI</option>
                <option value="BANK">Bank Transfer</option>
                <option value="CHEQUE">Cheque</option>
                <option value="CARD">Card</option>
              </select>
              <input name="note" placeholder="Note (optional)" className={inputCls} />
              <button className="w-full rounded-full bg-gold py-2.5 text-sm font-semibold text-ink hover:bg-gold-soft">
                Add Payment
              </button>
            </form>
          )}

          {!isEstimate && inv.payments.length > 0 && (
            <div className="rounded-2xl border border-white/10 bg-ink-soft/40 p-5">
              <h2 className="mb-3 font-heading font-bold">Payment History</h2>
              <ul className="space-y-2 text-sm">
                {inv.payments.map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-3">
                    <span className="text-muted">
                      {p.date.toLocaleDateString("en-IN")} · {p.mode}
                      {p.note ? ` · ${p.note}` : ""}
                    </span>
                    <span className="flex items-center gap-2">
                      <span>{formatINR(p.amount)}</span>
                      <form action={deletePayment.bind(null, p.id, inv.id)}>
                        <button
                          title="Revoke this payment"
                          className="grid h-6 w-6 place-items-center rounded-full border border-white/10 text-xs text-muted hover:border-red-400/40 hover:text-red-300"
                        >
                          ✕
                        </button>
                      </form>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Line({
  label,
  value,
  strong,
  tone,
}: {
  label: string;
  value: string;
  strong?: boolean;
  tone?: "ok" | "warn";
}) {
  const color =
    tone === "warn" ? "text-amber-300" : tone === "ok" ? "text-emerald-300" : "";
  return (
    <div className="flex items-center justify-between py-1 text-sm">
      <span className="text-muted">{label}</span>
      <span className={`${strong ? "font-bold" : ""} ${color}`}>{value}</span>
    </div>
  );
}
