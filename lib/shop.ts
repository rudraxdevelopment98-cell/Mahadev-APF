/**
 * Shop profile used across the public site and on printed invoices.
 * Edit these values to match the real business registration details.
 */
export const shop = {
  name: "Mahadev APF",
  legalName: "Mahadev Aluminium, PVC & Furniture",
  tagline: "Furniture · Aluminium & uPVC Windows · Glass Works",
  intro:
    "Your one-stop workshop for custom furniture, aluminium and uPVC windows & doors, and glass works — designed, fabricated and fitted by our own team.",
  // --- Billing / GST details (shown on tax invoices) ---
  gstin: "24XXXXXXXXXXX1Z5",
  stateCode: "24", // Gujarat
  pan: "XXXXX0000X",
  // --- Contact ---
  phone: "+91 90000 00000",
  whatsapp: "919000000000",
  email: "mahadevapf@gmail.com",
  address: "Main Road, Near Bus Stand, Ahmedabad, Gujarat 380001",
  // --- Invoice config ---
  invoicePrefix: "MAPF",
  currency: "INR",
  currencySymbol: "₹",
  bank: {
    name: "State Bank of India",
    account: "0000000000000",
    ifsc: "SBIN0000000",
    holder: "Mahadev Aluminium, PVC & Furniture",
  },
  terms: [
    "Goods once sold will not be taken back.",
    "Warranty as per manufacturer/fabrication terms.",
    "50% advance with order, balance before delivery/fitting.",
  ],
};

export type ServiceCategory =
  | "FURNITURE"
  | "ALUMINIUM"
  | "UPVC"
  | "GLASS"
  | "OTHER";

export const categoryLabels: Record<ServiceCategory, string> = {
  FURNITURE: "Furniture",
  ALUMINIUM: "Aluminium",
  UPVC: "uPVC / PVC",
  GLASS: "Glass & Misc.",
  OTHER: "Other",
};

export const units = ["nos", "sqft", "rft", "set", "kg", "pair", "job"] as const;
