import { shop } from "./shop";

/**
 * All website content that the shop owner can edit from the admin.
 * Stage 1: business identity, contact details and invoice/GST details.
 * (More fields — homepage text, services, photos — are added in later stages.)
 */
export type SiteSettings = {
  name: string;
  legalName: string;
  tagline: string;
  intro: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  gstin: string;
  pan: string;
  invoicePrefix: string;
  bankName: string;
  bankAccount: string;
  bankIfsc: string;
  bankHolder: string;
  terms: string[];
};

/** Falls back to these when nothing has been saved in the admin yet. */
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
};

/** Merge a partial (from the database) over the defaults. */
export function mergeSettings(partial: Partial<SiteSettings> | null | undefined): SiteSettings {
  if (!partial) return defaultSettings;
  return {
    ...defaultSettings,
    ...partial,
    terms:
      Array.isArray(partial.terms) && partial.terms.length
        ? partial.terms
        : defaultSettings.terms,
  };
}
