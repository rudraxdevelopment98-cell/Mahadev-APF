import { PLATFORM } from "./platform";

/** Subdomain labels that are never a tenant (portal, infra, reserved). */
export const RESERVED_SUBDOMAINS = new Set([
  "www",
  "app",
  "api",
  "admin",
  "portal",
  "dashboard",
  "mail",
  "static",
  "assets",
  "cdn",
  "status",
]);

/** True for hosts that aren't the platform root domain (custom domain, IP, dev). */
function isPlatformHost(host: string): boolean {
  return host === PLATFORM.domain || host.endsWith(`.${PLATFORM.domain}`);
}

/**
 * Work out which tenant a request host points at.
 *
 * Returns the tenant slug for a `<slug>.rudrone.com` subdomain, or `null`
 * when the host is the bare portal (`rudrone.com`, `www.`), a reserved
 * subdomain, or anything that isn't a platform host (a client's own custom
 * domain, localhost, an IP, a Vercel preview URL). A `null` result tells the
 * caller to fall back to the default tenant, so the current single-tenant
 * deployment on its own domain keeps working unchanged.
 */
export function tenantSlugFromHost(host: string | null | undefined): string | null {
  if (!host) return null;
  const name = host.split(":")[0].trim().toLowerCase(); // drop port
  if (!isPlatformHost(name)) return null; // custom domain / dev / preview

  if (name === PLATFORM.domain) return null; // bare portal
  const label = name.slice(0, -(PLATFORM.domain.length + 1)); // strip ".rudrone.com"
  if (!label || label.includes(".")) return null; // multi-level, not a tenant
  if (RESERVED_SUBDOMAINS.has(label)) return null;
  return label;
}
