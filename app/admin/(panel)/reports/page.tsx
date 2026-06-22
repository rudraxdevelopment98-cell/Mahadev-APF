import Link from "next/link";
import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/settings-server";
import { formatINR } from "@/lib/money";
import { invoiceTypeLabel } from "@/lib/invoice-types";
import PrintButton from "@/components/admin/PrintButton";

export const dynamic = "force-dynamic";

type Search = {
  range?: string;
  from?: string;
  to?: string;
  type?: string;
  ids?: string;
};

const PRESETS = [
  { key: "1m", label: "1 Month", months: 1 },
  { key: "3m", label: "3 Months", months: 3 },
  { key: "6m", label: "6 Months", months: 6 },
  { key: "12m", label: "1 Year", months: 12 },
  { key: "fy", label: "This FY", months: 0 },
];

const TYPES = [
  { key: "ALL", label: "All" },
  { key: "INVOICES", label: "Invoices" },
  { key: "TAX", label: "GST only" },
  { key: "NOGST", label: "No-GST only" },
  { key: "ESTIMATE", label: "Estimates" },
];

function startOfFy(now: Date): Date {
  const y = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
  return new Date(y, 3, 1);
}

function resolveRange(sp: Search): { from: Date; to: Date; label: string } {
  const now = new Date();
  const to = sp.to ? new Date(sp.to + "T23:59:59") : now;
  if (sp.from) {
    return {
      from: new Date(sp.from),
      to,
      label: `${new Date(sp.from).toLocaleDateString("en-IN")} – ${to.toLocaleDateString("en-IN")}`,
    };
  }
  const range = sp.range ?? "1m";
  if (range === "fy") {
    const from = startOfFy(now);
    return { from, to: now, label: `FY since ${from.toLocaleDateString("en-IN")}` };
  }
  const preset = PRESETS.find((p) => p.key === range) ?? PRESETS[0];
  const from = new Date(now);
  from.setMonth(from.getMonth() - preset.months);
  return {
    from,
    to: now,
    label: `Last ${preset.label.toLowerCase()} (${from.toLocaleDateString("en-IN")} – ${now.toLocaleDateString("en-IN")})`,
  };
}

function typeWhere(type: string) {
  if (type === "INVOICES") return { type: { not: "ESTIMATE" } };
  if (type === "TAX") return { type: "TAX" };
  if (type === "NOGST") return { type: "NOGST" };
  if (type === "ESTIMATE") return { type: "ESTIMATE" };
  return {};
}

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const sp = await searchParams;
  const shop = await getSettings();

  const ids = (sp.ids ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  const type = sp.type ?? "ALL";
  const bySelection = ids.length > 0;

  const range = bySelection ? null : resolveRange(sp);

  const invoices = await prisma.invoice.findMany({
    where: bySelection
      ? { id: { in: ids } }
      : {
          date: { gte: range!.from, lte: range!.to },
          ...typeWhere(type),
        },
    orderBy: { date: "asc" },
    include: { payments: { select: { amount: true } } },
  });

  const rows = invoices.map((inv) => {
    const received = inv.payments.reduce((s, p) => s + p.amount, 0);
    return {
      id: inv.id,
      number: inv.number,
      date: inv.date,
      billName: inv.billName,
      type: inv.type,
      status: inv.status,
      subTotal: inv.subTotal,
      taxTotal: inv.taxTotal,
      grandTotal: inv.grandTotal,
      received,
      balance: Math.max(inv.grandTotal - received, 0),
      cancelled: inv.status === "CANCELLED",
    };
  });

  // Estimates and cancelled bills are excluded from money totals.
  const counted = rows.filter((r) => r.type !== "ESTIMATE" && !r.cancelled);
  const totals = counted.reduce(
    (a, r) => ({
      sub: a.sub + r.subTotal,
      tax: a.tax + r.taxTotal,
      grand: a.grand + r.grandTotal,
      received: a.received + r.received,
      balance: a.balance + r.balance,
    }),
    { sub: 0, tax: 0, grand: 0, received: 0, balance: 0 },
  );

  const periodLabel = bySelection
    ? `${rows.length} selected ${rows.length === 1 ? "invoice" : "invoices"}`
    : range!.label;

  const linkFor = (range: string) =>
    `/admin/reports?range=${range}&type=${type}`;

  return (
    <div className="mx-auto max-w-[920px]">
      {/* Controls (hidden when printing) */}
      <div className="no-print mb-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link href="/admin/invoices" className="text-sm text-muted hover:text-gold">
              ← Invoices
            </Link>
            <h1 className="mt-1 font-heading text-3xl font-bold">Reports</h1>
          </div>
          <PrintButton />
        </div>

        {!bySelection && (
          <>
            <div className="mb-2 flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <Link
                  key={p.key}
                  href={linkFor(p.key)}
                  className={`rounded-full border px-4 py-1.5 text-xs font-medium ${
                    (sp.range ?? "1m") === p.key && !sp.from
                      ? "border-gold bg-gold/10 text-gold"
                      : "border-white/15 text-muted hover:text-paper"
                  }`}
                >
                  {p.label}
                </Link>
              ))}
            </div>
            <div className="mb-3 flex flex-wrap gap-2">
              {TYPES.map((t) => (
                <Link
                  key={t.key}
                  href={`/admin/reports?range=${sp.range ?? "1m"}&type=${t.key}`}
                  className={`rounded-full border px-3 py-1.5 text-xs ${
                    type === t.key
                      ? "border-gold bg-gold text-ink"
                      : "border-white/15 text-muted hover:text-paper"
                  }`}
                >
                  {t.label}
                </Link>
              ))}
            </div>
            {/* Custom date range */}
            <form
              action="/admin/reports"
              method="get"
              className="flex flex-wrap items-end gap-2 text-sm"
            >
              <input type="hidden" name="type" value={type} />
              <label className="flex flex-col gap-1">
                <span className="text-xs text-muted">From</span>
                <input
                  type="date"
                  name="from"
                  defaultValue={sp.from ?? ""}
                  className="rounded-lg border border-white/10 bg-ink/60 px-3 py-1.5 outline-none focus:border-gold"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs text-muted">To</span>
                <input
                  type="date"
                  name="to"
                  defaultValue={sp.to ?? ""}
                  className="rounded-lg border border-white/10 bg-ink/60 px-3 py-1.5 outline-none focus:border-gold"
                />
              </label>
              <button className="rounded-full border border-white/15 px-4 py-2 text-xs text-paper hover:border-gold hover:text-gold">
                Apply custom range
              </button>
            </form>
          </>
        )}
        {bySelection && (
          <Link
            href="/admin/reports?range=1m&type=ALL"
            className="text-sm text-gold hover:underline"
          >
            ← Switch to period report
          </Link>
        )}
      </div>

      {/* Printable report sheet */}
      <div className="print-sheet mx-auto bg-white p-8 text-[13px] text-black shadow-xl">
        <div className="flex items-start justify-between border-b-2 border-black pb-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{shop.legalName}</h2>
            <p className="mt-1 text-xs text-gray-600">{shop.address}</p>
            <p className="text-xs text-gray-600">
              Ph: {shop.phone} · GSTIN: {shop.gstin}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold uppercase">Sales Report</p>
            <p className="mt-1 text-xs text-gray-600">{periodLabel}</p>
            <p className="text-xs text-gray-500">
              Generated {new Date().toLocaleDateString("en-IN")}
            </p>
          </div>
        </div>

        {/* Summary */}
        <div className="my-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Summary label="Bills" value={String(counted.length)} />
          <Summary label="Total" value={formatINR(totals.grand)} />
          <Summary label="Received" value={formatINR(totals.received)} />
          <Summary label="Balance" value={formatINR(totals.balance)} />
        </div>

        {rows.length === 0 ? (
          <p className="py-10 text-center text-sm text-gray-500">
            No invoices in this {bySelection ? "selection" : "period"}.
          </p>
        ) : (
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border border-gray-300 px-2 py-1.5">#</th>
                <th className="border border-gray-300 px-2 py-1.5">Number</th>
                <th className="border border-gray-300 px-2 py-1.5">Date</th>
                <th className="border border-gray-300 px-2 py-1.5">Customer</th>
                <th className="border border-gray-300 px-2 py-1.5">Type</th>
                <th className="border border-gray-300 px-2 py-1.5 text-right">Total</th>
                <th className="border border-gray-300 px-2 py-1.5 text-right">Received</th>
                <th className="border border-gray-300 px-2 py-1.5 text-right">Balance</th>
                <th className="border border-gray-300 px-2 py-1.5">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.id} className={r.cancelled ? "text-gray-400 line-through" : ""}>
                  <td className="border border-gray-300 px-2 py-1.5">{i + 1}</td>
                  <td className="border border-gray-300 px-2 py-1.5">{r.number}</td>
                  <td className="border border-gray-300 px-2 py-1.5">
                    {r.date.toLocaleDateString("en-IN")}
                  </td>
                  <td className="border border-gray-300 px-2 py-1.5">{r.billName}</td>
                  <td className="border border-gray-300 px-2 py-1.5">
                    {invoiceTypeLabel(r.type)}
                  </td>
                  <td className="border border-gray-300 px-2 py-1.5 text-right">
                    {formatINR(r.grandTotal)}
                  </td>
                  <td className="border border-gray-300 px-2 py-1.5 text-right">
                    {formatINR(r.received)}
                  </td>
                  <td className="border border-gray-300 px-2 py-1.5 text-right">
                    {formatINR(r.balance)}
                  </td>
                  <td className="border border-gray-300 px-2 py-1.5">{r.status}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 font-bold">
                <td className="border border-gray-300 px-2 py-1.5" colSpan={5}>
                  Total ({counted.length} billable)
                </td>
                <td className="border border-gray-300 px-2 py-1.5 text-right">
                  {formatINR(totals.grand)}
                </td>
                <td className="border border-gray-300 px-2 py-1.5 text-right">
                  {formatINR(totals.received)}
                </td>
                <td className="border border-gray-300 px-2 py-1.5 text-right">
                  {formatINR(totals.balance)}
                </td>
                <td className="border border-gray-300 px-2 py-1.5" />
              </tr>
            </tfoot>
          </table>
        )}

        <p className="mt-4 text-[10px] text-gray-500">
          Estimates and cancelled bills are listed for reference but excluded
          from the money totals. Taxable {formatINR(totals.sub)} · GST{" "}
          {formatINR(totals.tax)}.
        </p>
      </div>

      {/* Non-print quick links to open any bill */}
      {rows.length > 0 && (
        <div className="no-print mt-4 flex flex-wrap gap-2 text-xs text-muted">
          Open:
          {rows.slice(0, 30).map((r) => (
            <Link
              key={r.id}
              href={`/admin/invoices/${r.id}`}
              className="text-gold hover:underline"
            >
              {r.number}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-300 p-3">
      <p className="text-[10px] uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-0.5 text-base font-bold">{value}</p>
    </div>
  );
}
