import { shop } from "./shop";

/** Round to 2 decimals, avoiding float drift. */
export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/** Format a number as Indian Rupees, e.g. 12500 -> "₹12,500.00". */
export function formatINR(n: number): string {
  return `${shop.currencySymbol}${(n || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export type LineInput = {
  quantity: number;
  rate: number;
  taxRate: number; // percentage
};

export type Totals = {
  gross: number;
  discountValue: number; // resolved rupee discount
  subTotal: number;
  taxTotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  roundOff: number;
  grandTotal: number;
};

/**
 * Compute invoice totals.
 * @param isTax        whether GST is applied (tax invoice vs plain estimate)
 * @param interState   true => IGST, false => CGST + SGST (split equally)
 * @param discount     discount value (rupees, or percent if discountType=PERCENT)
 * @param discountType "AMOUNT" (flat ₹) or "PERCENT" (% of gross)
 * @param roundOff     whether to round the grand total to the nearest rupee
 */
export function computeTotals(
  lines: LineInput[],
  opts: {
    isTax: boolean;
    interState: boolean;
    discount?: number;
    discountType?: "AMOUNT" | "PERCENT";
    roundOff?: boolean;
  },
): Totals {
  const gross = lines.reduce(
    (sum, l) => sum + (Number(l.quantity) || 0) * (Number(l.rate) || 0),
    0,
  );

  const rawDiscount = Number(opts.discount) || 0;
  const discountValue =
    opts.discountType === "PERCENT"
      ? round2((gross * rawDiscount) / 100)
      : Math.min(rawDiscount, gross);

  const subTotal = round2(gross - discountValue);

  let taxTotal = 0;
  if (opts.isTax) {
    const factor = gross > 0 ? (gross - discountValue) / gross : 1;
    for (const l of lines) {
      const lineTaxable = (Number(l.quantity) || 0) * (Number(l.rate) || 0) * factor;
      taxTotal += (lineTaxable * (Number(l.taxRate) || 0)) / 100;
    }
    taxTotal = round2(taxTotal);
  }

  const cgst = opts.isTax && !opts.interState ? round2(taxTotal / 2) : 0;
  const sgst = opts.isTax && !opts.interState ? round2(taxTotal - cgst) : 0;
  const igst = opts.isTax && opts.interState ? taxTotal : 0;

  const beforeRound = round2(subTotal + taxTotal);
  const rounded = opts.roundOff ? Math.round(beforeRound) : beforeRound;
  const roundOff = opts.roundOff ? round2(rounded - beforeRound) : 0;

  return {
    gross: round2(gross),
    discountValue,
    subTotal,
    taxTotal,
    cgst,
    sgst,
    igst,
    roundOff,
    grandTotal: round2(rounded),
  };
}

/** Convert a rupee amount to Indian-format words, e.g. "One Thousand Five Hundred Rupees Only". */
export function amountInWords(amount: number): string {
  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);

  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight",
    "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
    "Sixteen", "Seventeen", "Eighteen", "Nineteen",
  ];
  const tens = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy",
    "Eighty", "Ninety",
  ];

  const twoDigits = (n: number): string => {
    if (n < 20) return ones[n];
    return `${tens[Math.floor(n / 10)]}${n % 10 ? " " + ones[n % 10] : ""}`;
  };

  const threeDigits = (n: number): string => {
    const h = Math.floor(n / 100);
    const rest = n % 100;
    return `${h ? ones[h] + " Hundred" + (rest ? " " : "") : ""}${
      rest ? twoDigits(rest) : ""
    }`;
  };

  const inWords = (n: number): string => {
    if (n === 0) return "Zero";
    const crore = Math.floor(n / 10000000);
    n %= 10000000;
    const lakh = Math.floor(n / 100000);
    n %= 100000;
    const thousand = Math.floor(n / 1000);
    n %= 1000;
    const hundred = n;

    let out = "";
    if (crore) out += `${inWords(crore)} Crore `;
    if (lakh) out += `${twoDigits(lakh)} Lakh `;
    if (thousand) out += `${twoDigits(thousand)} Thousand `;
    if (hundred) out += threeDigits(hundred);
    return out.trim();
  };

  let words = `${inWords(rupees)} Rupees`;
  if (paise > 0) words += ` and ${twoDigits(paise)} Paise`;
  return `${words} Only`;
}
