export type InvoiceItemInput = {
  description: string;
  hsn?: string;
  unit: string;
  quantity: number;
  rate: number;
  taxRate: number;
};

export type CreateInvoiceInput = {
  type: "TAX" | "ESTIMATE";
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
