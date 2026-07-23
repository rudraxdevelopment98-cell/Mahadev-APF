/**
 * Subscription plans for the multi-business (SaaS) platform.
 *
 * Pure module — safe to import from edge middleware, server and client.
 * Each business (Tenant) is on one plan. Plans unlock features and set
 * limits; enforcement reads from here so pricing/features live in one place.
 *
 * Payment provider is intentionally not referenced here — billing (Razorpay
 * for India first, Stripe for international later) plugs in separately and
 * just sets a tenant's `plan`.
 */

export type PlanId = "free" | "plus" | "pro" | "max" | "custom";

export type Feature =
  | "invoices" // core GST / no-GST / quotation billing
  | "reports" // period + selection reports
  | "estimates" // quotations
  | "whatsappShare" // public invoice link + WhatsApp
  | "multiUser" // Users & Access (staff with permissions)
  | "website" // public marketing website + editable content
  | "gallery" // photo gallery / spaces
  | "reviews" // reviews + Google review button
  | "customDomain" // use the business's own domain
  | "removeBranding" // hide "Powered by" footer
  | "booking" // on-site appointment / booking request section
  | "prioritySupport";

export type Limits = {
  invoicesPerMonth: number; // -1 = unlimited
  users: number; // total admin users incl. owner
  storageMb: number; // uploaded images budget
};

export type Plan = {
  id: PlanId;
  name: string;
  /** Monthly price in the smallest currency unit is set by billing; this is a
   *  display hint only (₹/month). Custom = contact us. */
  priceInr: number | null;
  blurb: string;
  features: Feature[];
  limits: Limits;
};

const ALL_FEATURES: Feature[] = [
  "invoices",
  "reports",
  "estimates",
  "whatsappShare",
  "multiUser",
  "website",
  "gallery",
  "reviews",
  "customDomain",
  "removeBranding",
  "booking",
  "prioritySupport",
];

export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: "free",
    name: "Free",
    priceInr: 0,
    blurb: "Try it out — basic billing for a single user.",
    features: ["invoices", "estimates", "whatsappShare"],
    limits: { invoicesPerMonth: 25, users: 1, storageMb: 50 },
  },
  plus: {
    id: "plus",
    name: "Plus",
    priceInr: 299,
    blurb: "Billing + reports for a small team.",
    features: ["invoices", "estimates", "whatsappShare", "reports", "multiUser"],
    limits: { invoicesPerMonth: 300, users: 3, storageMb: 250 },
  },
  pro: {
    id: "pro",
    name: "Pro",
    priceInr: 799,
    blurb: "Everything to run the business online, with your own website.",
    features: [
      "invoices",
      "estimates",
      "whatsappShare",
      "reports",
      "multiUser",
      "website",
      "gallery",
      "reviews",
      "removeBranding",
    ],
    limits: { invoicesPerMonth: -1, users: 10, storageMb: 2000 },
  },
  max: {
    id: "max",
    name: "Max",
    priceInr: 1499,
    blurb: "Unlimited everything, custom domain and priority support.",
    features: ALL_FEATURES,
    limits: { invoicesPerMonth: -1, users: -1, storageMb: 10000 },
  },
  custom: {
    id: "custom",
    name: "Custom",
    priceInr: null,
    blurb: "Tailored plan and pricing for larger businesses.",
    features: ALL_FEATURES,
    limits: { invoicesPerMonth: -1, users: -1, storageMb: -1 },
  },
};

export const PLAN_ORDER: PlanId[] = ["free", "plus", "pro", "max", "custom"];

export function getPlan(id: string | null | undefined): Plan {
  return PLANS[(id as PlanId) ?? "free"] ?? PLANS.free;
}

/** Does this plan include a feature? */
export function planAllows(planId: string | null | undefined, feature: Feature): boolean {
  return getPlan(planId).features.includes(feature);
}

/** A numeric limit for a plan (-1 means unlimited). */
export function planLimit(planId: string | null | undefined, key: keyof Limits): number {
  return getPlan(planId).limits[key];
}

export function isUnlimited(value: number): boolean {
  return value < 0;
}
