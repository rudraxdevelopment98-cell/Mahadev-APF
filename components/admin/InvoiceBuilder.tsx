"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { createInvoice, updateInvoice } from "@/lib/actions/invoice-actions";
import type { CreateInvoiceInput } from "@/lib/invoice-types";
import { computeTotals, formatINR } from "@/lib/money";
import { units } from "@/lib/shop";

export type InitialInvoice = {
  type: "TAX" | "ESTIMATE";
  interState: boolean;
  customerId: string;
  billName: string;
  billPhone: string;
  billGstin: string;
  billAddress: string;
  date: string;
  discount: number;
  discountType: "AMOUNT" | "PERCENT";
  roundOff: boolean;
  notes: string;
  items: {
    description: string;
    hsn: string;
    unit: string;
    quantity: number;
    rate: number;
    taxRate: number;
  }[];
};

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

const DRAFT_KEY = "mapf_invoice_draft_v1";

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
  mode = "create",
  invoiceId,
  initial,
}: {
  customers: CustomerOpt[];
  materials: MaterialOpt[];
  mode?: "create" | "edit";
  invoiceId?: string;
  initial?: InitialInvoice;
}) {
  const [type, setType] = useState<"TAX" | "ESTIMATE">(initial?.type ?? "TAX");
  const [interState, setInterState] = useState(initial?.interState ?? false);
  const [customerId, setCustomerId] = useState(initial?.customerId ?? "");
  const [billName, setBillName] = useState(initial?.billName ?? "");
  const [billPhone, setBillPhone] = useState(initial?.billPhone ?? "");
  const [billGstin, setBillGstin] = useState(initial?.billGstin ?? "");
  const [billAddress, setBillAddress] = useState(initial?.billAddress ?? "");
  const [date, setDate] = useState(
    initial?.date ?? new Date().toISOString().slice(0, 10),
  );
  const [discount, setDiscount] = useState(initial?.discount ?? 0);
  const [discountType, setDiscountType] = useState<"AMOUNT" | "PERCENT">(
    initial?.discountType ?? "AMOUNT",
  );
  const [roundOff, setRoundOff] = useState(initial?.roundOff ?? true);
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [rows, setRows] = useState<Row[]>(
    initial && initial.items.length
      ? initial.items.map((i) => ({ key: rowSeq++, ...i }))
      : [emptyRow()],
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const isTax = type === "TAX";

  // ---- Auto-save draft (create mode only) so leaving the tab doesn't lose work ----
  const draftEnabled = mode === "create";
  const skipSave = useRef(true);
  const [hasDraft, setHasDraft] = useState(false);

  useEffect(() => {
    if (!draftEnabled) return;
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const d = JSON.parse(raw);
        if (d && typeof d === "object") {
          if (d.type) setType(d.type);
          setInterState(!!d.interState);
          setCustomerId(d.customerId ?? "");
          setBillName(d.billName ?? "");
          setBillPhone(d.billPhone ?? "");
          setBillGstin(d.billGstin ?? "");
          setBillAddress(d.billAddress ?? "");
          if (d.date) setDate(d.date);
          setDiscount(Number(d.discount) || 0);
          if (d.discountType) setDiscountType(d.discountType);
          setRoundOff(d.roundOff !== false);
          setNotes(d.notes ?? "");
          if (Array.isArray(d.rows) && d.rows.length) {
            setRows(
              d.rows.map((r: Partial<Row>) => ({
                key: rowSeq++,
                description: r.description ?? "",
                hsn: r.hsn ?? "",
                unit: r.unit ?? "nos",
                quantity: Number(r.quantity) || 0,
                rate: Number(r.rate) || 0,
                taxRate: Number(r.taxRate) || 18,
              })),
            );
          }
          if (d.billName || (Array.isArray(d.rows) && d.rows.some((r: Partial<Row>) => r.description)))
            setHasDraft(true);
        }
      }
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!draftEnabled) return;
    if (skipSave.current) {
      skipSave.current = false;
      return;
    }
    try {
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({
          type, interState, customerId, billName, billPhone, billGstin,
          billAddress, date, discount, discountType, roundOff, notes,
          rows: rows.map(({ description, hsn, unit, quantity, rate, taxRate }) => ({
            description, hsn, unit, quantity, rate, taxRate,
          })),
        }),
      );
      setHasDraft(true);
    } catch {
      /* ignore */
    }
  }, [
    draftEnabled, type, interState, customerId, billName, billPhone, billGstin,
    billAddress, date, discount, discountType, roundOff, notes, rows,
  ]);

  function clearDraft() {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* ignore */
    }
    setHasDraft(false);
  }

  function startFresh() {
    clearDraft();
    setType("TAX");
    setInterState(false);
    setCustomerId("");
    setBillName("");
    setBillPhone("");
    setBillGstin("");
    setBillAddress("");
    setDate(new Date().toISOString().slice(0, 10));
    setDiscount(0);
    setDiscountType("AMOUNT");
    setRoundOff(true);
    setNotes("");
    setRows([emptyRow()]);
  }

  const totals = useMemo(
    () =>
      computeTotals(
        rows.map((r) => ({
          quantity: Number(r.quantity) || 0,
          rate: Number(r.rate) || 0,
          taxRate: isTax ? Number(r.taxRate) || 0 : 0,
        })),
        {
          isTax,
          interState,
          discount: Number(discount) || 0,
          discountType,
          roundOff,
        },
      ),
    [rows, isTax, interState, discount, discountType, roundOff],
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
      discountType,
      roundOff,
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
        if (mode === "edit" && invoiceId) {
          await updateInvoice(invoiceId, payload);
        } else {
          clearDraft();
          await createInvoice(payload);
        }
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
        {draftEnabled && hasDraft && (
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-2.5 text-sm text-emerald-300">
            <span>✓ Draft saved automatically — you can leave and come back.</span>
            <button
              type="button"
              onClick={startFresh}
              className="rounded-full border border-emerald-400/40 px-3 py-1 text-xs hover:bg-emerald-400/10"
            >
              Start fresh
            </button>
          </div>
        )}

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

          <div className="space-y-4">
            {rows.map((r, idx) => {
              const amount = (Number(r.quantity) || 0) * (Number(r.rate) || 0);
              return (
                <div
                  key={r.key}
                  className="rounded-xl border border-white/10 bg-ink/40 p-3 sm:p-4"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-muted">
                      Item {idx + 1}
                    </span>
                    {rows.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRow(r.key)}
                        className="text-xs text-muted hover:text-red-300"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {/* Description */}
                  <label className="mb-1 block text-[11px] uppercase tracking-wide text-muted">
                    Description
                  </label>
                  <input
                    placeholder="e.g. Aluminium sliding window"
                    value={r.description}
                    onChange={(e) => updateRow(r.key, { description: e.target.value })}
                    className={inputCls}
                  />

                  {/* Fields */}
                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                    <div>
                      <label className="mb-1 block text-[11px] uppercase tracking-wide text-muted">
                        Unit
                      </label>
                      <input
                        list="mapf-units"
                        value={r.unit}
                        onChange={(e) => updateRow(r.key, { unit: e.target.value })}
                        placeholder="sqft / nos / set…"
                        className={inputCls}
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-[11px] uppercase tracking-wide text-muted">
                        Quantity
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        inputMode="decimal"
                        placeholder="0"
                        value={r.quantity}
                        onChange={(e) => updateRow(r.key, { quantity: Number(e.target.value) })}
                        className={inputCls}
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-[11px] uppercase tracking-wide text-muted">
                        Rate (₹)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        inputMode="decimal"
                        placeholder="0"
                        value={r.rate}
                        onChange={(e) => updateRow(r.key, { rate: Number(e.target.value) })}
                        className={inputCls}
                      />
                    </div>

                    {isTax && (
                      <div>
                        <label className="mb-1 block text-[11px] uppercase tracking-wide text-muted">
                          GST %
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          inputMode="decimal"
                          placeholder="18"
                          value={r.taxRate}
                          onChange={(e) => updateRow(r.key, { taxRate: Number(e.target.value) })}
                          className={inputCls}
                        />
                      </div>
                    )}

                    {isTax && (
                      <div>
                        <label className="mb-1 block text-[11px] uppercase tracking-wide text-muted">
                          HSN / SAC
                        </label>
                        <input
                          placeholder="optional"
                          value={r.hsn}
                          onChange={(e) => updateRow(r.key, { hsn: e.target.value })}
                          className={inputCls}
                        />
                      </div>
                    )}

                    <div className="col-span-2 sm:col-span-1">
                      <label className="mb-1 block text-[11px] uppercase tracking-wide text-muted">
                        Amount
                      </label>
                      <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium">
                        {formatINR(amount)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Unit suggestions — typing a custom unit (basket, piece, lot…) is allowed */}
          <datalist id="mapf-units">
            {units.map((u) => (
              <option key={u} value={u} />
            ))}
          </datalist>

          <button
            type="button"
            onClick={() => setRows((rs) => [...rs, emptyRow()])}
            className="mt-3 rounded-lg border border-gold/40 px-4 py-2 text-sm font-medium text-gold hover:bg-gold hover:text-ink"
          >
            + Add another item / extra charge
          </button>
          <p className="mt-2 text-xs text-muted">
            Add anything — windows in sqft, or extras like hardware, basket,
            fittings. Type the name, unit, quantity and rate.
          </p>
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
        <Row label="Items total" value={formatINR(totals.gross)} />

        <div className="flex items-center justify-between gap-2 text-sm">
          <span className="text-muted">Discount</span>
          <div className="flex items-center gap-1">
            <input
              type="number"
              step="0.01"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              className={inputCls + " w-20 text-right"}
            />
            <div className="flex overflow-hidden rounded-lg border border-white/10">
              {(["AMOUNT", "PERCENT"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setDiscountType(t)}
                  className={`px-2 py-1.5 text-xs ${
                    discountType === t ? "bg-gold text-ink" : "text-muted"
                  }`}
                >
                  {t === "AMOUNT" ? "₹" : "%"}
                </button>
              ))}
            </div>
          </div>
        </div>
        {totals.discountValue > 0 && (
          <Row label="Discount applied" value={`– ${formatINR(totals.discountValue)}`} />
        )}

        <Row label="Taxable" value={formatINR(totals.subTotal)} />
        {isTax && !interState && (
          <>
            <Row label="CGST" value={formatINR(totals.cgst)} />
            <Row label="SGST" value={formatINR(totals.sgst)} />
          </>
        )}
        {isTax && interState && <Row label="IGST" value={formatINR(totals.igst)} />}

        <label className="flex items-center justify-between text-sm">
          <span className="text-muted">Round off to nearest ₹</span>
          <input
            type="checkbox"
            checked={roundOff}
            onChange={(e) => setRoundOff(e.target.checked)}
          />
        </label>
        {roundOff && totals.roundOff !== 0 && (
          <Row
            label="Round off"
            value={`${totals.roundOff > 0 ? "+" : ""}${formatINR(totals.roundOff)}`}
          />
        )}

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
          {pending ? "Saving…" : mode === "edit" ? "Update Invoice" : "Save Invoice"}
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
