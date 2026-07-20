import "server-only";
import { headers } from "next/headers";
import { prisma } from "./db";
import { getPlan, type Plan } from "./plans";
import { tenantSlugFromHost, isPortalHost, normalizeHost } from "./host";

/**
 * Resolves the "current business" for a request from the request host:
 *   - `<slug>.rudrone.com`      -> that business (by slug)
 *   - a business's own domain   -> that business (by Tenant.domain)
 *   - the RudrOne portal / dev  -> the default business (keeps the current
 *                                  single-tenant deployment working unchanged)
 * So every business can live on its own URL while all of them sit inside RudrOne.
 */

export const DEFAULT_TENANT_SLUG = "mahadev";

/** The request host (lowercased, no port), or "" outside a request scope. */
async function currentHost(): Promise<string> {
  try {
    return normalizeHost((await headers()).get("host"));
  } catch {
    return "";
  }
}

export type CurrentTenant = {
  id: string;
  slug: string;
  name: string;
  plan: string;
  status: string;
  planDetails: Plan;
};

/** Just the current tenant id — for scoping queries (`where: { tenantId }`). */
export async function getTenantId(): Promise<string> {
  return (await getCurrentTenant()).id;
}

/** The current business account, or a safe fallback if none is seeded yet. */
export async function getCurrentTenant(): Promise<CurrentTenant> {
  const host = await currentHost();
  const subSlug = tenantSlugFromHost(host); // "mahadev" for mahadev.rudrone.com, else null

  let row = null;
  try {
    if (subSlug) {
      // A platform subdomain names the business directly. If it doesn't exist,
      // leave row null (unknown subdomain shows an empty business, not the default).
      row = await prisma.tenant.findUnique({ where: { slug: subSlug } });
    } else if (host && !isPortalHost(host)) {
      // A business on its own domain (mahadevapf.com, mahadev-apf.vercel.app…).
      row = await prisma.tenant.findFirst({ where: { domain: host } });
    }
    // Custom-domain miss, portal host, or build/dev (no host) → the default
    // business, so the current single-tenant deployment keeps working.
    if (!row && !subSlug) {
      row = await prisma.tenant.findUnique({ where: { slug: DEFAULT_TENANT_SLUG } });
    }
  } catch {
    row = null;
  }

  const slug = row?.slug ?? subSlug ?? DEFAULT_TENANT_SLUG;
  const isDefault = slug === DEFAULT_TENANT_SLUG;
  // Before the tenant table is seeded, treat the default business as fully
  // featured so nothing is gated off unexpectedly.
  const plan = row?.plan ?? (isDefault ? "max" : "free");
  return {
    id: row?.id ?? (isDefault ? "tenant_mahadev" : `tenant_${slug}`),
    slug,
    name: row?.name ?? (isDefault ? "Mahadev APF" : slug),
    plan,
    status: row?.status ?? "active",
    planDetails: getPlan(plan),
  };
}
