"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatINR } from "@/lib/money";
import { StatusBadge } from "@/components/admin/StatusBadge";

export type InvoiceRow = {
  id: string;
  number: string;
  billName: string;
  type: string;
  dateLabel: string;
  grandTotal: number;
  balance: number;
  status: string;
};

const statuses = ["ALL", "ISSUED", "PARTIAL", "PAID", "CANCELLED"];
const kinds = [
  { key: "ALL", label: "All" },
  { key: "TAX", label: "Invoices" },
  { key: "ESTIMATE", label: "Estimates" },
];

export default function InvoiceListClient({ invoices }: { invoices: InvoiceRow[] }) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("ALL");
  const [kind, setKind] = useState("ALL");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const visible = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return invoices.filter((i) => {
      // "Invoices" = anything that isn't an estimate (GST or No-GST).
      if (kind === "TAX" && i.type === "ESTIMATE") return false;
      if (kind === "ESTIMATE" && i.type !== "ESTIMATE") return false;
      if (status !== "ALL" && i.status !== status) return false;
      if (!needle) return true;
      return (
        i.number.toLowerCase().includes(needle) ||
        i.billName.toLowerCase().includes(needle)
      );
    });
  }, [invoices, q, status, kind]);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const visibleIds = visible.map((v) => v.id);
  const allVisibleSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selected.has(id));

  function toggleAll() {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allVisibleSelected) visibleIds.forEach((id) => next.delete(id));
      else visibleIds.forEach((id) => next.add(id));
      return next;
    });
  }

  const reportHref = `/admin/reports?ids=${[...selected].join(",")}`;

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2">
        {kinds.map((k) => (
          <button
            key={k.key}
            onClick={() => setKind(k.key)}
            className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
              kind === k.key
                ? "border-gold bg-gold/10 text-gold"
                : "border-white/15 text-muted hover:text-paper"
            }`}
          >
            {k.label}
          </button>
        ))}
      </div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by number or customer…"
          className="w-full rounded-lg border border-white/10 bg-ink/60 px-3 py-2 text-sm outline-none focus:border-gold sm:max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                status === s
                  ? "border-gold bg-gold text-ink"
                  : "border-white/15 text-muted hover:text-paper"
              }`}
            >
              {s === "ALL" ? "All" : s}
            </button>
          ))}
        </div>
      </div>

      {/* Selection action bar */}
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <Link
          href="/admin/reports"
          className="rounded-full border border-white/15 px-4 py-1.5 text-xs text-paper hover:border-gold hover:text-gold"
        >
          📊 Period report
        </Link>
        {selected.size > 0 ? (
          <>
            <span className="text-xs text-muted">{selected.size} selected</span>
            <Link
              href={reportHref}
              className="rounded-full bg-gold px-4 py-1.5 text-xs font-semibold text-ink hover:bg-gold-soft"
            >
              Report from selected →
            </Link>
            <button
              onClick={() => setSelected(new Set())}
              className="text-xs text-muted hover:text-paper"
            >
              Clear
            </button>
          </>
        ) : (
          <span className="text-xs text-muted">
            Tick rows to build a report from specific bills.
          </span>
        )}
      </div>

      {visible.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-white/15 p-10 text-center text-muted">
          No matching invoices.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-white/5 text-left text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allVisibleSelected}
                    onChange={toggleAll}
                    aria-label="Select all"
                  />
                </th>
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
              {visible.map((inv) => (
                <tr key={inv.id} className="border-t border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(inv.id)}
                      onChange={() => toggle(inv.id)}
                      aria-label={`Select ${inv.number}`}
                    />
                  </td>
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
                    {inv.type === "TAX"
                      ? "Tax"
                      : inv.type === "NOGST"
                        ? "No GST"
                        : "Estimate"}
                  </td>
                  <td className="px-4 py-3 text-muted">{inv.dateLabel}</td>
                  <td className="px-4 py-3 text-right">{formatINR(inv.grandTotal)}</td>
                  <td className="px-4 py-3 text-right">
                    {inv.balance > 0 ? (
                      <span className="text-amber-300">{formatINR(inv.balance)}</span>
                    ) : (
                      <span className="text-emerald-300">Paid</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <StatusBadge status={inv.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
