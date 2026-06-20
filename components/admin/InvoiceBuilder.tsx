"use client";

import { useMemo, useState, useTransition } from "react";
import { createInvoice } from "@/lib/actions/invoice-actions";
import type { CreateInvoiceInput } from "@/lib/invoice-types";
import { computeTotals, formatINR } from "@/lib/money";
import { units } from "@/lib/shop";

type CustomerOpt = {
  id: string;
  name: string;
  phone: string | null;
  gstin: string | null;
  address: string | null;
};
type MaterialOpt = {
  id: string;
  name: string;
  unit: string;
  hsn: string | null;
  rate: number;
  taxRate: number;
};

type Row = {
  key: number;
  description: string;
  hsn: string;
  unit: string;
  quantity: number;
  rate: number;
  taxRate: number;
};

const inputCls =
  "w-full rounded-lg border border-white/10 bg-ink/60 px-3 py-2 text-sm outline-none focus:border-gold";

let rowSeq = 1;
const emptyRow = (): Row => ({
  key: rowSeq++,
  description: "",
  hsn: "",
  unit: "nos",
  quantity: 1,
  rate: 0,
  taxRate: 18,
});

export default function InvoiceBuilder({
  customers,
  materials,
}: {
  customers: CustomerOpt[];
  materials: MaterialOpt[];
}) {
  const [type, setType] = useState<"TAX" | "ESTIMATE">("TAX");
  const [interState, setInterState] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const [billName, setBillName] = useState("");
  const [billPhone, setBillPhone] = useState("");
  const [billGstin, setBillGstin] = useState("");
  const [billAddress, setBillAddress] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState("");
  const [rows, setRows] = useState<Row[]>([emptyRow()]);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const isTax = type === "TAX";

  const totals = useMemo(
    () =>
      computeTotals(
        rows.map((r) => ({
          quantity: Number(r.quantity) || 0,
          rate: Number(r.rate) || 0,
          taxRate: isTax ? Number(r.taxRate) || 0 : 0,
        })),
        { isTax, interState, discount: Number(discount) || 0 },
      ),
    [rows, isTax, interState, discount],
  );

  function pickCustomer(id: string) {
    setCustomerId(id);
    const c = customers.find((x) => x.id === id);
    if (c) {
      setBillName(c.name);
      setBillPhone(c.phone ?? "");
      setBillGstin(c.gstin ?? "");
      setBillAddress(c.address ?? "");
    }
  }

  function addMaterial(id: string) {
    const m = materials.find((x) => x.id === id);
    if (!m) return;
    setRows((rs) => [
      ...rs.filter((r) => r.description || r.rate),
      {
        key: rowSeq++,
        description: m.name,
        hsn: m.hsn ?? "",
        unit: m.unit,
        quantity: 1,
        rate: m.rate,
        taxRate: m.taxRate,
      },
    ]);
  }

  function updateRow(key: number, patch: Partial<Row>) {
    setRows((rs) => rs.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  }
  function removeRow(key: number) {
    setRows((rs) => (rs.length > 1 ? rs.filter((r) => r.key !== key) : rs));
  }

  function submit() {
    setError(null);
    if (!billName.trim()) return setError("Enter a customer name.");
    const items = rows.filter(
      (r) => r.description.trim() && (Number(r.quantity) || 0) > 0,
    );
    if (items.length === 0) return setError("Add at least one line item.");

    const payload: CreateInvoiceInput = {
      type,
      customerId: customerId || null,
      billName,
      billPhone,
      billGstin,
      billAddress,
      interState: isTax ? interState : false,
      date,
      discount: Number(discount) || 0,
      notes,
      items: items.map((r) => ({
        description: r.description,
        hsn: r.hsn,
        unit: r.unit,
        quantity: Number(r.quantity) || 0,
        rate: Number(r.rate) || 0,
        taxRate: Number(r.taxRate) || 0,
      })),
    };

    startTransition(async () => {
      try {
        await createInvoice(payload);
      } catch (e) {
        // redirect() throws internally on success; only surface real errors.
        const msg = e instanceof Error ? e.message : "";
        if (msg && !msg.includes("NEXT_REDIRECT")) setError(msg);
      }
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      {/* Left: form */}
      <div className="space-y-6">
        {/* Type + meta */}
        <div className="rounded-2xl border border-white/10 bg-ink-soft/40 p-5">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {(["TAX", "ESTIMATE"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  type === t
                    ? "bg-gold text-ink"
                    : "border border-white/15 text-muted hover:text-paper"
                }`}
              >
                {t === "TAX" ? "GST Tax Invoice" : "Estimate / Quotation"}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-2">
              <label className="text-xs text-muted">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={inputCls + " w-auto"}
              />
            </div>
          </div>

          {isTax && (
            <label className="flex items-center gap-2 text-sm text-muted">
              <input
                type="checkbox"
                checked={interState}
                onChange={(e) => setInterState(e.target.checked)}
              />
              Inter-state supply (apply IGST instead of CGST + SGST)
            </label>
          )}
        </div>

        {/* Customer */}
        <div className="rounded-2xl border border-white/10 bg-ink-soft/40 p-5">
          <h2 className="mb-3 font-heading text-lg font-bold">Bill To</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <select
              value={customerId}
              onChange={(e) => pickCustomer(e.target.value)}
              className={inputCls}
            >
              <option value="">— Select saved customer —</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.phone ? `(${c.phone})` : ""}
                </option>
              ))}
            </select>
            <input
              placeholder="Customer name *"
              value={billName}
              onChange={(e) => setBillName(e.target.value)}
              className={inputCls}
            />
            <input
              placeholder="Phone"
              value={billPhone}
              onChange={(e) => setBillPhone(e.target.value)}
              className={inputCls}
            />
            <input
              placeholder="GSTIN (for tax invoice)"
              value={billGstin}
              onChange={(e) => setBillGstin(e.target.value)}
              className={inputCls}
            />
            <textarea
              placeholder="Address"
              value={billAddress}
              onChange={(e) => setBillAddress(e.target.value)}
              rows={2}
              className={inputCls + " sm:col-span-2"}
            />
          </div>
        </div>

        {/* Line items */}
        <div className="rounded-2xl border border-white/10 bg-ink-soft/40 p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-heading text-lg font-bold">Items</h2>
            <select
              value=""
              onChange={(e) => e.target.value && addMaterial(e.target.value)}
              className={inputCls + " w-auto"}
            >
              <option value="">+ Add from rate list…</option>
              {materials.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} — ₹{m.rate}/{m.unit}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            {rows.map((r) => {
              const amount = (Number(r.quantity) || 0) * (Number(r.rate) || 0);
              return (
                <div
                  key={r.key}
                  className="grid grid-cols-12 gap-2 rounded-lg border border-white/5 p-2"
                >
                  <input
                    placeholder="Description *"
                    value={r.description}
                    onChange={(e) => updateRow(r.key, { description: e.target.value })}
                    className={inputCls + " col-span-12 md:col-span-4"}
                  />
                  {isTax && (
                    <input
                      placeholder="HSN"
                      value={r.hsn}
                      onChange={(e) => updateRow(r.key, { hsn: e.target.value })}
                      className={inputCls + " col-span-4 md:col-span-1"}
                    />
                  )}
                  <select
                    value={r.unit}
                    onChange={(e) => updateRow(r.key, { unit: e.target.value })}
                    className={inputCls + " col-span-4 md:col-span-1"}
                  >
                    {units.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Qty"
                    value={r.quantity}
                    onChange={(e) => updateRow(r.key, { quantity: Number(e.target.value) })}
                    className={inputCls + " col-span-4 md:col-span-1"}
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Rate"
                    value={r.rate}
                    onChange={(e) => updateRow(r.key, { rate: Number(e.target.value) })}
                    className={inputCls + " col-span-4 md:col-span-2"}
                  />
                  {isTax && (
                    <input
                      type="number"
                      step="0.01"
                      placeholder="GST%"
                      value={r.taxRate}
                      onChange={(e) => updateRow(r.key, { taxRate: Number(e.target.value) })}
                      className={inputCls + " col-span-4 md:col-span-1"}
                    />
                  )}
                  <div
                    className={`col-span-6 flex items-center justify-end px-2 text-sm ${
                      isTax ? "md:col-span-1" : "md:col-span-3"
                    }`}
                  >
                    {formatINR(amount)}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeRow(r.key)}
                    className="col-span-2 text-muted hover:text-red-300 md:col-span-1"
                    aria-label="Remove row"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setRows((rs) => [...rs, emptyRow()])}
            className="mt-3 rounded-lg border border-white/15 px-3 py-1.5 text-sm text-muted hover:text-paper"
          >
            + Add row
          </button>
        </div>

        <textarea
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className={inputCls}
        />
      </div>

      {/* Right: summary */}
      <div className="h-fit space-y-3 rounded-2xl border border-gold/20 bg-gold/5 p-5 lg:sticky lg:top-6">
        <h2 className="font-heading text-lg font-bold">Summary</h2>
        <Row label="Sub-total" value={formatINR(totals.subTotal)} />
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">Discount ₹</span>
          <input
            type="number"
            step="0.01"
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
            className={inputCls + " w-28 text-right"}
          />
        </div>
        {isTax && !interState && (
          <>
            <Row label="CGST" value={formatINR(totals.cgst)} />
            <Row label="SGST" value={formatINR(totals.sgst)} />
          </>
        )}
        {isTax && interState && <Row label="IGST" value={formatINR(totals.igst)} />}
        <div className="my-2 border-t border-white/10" />
        <div className="flex items-center justify-between">
          <span className="font-heading font-bold">Grand Total</span>
          <span className="font-heading text-xl font-bold text-gold">
            {formatINR(totals.grandTotal)}
          </span>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="button"
          onClick={submit}
          disabled={pending}
          className="mt-2 w-full rounded-full bg-gold py-3 text-sm font-semibold text-ink transition-colors hover:bg-gold-soft disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save Invoice"}
        </button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted">{label}</span>
      <span>{value}</span>
    </div>
  );
}
