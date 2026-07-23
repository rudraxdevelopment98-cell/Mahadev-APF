/**
 * The homepage section catalog. A business chooses which sections show and in
 * what order (stored per-business in SiteSettings.sections). Pure module.
 */

import type { Feature } from "./plans";

export type SectionDef = {
  key: string;
  label: string;
  desc: string;
  /** Always-on sections can be reordered but not turned off. */
  always?: boolean;
  /** Plan feature required to use this section (undefined = any website plan). */
  feature?: Feature;
};

export const SITE_SECTIONS: SectionDef[] = [
  { key: "hero", label: "Hero banner", desc: "The big headline at the top", always: true },
  { key: "about", label: "About", desc: "Your story / who you are" },
  { key: "stats", label: "Numbers", desc: "Years, projects, the counters" },
  { key: "products", label: "Products & services", desc: "What you offer" },
  { key: "industries", label: "Spaces & industries", desc: "Who you work for" },
  { key: "why", label: "Why choose us", desc: "Your strengths" },
  { key: "gallery", label: "Gallery", desc: "Photos of your work" },
  { key: "testimonials", label: "Reviews", desc: "What customers say" },
  { key: "booking", label: "Book an appointment", desc: "Let visitors request an appointment", feature: "booking" },
  { key: "contact", label: "Contact", desc: "How to reach you", always: true },
];

/** The plan feature a section needs, if any. */
export function sectionFeature(key: string): Feature | undefined {
  return sectionDef(key)?.feature;
}

/** The default homepage layout — every section except opt-in premium ones. */
export const DEFAULT_SECTIONS = SITE_SECTIONS.filter((s) => !s.feature).map((s) => s.key);

/** Every section key that may appear in a stored order (incl. premium ones). */
const VALID = new Set(SITE_SECTIONS.map((s) => s.key));

export function sectionDef(key: string): SectionDef | undefined {
  return SITE_SECTIONS.find((s) => s.key === key);
}

export function isAlwaysOn(key: string): boolean {
  return !!sectionDef(key)?.always;
}

/**
 * Clean a stored sections value into a valid, ordered, de-duplicated list of
 * enabled section keys. Empty/invalid → the full default order; always-on
 * sections are forced in (hero first, contact last).
 */
export function normalizeSections(raw: unknown): string[] {
  let list = Array.isArray(raw)
    ? raw.filter((k): k is string => typeof k === "string" && VALID.has(k))
    : [];
  list = [...new Set(list)];
  if (list.length === 0) list = [...DEFAULT_SECTIONS];
  for (const s of SITE_SECTIONS) {
    if (s.always && !list.includes(s.key)) {
      if (s.key === "hero") list.unshift(s.key);
      else list.push(s.key);
    }
  }
  return list;
}
