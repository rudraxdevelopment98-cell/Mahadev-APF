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
  subTotal: number;
  taxTotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  grandTotal: number;
};

/**
 * Compute invoice totals.
 * @param isTax     whether GST is applied (tax invoice vs plain estimate)
 * @param interState true => IGST, false => CGST + SGST (split equally)
 * @param discount   flat amount subtracted from the taxable value
 */
export function computeTotals(
  lines: LineInput[],
  opts: { isTax: boolean; interState: boolean; discount?: number },
): Totals {
  const gross = lines.reduce(
    (sum, l) => sum + (Number(l.quantity) || 0) * (Number(l.rate) || 0),
    0,
  );
  const discount = Math.min(Number(opts.discount) || 0, gross);
  const subTotal = round2(gross - discount);

  if (!opts.isTax) {
    return {
      subTotal,
      taxTotal: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
      grandTotal: subTotal,
    };
  }

  // Apply the same proportional discount to each line before taxing it.
  const factor = gross > 0 ? (gross - discount) / gross : 1;
  let taxTotal = 0;
  for (const l of lines) {
    const lineTaxable = (Number(l.quantity) || 0) * (Number(l.rate) || 0) * factor;
    taxTotal += (lineTaxable * (Number(l.taxRate) || 0)) / 100;
  }
  taxTotal = round2(taxTotal);

  const cgst = opts.interState ? 0 : round2(taxTotal / 2);
  const sgst = opts.interState ? 0 : round2(taxTotal - cgst);
  const igst = opts.interState ? taxTotal : 0;

  return {
    subTotal,
    taxTotal,
    cgst,
    sgst,
    igst,
    grandTotal: round2(subTotal + taxTotal),
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
