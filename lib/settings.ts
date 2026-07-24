import { shop } from "./shop";
import { stats as defaultStats } from "./data";

export type StatItem = { value: number; suffix: string; label: string };

/**
 * All website content the shop owner can edit from the admin.
 * Stage 1: business identity, contact, invoice/GST details.
 * Stage 2: homepage text (hero, about, the number counters).
 */
export type SiteSettings = {
  // Business
  name: string;
  legalName: string;
  tagline: string;
  intro: string;
  // Contact
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  // Invoice / GST
  gstin: string;
  pan: string;
  invoicePrefix: string;
  bankName: string;
  bankAccount: string;
  bankIfsc: string;
  bankHolder: string;
  terms: string[];
  // Homepage — hero
  heroBadge: string;
  heroLine1: string;
  heroLine2: string;
  heroLine3: string;
  heroIntro: string;
  // Homepage — about
  aboutHeading: string;
  aboutHeadingGold: string;
  aboutPara1: string;
  aboutPara2: string;
  // Homepage — numbers
  stats: StatItem[];
  // Branding & reviews
  logoUrl: string;
  googleReviewUrl: string;
  // Section images
  aboutImageUrl: string;
};

export const defaultSettings: SiteSettings = {
  name: shop.name,
  legalName: shop.legalName,
  tagline: shop.tagline,
  intro: shop.intro,
  phone: shop.phone,
  whatsapp: shop.whatsapp,
  email: shop.email,
  address: shop.address,
  gstin: shop.gstin,
  pan: shop.pan,
  invoicePrefix: shop.invoicePrefix,
  bankName: shop.bank.name,
  bankAccount: shop.bank.account,
  bankIfsc: shop.bank.ifsc,
  bankHolder: shop.bank.holder,
  terms: shop.terms,
  heroBadge: "Aluminium · uPVC · Furniture · Glass",
  heroLine1: "Furniture, Windows",
  heroLine2: "& Glass Works",
  heroLine3: "built to fit.",
  heroIntro: shop.intro,
  aboutHeading: "Quality work, delivered by",
  aboutHeadingGold: "our own team",
  aboutPara1:
    "For over 15 years, Mahadev APF has been crafting aluminium and uPVC windows, custom furniture, modular kitchens and glass works for homes, offices and shops. Everything is built in our own workshop — so we control the quality, the cost and the timeline.",
  aboutPara2:
    "From a free measurement and design to clean, on-time fitting by our own team, we make the whole process simple — and back it with proper GST bills and friendly after-sales service.",
  stats: defaultStats,
  logoUrl: "",
  googleReviewUrl: "",
  aboutImageUrl: "",
};

/** Merge a partial (from the database) over the defaults. */
export function mergeSettings(
  partial: Partial<SiteSettings> | null | undefined,
): SiteSettings {
  if (!partial) return defaultSettings;
  return {
    ...defaultSettings,
    ...partial,
    terms:
      Array.isArray(partial.terms) && partial.terms.length
        ? partial.terms
        : defaultSettings.terms,
    stats:
      Array.isArray(partial.stats) && partial.stats.length
        ? partial.stats
        : defaultSettings.stats,
  };
}
