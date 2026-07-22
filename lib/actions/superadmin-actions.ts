"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireSuperAdmin } from "@/lib/superadmin";
import { provisionTenant } from "@/lib/tenant-provision";
import { normalizeHost } from "@/lib/host";

const PLANS = new Set(["free", "plus", "pro", "max", "custom"]);
const STATUSES = new Set(["active", "trial", "suspended"]);
const DOMAIN_RE = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/;

/** Update a business's plan, status and custom domain from the control room. */
export async function updateTenant(formData: FormData) {
  await requireSuperAdmin();
  const tenantId = String(formData.get("tenantId") ?? "");
  const plan = String(formData.get("plan") ?? "");
  const status = String(formData.get("status") ?? "");
  const domain = normalizeHost(String(formData.get("domain") ?? "")) || null;

  if (!tenantId) throw new Error("Missing business.");
  if (!PLANS.has(plan)) throw new Error("Unknown plan.");
  if (!STATUSES.has(status)) throw new Error("Unknown status.");
  if (domain) {
    if (!DOMAIN_RE.test(domain)) throw new Error("Enter a valid domain, e.g. acme.com");
    const clash = await prisma.tenant.findFirst({ where: { domain, NOT: { id: tenantId } } });
    if (clash) throw new Error(`That domain is already used by "${clash.name}".`);
  }

  await prisma.tenant.update({ where: { id: tenantId }, data: { plan, status, domain } });
  revalidatePath("/rudrone/admin");
}

export type CreateBusinessState = { error?: string; ok?: boolean; slug?: string };

/** Create a business (Tenant + OWNER) from the control room. */
export async function createBusiness(
  _prev: CreateBusinessState,
  formData: FormData,
): Promise<CreateBusinessState> {
  await requireSuperAdmin();
  const result = await provisionTenant({
    businessName: String(formData.get("businessName") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    ownerName: String(formData.get("ownerName") ?? ""),
    ownerEmail: String(formData.get("ownerEmail") ?? ""),
    password: String(formData.get("password") ?? ""),
  });
  if (!result.ok) return { error: result.error };
  revalidatePath("/rudrone/admin");
  return { ok: true, slug: result.slug };
}
