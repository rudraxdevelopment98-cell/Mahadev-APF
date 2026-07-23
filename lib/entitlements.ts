import "server-only";
import { redirect } from "next/navigation";
import { prisma } from "./db";
import { getCurrentTenant } from "./tenant";
import { planAllows, planLimit, isUnlimited, type Feature } from "./plans";

/**
 * Plan enforcement for the current tenant. Reads the tenant's plan (resolved
 * from the request host) and checks it against lib/plans. Server actions call
 * the `assert*` helpers as the real gate; pages/nav use the boolean helpers to
 * hide what a plan can't reach.
 */

/** Thrown when an action is blocked by the tenant's plan. Message is user-safe. */
export class PlanLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PlanLimitError";
  }
}

const FEATURE_LABEL: Record<Feature, string> = {
  invoices: "billing",
  reports: "reports",
  estimates: "quotations",
  whatsappShare: "WhatsApp sharing",
  multiUser: "staff accounts (Users & Access)",
  website: "the public website",
  gallery: "the photo gallery",
  reviews: "customer reviews",
  customDomain: "a custom domain",
  removeBranding: "removing branding",
  booking: "the booking section",
  prioritySupport: "priority support",
};

export async function hasFeature(feature: Feature): Promise<boolean> {
  return planAllows((await getCurrentTenant()).plan, feature);
}

/** Throw (PlanLimitError) if the current plan doesn't include the feature. */
export async function assertFeature(feature: Feature): Promise<void> {
  if (!(await hasFeature(feature))) {
    throw new PlanLimitError(
      `Your plan doesn't include ${FEATURE_LABEL[feature]}. Upgrade to unlock it.`,
    );
  }
}

/**
 * Page guard: redirect to the dashboard (with a `denied` note) when the current
 * plan can't reach a feature. Use at the top of a gated admin page.
 */
export async function gateFeature(feature: Feature, section: string = feature): Promise<void> {
  if (!(await hasFeature(feature))) redirect(`/admin?denied=${section}`);
}

/** Start of the current calendar month (local server time). */
function monthStart(): Date {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

/** Block invoice creation once the plan's monthly cap is reached. */
export async function assertInvoiceQuota(): Promise<void> {
  const { id, plan } = await getCurrentTenant();
  const limit = planLimit(plan, "invoicesPerMonth");
  if (isUnlimited(limit)) return;
  const used = await prisma.invoice.count({
    where: { tenantId: id, createdAt: { gte: monthStart() } },
  });
  if (used >= limit) {
    throw new PlanLimitError(
      `You've reached your plan's limit of ${limit} invoices this month. Upgrade for more.`,
    );
  }
}

/** Block adding a user once the plan's seat cap is reached. */
export async function assertUserQuota(): Promise<void> {
  const { id, plan } = await getCurrentTenant();
  const limit = planLimit(plan, "users");
  if (isUnlimited(limit)) return;
  const used = await prisma.user.count({ where: { tenantId: id } });
  if (used >= limit) {
    throw new PlanLimitError(
      `Your plan allows ${limit} ${limit === 1 ? "user" : "users"}. Upgrade to add more.`,
    );
  }
}

/** Invoice usage for the current month, for showing "12 / 25 used" style hints. */
export async function invoiceUsage(): Promise<{ used: number; limit: number }> {
  const { id, plan } = await getCurrentTenant();
  const limit = planLimit(plan, "invoicesPerMonth");
  const used = await prisma.invoice.count({
    where: { tenantId: id, createdAt: { gte: monthStart() } },
  });
  return { used, limit };
}
