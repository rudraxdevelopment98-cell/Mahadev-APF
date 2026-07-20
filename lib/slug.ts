import { RESERVED_SUBDOMAINS } from "./host";

export const SLUG_MIN = 3;
export const SLUG_MAX = 30;

/** Lowercase, trim, and reduce to the allowed subdomain charset. */
export function normalizeSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]+/g, "-") // non-alphanumerics become hyphens
    .replace(/-+/g, "-") // collapse repeats
    .replace(/^-+|-+$/g, ""); // trim hyphens
}

/**
 * Validate a desired subdomain. Returns a human-readable error, or null when
 * the slug is usable. Uniqueness is checked separately against the database.
 */
export function slugError(slug: string): string | null {
  if (slug.length < SLUG_MIN) return `Address must be at least ${SLUG_MIN} characters.`;
  if (slug.length > SLUG_MAX) return `Address must be at most ${SLUG_MAX} characters.`;
  if (!/^[a-z0-9-]+$/.test(slug)) return "Use only letters, numbers and hyphens.";
  if (slug.startsWith("-") || slug.endsWith("-")) return "Address can't start or end with a hyphen.";
  if (RESERVED_SUBDOMAINS.has(slug)) return "That address is reserved.";
  return null;
}
