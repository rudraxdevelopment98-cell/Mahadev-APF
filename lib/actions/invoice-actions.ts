"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { computeTotals, round2 } from "@/lib/money";
import { getSettings } from "@/lib/settings-server";
import type { CreateInvoiceInput } from "@/lib/invoice-types";

async function requireAuth() {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
}

/** Indian financial year string for a date, e.g. 2025-26. */
function financialYear(d: Date): string {
  const y = d.getFullYear();
  const startYear = d.getMonth() >= 3 ? y : y - 1; // FY starts in April
  return `${startYear}-${String((startYear + 1) % 100).padStart(2, "0")}`;
}

async function nextInvoiceNumber(date: Date, prefix: string): Promise<string> {
  const fy = financialYear(date);
  const start = new Date(date.getMonth() >= 3 ? date.getFullYear() : date.getFullYear() - 1, 3, 1);
  const end = new Date(start.getFullYear() + 1, 3, 1);
  const countInFy = await prisma.invoice.count({
    where: { date: { gte: start, lt: end } },
  });
  const seq = String(countInFy + 1).padStart(3, "0");
  return `${prefix}/${fy}/${seq}`;
}

export async function createInvoice(input: CreateInvoiceInput) {
  await requireAuth();

  const items = (input.items ?? []).filter(
    (i) => i.description.trim() && (Number(i.quantity) || 0) > 0,
  );
  if (!input.billName?.trim() || items.length === 0) {
    throw new Error("A customer name and at least one line item are required.");
  }

  const isTax = input.type === "TAX";
  const totals = computeTotals(
    items.map((i) => ({
      quantity: Number(i.quantity) || 0,
      rate: Number(i.rate) || 0,
      taxRate: isTax ? Number(i.taxRate) || 0 : 0,
    })),
    {
      isTax,
      interState: input.interState,
      discount: Number(input.discount) || 0,
      discountType: input.discountType === "PERCENT" ? "PERCENT" : "AMOUNT",
      roundOff: Boolean(input.roundOff),
    },
  );

  const date = input.date ? new Date(input.date) : new Date();
  const settings = await getSettings();
  const number = await nextInvoiceNumber(date, settings.invoicePrefix);

  const invoice = await prisma.invoice.create({
    data: {
      number,
      type: input.type,
      date,
      status: "ISSUED",
      customerId: input.customerId || null,
      billName: input.billName.trim(),
      billPhone: input.billPhone?.trim() || null,
      billGstin: input.billGstin?.trim() || null,
      billAddress: input.billAddress?.trim() || null,
      interState: input.interState,
      showBank: input.showBank !== false,
      notes: input.notes?.trim() || null,
      discount: Number(input.discount) || 0,
      discountType: input.discountType === "PERCENT" ? "PERCENT" : "AMOUNT",
      subTotal: totals.subTotal,
      taxTotal: totals.taxTotal,
      roundOff: totals.roundOff,
      grandTotal: totals.grandTotal,
      items: { create: itemRows(items, isTax) },
    },
  });

  revalidatePath("/admin/invoices");
  revalidatePath("/admin");
  redirect(`/admin/invoices/${invoice.id}`);
}

function itemRows(items: CreateInvoiceInput["items"], isTax: boolean) {
  return items.map((i) => ({
    description: i.description.trim(),
    hsn: i.hsn?.trim() || null,
    unit: i.unit || "nos",
    quantity: Number(i.quantity) || 0,
    rate: Number(i.rate) || 0,
    taxRate: isTax ? Number(i.taxRate) || 0 : 0,
    amount: round2((Number(i.quantity) || 0) * (Number(i.rate) || 0)),
  }));
}

/** Update an existing invoice (replaces its line items, keeps payments). */
export async function updateInvoice(id: string, input: CreateInvoiceInput) {
  await requireAuth();

  const items = (input.items ?? []).filter(
    (i) => i.description.trim() && (Number(i.quantity) || 0) > 0,
  );
  if (!input.billName?.trim() || items.length === 0) {
    throw new Error("A customer name and at least one line item are required.");
  }

  const isTax = input.type === "TAX";
  const totals = computeTotals(
    items.map((i) => ({
      quantity: Number(i.quantity) || 0,
      rate: Number(i.rate) || 0,
      taxRate: isTax ? Number(i.taxRate) || 0 : 0,
    })),
    {
      isTax,
      interState: input.interState,
      discount: Number(input.discount) || 0,
      discountType: input.discountType === "PERCENT" ? "PERCENT" : "AMOUNT",
      roundOff: Boolean(input.roundOff),
    },
  );

  await prisma.invoiceItem.deleteMany({ where: { invoiceId: id } });
  await prisma.invoice.update({
    where: { id },
    data: {
      type: input.type,
      date: input.date ? new Date(input.date) : undefined,
      customerId: input.customerId || null,
      billName: input.billName.trim(),
      billPhone: input.billPhone?.trim() || null,
      billGstin: input.billGstin?.trim() || null,
      billAddress: input.billAddress?.trim() || null,
      interState: input.interState,
      showBank: input.showBank !== false,
      notes: input.notes?.trim() || null,
      discount: Number(input.discount) || 0,
      discountType: input.discountType === "PERCENT" ? "PERCENT" : "AMOUNT",
      subTotal: totals.subTotal,
      taxTotal: totals.taxTotal,
      roundOff: totals.roundOff,
      grandTotal: totals.grandTotal,
      items: { create: itemRows(items, isTax) },
    },
  });
  await refreshStatus(id);

  revalidatePath("/admin/invoices");
  revalidatePath(`/admin/invoices/${id}`);
  revalidatePath("/admin");
  redirect(`/admin/invoices/${id}`);
}

/** Create a fresh invoice copying another one's customer + items. */
export async function duplicateInvoice(id: string) {
  await requireAuth();
  const src = await prisma.invoice.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!src) return;

  const date = new Date();
  const settings = await getSettings();
  const number = await nextInvoiceNumber(date, settings.invoicePrefix);

  const created = await prisma.invoice.create({
    data: {
      number,
      type: src.type,
      date,
      status: "ISSUED",
      customerId: src.customerId,
      billName: src.billName,
      billPhone: src.billPhone,
      billGstin: src.billGstin,
      billAddress: src.billAddress,
      interState: src.interState,
      showBank: src.showBank,
      notes: src.notes,
      discount: src.discount,
      discountType: src.discountType,
      subTotal: src.subTotal,
      taxTotal: src.taxTotal,
      roundOff: src.roundOff,
      grandTotal: src.grandTotal,
      items: {
        create: src.items.map((i) => ({
          description: i.description,
          hsn: i.hsn,
          unit: i.unit,
          quantity: i.quantity,
          rate: i.rate,
          taxRate: i.taxRate,
          amount: i.amount,
        })),
      },
    },
  });

  revalidatePath("/admin/invoices");
  redirect(`/admin/invoices/${created.id}`);
}

async function refreshStatus(invoiceId: string) {
  const inv = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { payments: true },
  });
  if (!inv || inv.status === "CANCELLED") return;
  const paid = inv.payments.reduce((s, p) => s + p.amount, 0);
  let status: string = "ISSUED";
  if (paid >= inv.grandTotal && inv.grandTotal > 0) status = "PAID";
  else if (paid > 0) status = "PARTIAL";
  await prisma.invoice.update({ where: { id: invoiceId }, data: { status } });
}

export async function addPayment(invoiceId: string, formData: FormData) {
  await requireAuth();
  const amount = Number(formData.get("amount")) || 0;
  if (amount <= 0) return;
  await prisma.payment.create({
    data: {
      invoiceId,
      amount,
      mode: String(formData.get("mode") ?? "CASH"),
      note: String(formData.get("note") ?? "").trim() || null,
    },
  });
  await refreshStatus(invoiceId);
  revalidatePath(`/admin/invoices/${invoiceId}`);
  revalidatePath("/admin");
}

export async function setInvoiceStatus(invoiceId: string, status: string) {
  await requireAuth();
  await prisma.invoice.update({ where: { id: invoiceId }, data: { status } });
  revalidatePath(`/admin/invoices/${invoiceId}`);
  revalidatePath("/admin/invoices");
}

export async function deleteInvoice(invoiceId: string) {
  await requireAuth();
  await prisma.invoice.delete({ where: { id: invoiceId } });
  revalidatePath("/admin/invoices");
  redirect("/admin/invoices");
}
