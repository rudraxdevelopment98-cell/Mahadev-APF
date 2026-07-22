/**
 * Admin panel access control. Pure module (no server/DB imports) so it can be
 * used by the edge middleware, server components and client components alike.
 *
 * A user has a role and a list of granted section keys:
 *   - OWNER (or legacy ADMIN): full access + can manage users.
 *   - STAFF: can only open the sections explicitly granted to them.
 */

import type { Feature } from "./plans";

export type Section =
  | "invoices"
  | "reports"
  | "customers"
  | "materials"
  | "services"
  | "spaces"
  | "gallery"
  | "reviews"
  | "leads"
  | "appearance"
  | "settings"
  | "users";

export const SECTIONS: {
  key: Section;
  label: string;
  icon: string;
  href: string;
  ownerOnly?: boolean;
}[] = [
  { key: "invoices", label: "Invoices", icon: "🧾", href: "/admin/invoices" },
  { key: "reports", label: "Reports", icon: "📊", href: "/admin/reports" },
  { key: "customers", label: "Customers", icon: "👥", href: "/admin/customers" },
  { key: "materials", label: "Rate List", icon: "📦", href: "/admin/materials" },
  { key: "services", label: "Services", icon: "🛠️", href: "/admin/services" },
  { key: "spaces", label: "Spaces", icon: "🏠", href: "/admin/spaces" },
  { key: "gallery", label: "Gallery", icon: "🖼️", href: "/admin/gallery" },
  { key: "reviews", label: "Reviews", icon: "⭐", href: "/admin/reviews" },
  { key: "leads", label: "Enquiries", icon: "📩", href: "/admin/leads" },
  { key: "appearance", label: "Appearance", icon: "🎨", href: "/admin/appearance" },
  { key: "settings", label: "Settings", icon: "⚙️", href: "/admin/settings" },
  { key: "users", label: "Users & Access", icon: "🔑", href: "/admin/users", ownerOnly: true },
];

/** Section keys a STAFF user can be granted (everything except owner-only). */
export const GRANTABLE_SECTIONS = SECTIONS.filter((s) => !s.ownerOnly);

/**
 * Which plan feature a section requires, if any. Sections without an entry are
 * core (available on every plan). Used to hide nav items a plan can't reach.
 */
export const SECTION_FEATURE: Partial<Record<Section, Feature>> = {
  reports: "reports",
  services: "website",
  spaces: "website",
  leads: "website",
  gallery: "gallery",
  reviews: "reviews",
  appearance: "website",
  users: "multiUser",
};

/** Does the plan (given its feature list) unlock this section? */
export function planHasSection(section: Section, planFeatures: string[]): boolean {
  const needed = SECTION_FEATURE[section];
  return !needed || planFeatures.includes(needed);
}

export function isOwner(role: string | null | undefined): boolean {
  return role === "OWNER" || role === "ADMIN"; // ADMIN kept for older sessions
}

/** Can this user open the given section? */
export function userCan(
  role: string,
  perms: string[],
  section: Section,
): boolean {
  if (isOwner(role)) return true;
  const meta = SECTIONS.find((s) => s.key === section);
  if (meta?.ownerOnly) return false;
  return perms.includes(section);
}

/** Which top-level section (if any) a path belongs to. Dashboard = null (open). */
export function sectionForPath(pathname: string): Section | null {
  for (const s of SECTIONS) {
    if (pathname === s.href || pathname.startsWith(s.href + "/")) return s.key;
  }
  return null;
}

export function parsePerms(csv: string | null | undefined): string[] {
  return (csv ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}
