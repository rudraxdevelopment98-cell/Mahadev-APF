export type InvoiceItemInput = {
  description: string;
  hsn?: string;
  unit: string;
  quantity: number;
  rate: number;
  taxRate: number;
};

/** TAX = GST invoice · NOGST = plain invoice without GST · ESTIMATE = quotation */
export type InvoiceType = "TAX" | "NOGST" | "ESTIMATE";

/** Short document label used on screens, prints and WhatsApp messages. */
export function invoiceTypeLabel(type: string): string {
  if (type === "ESTIMATE") return "Estimate";
  if (type === "NOGST") return "Invoice";
  return "Tax Invoice";
}

export type CreateInvoiceInput = {
  type: InvoiceType;
  customerId?: string | null;
  billName: string;
  billPhone?: string;
  billGstin?: string;
  billAddress?: string;
  interState: boolean;
  showBank: boolean;
  date?: string;
  discount: number;
  discountType: "AMOUNT" | "PERCENT";
  roundOff: boolean;
  notes?: string;
  items: InvoiceItemInput[];
};
