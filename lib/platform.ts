/**
 * The SaaS platform brand — the parent portal that hosts client businesses.
 * Each client (tenant), e.g. Mahadev APF, runs on RudrOne. Kept in one place
 * so the portal, sign-up, super-admin and "Powered by" branding all agree.
 */
export const PLATFORM = {
  /** Product / portal name shown to the world. */
  name: "RudrOne",
  /** The company behind it. */
  company: "Rudrax",
  tagline: "Billing & website platform for growing businesses",
  /** Footer credit shown on client sites (hidden for plans with removeBranding). */
  poweredBy: "Powered by RudrOne",
  /** Portal root domain — placeholder until the domain is registered. */
  domain: "rudrone.com",
  /** How a client's subdomain is formed: <slug>.rudrone.com */
  clientHost(slug: string): string {
    return `${slug}.${this.domain}`;
  },
};
