"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireSuperAdmin } from "@/lib/superadmin";
import { provisionTenant } from "@/lib/tenant-provision";
import { setImpersonation, clearImpersonation } from "@/lib/impersonation";
import { hashPassword } from "@/lib/auth";
import { normalizeHost } from "@/lib/host";
import { normalizeSlug, slugError } from "@/lib/slug";
import { DEFAULT_TENANT_SLUG } from "@/lib/tenant";

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

export type DetailState = { error?: string; ok?: boolean };

/** Edit a business in depth from its detail page (name, slug, plan, status, domain). */
export async function updateBusinessDetails(
  _prev: DetailState,
  formData: FormData,
): Promise<DetailState> {
  await requireSuperAdmin();
  const tenantId = String(formData.get("tenantId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const plan = String(formData.get("plan") ?? "");
  const status = String(formData.get("status") ?? "");
  const slug = normalizeSlug(String(formData.get("slug") ?? ""));
  const domain = normalizeHost(String(formData.get("domain") ?? "")) || null;

  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
  if (!tenant) return { error: "Business not found." };
  if (!name) return { error: "Name is required." };
  if (!PLANS.has(plan)) return { error: "Unknown plan." };
  if (!STATUSES.has(status)) return { error: "Unknown status." };

  const se = slugError(slug);
  if (se) return { error: se };
  if (slug !== tenant.slug) {
    if (await prisma.tenant.findFirst({ where: { slug, NOT: { id: tenantId } } }))
      return { error: "That address is already taken." };
  }
  if (domain) {
    if (!DOMAIN_RE.test(domain)) return { error: "Enter a valid domain, e.g. acme.com" };
    if (await prisma.tenant.findFirst({ where: { domain, NOT: { id: tenantId } } }))
      return { error: "That domain is already used by another business." };
  }

  await prisma.tenant.update({ where: { id: tenantId }, data: { name, slug, plan, status, domain } });
  revalidatePath(`/rudrone/admin/businesses/${tenantId}`);
  revalidatePath("/rudrone/admin/businesses");
  return { ok: true };
}

/** Permanently delete a business and everything it owns. */
export async function deleteBusiness(formData: FormData) {
  await requireSuperAdmin();
  const tenantId = String(formData.get("tenantId") ?? "");
  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
  if (!tenant) return;
  if (tenant.slug === DEFAULT_TENANT_SLUG || tenant.id === "tenant_mahadev") {
    throw new Error("The primary business can't be deleted.");
  }

  // Remove all of the business's data, then the business itself.
  const where = { tenantId };
  await prisma.invoice.deleteMany({ where }); // cascades items + payments
  await prisma.customer.deleteMany({ where });
  await prisma.material.deleteMany({ where });
  await prisma.service.deleteMany({ where });
  await prisma.galleryItem.deleteMany({ where });
  await prisma.review.deleteMany({ where });
  await prisma.space.deleteMany({ where });
  await prisma.lead.deleteMany({ where });
  await prisma.siteSetting.deleteMany({ where });
  await prisma.user.deleteMany({ where });
  await prisma.tenant.delete({ where: { id: tenantId } });

  revalidatePath("/rudrone/admin/businesses");
  redirect("/rudrone/admin/businesses");
}

/** Quick suspend / reactivate a business. */
export async function setBusinessStatus(formData: FormData) {
  await requireSuperAdmin();
  const tenantId = String(formData.get("tenantId") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!STATUSES.has(status)) return;
  await prisma.tenant.update({ where: { id: tenantId }, data: { status } });
  revalidatePath(`/rudrone/admin/businesses/${tenantId}`);
  revalidatePath("/rudrone/admin/businesses");
}

/** Open a business's own admin (impersonate) from the control room. */
export async function impersonateBusiness(formData: FormData) {
  await requireSuperAdmin();
  const tenantId = String(formData.get("tenantId") ?? "");
  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
  if (!tenant) throw new Error("Business not found.");
  await setImpersonation(tenantId);
  redirect("/admin");
}

/** Stop impersonating and return to the control room. */
export async function stopImpersonating() {
  await clearImpersonation();
  redirect("/rudrone/admin/businesses");
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type UserState = { error?: string; ok?: boolean };

/** Add a user (owner or staff) to a business from the control room. */
export async function addBusinessUser(_prev: UserState, formData: FormData): Promise<UserState> {
  await requireSuperAdmin();
  const tenantId = String(formData.get("tenantId") ?? "");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const name = String(formData.get("name") ?? "").trim();
  const role = String(formData.get("role") ?? "STAFF") === "OWNER" ? "OWNER" : "STAFF";
  const password = String(formData.get("password") ?? "");

  if (!(await prisma.tenant.findUnique({ where: { id: tenantId } }))) return { error: "Business not found." };
  if (!name) return { error: "Name is required." };
  if (!EMAIL_RE.test(email)) return { error: "Enter a valid email." };
  if (password && password.length < 8) return { error: "Password must be at least 8 characters." };
  if (await prisma.user.findUnique({ where: { email } })) return { error: "That email is already in use." };

  await prisma.user.create({
    data: {
      tenantId,
      email,
      name,
      role,
      isActive: true,
      passwordHash: password ? await hashPassword(password) : "",
    },
  });
  revalidatePath(`/rudrone/admin/businesses/${tenantId}`);
  return { ok: true };
}

/** Reset a user's password (e.g. an owner who's locked out). */
export async function resetBusinessUserPassword(_prev: UserState, formData: FormData): Promise<UserState> {
  await requireSuperAdmin();
  const userId = String(formData.get("userId") ?? "");
  const password = String(formData.get("password") ?? "");
  if (password.length < 8) return { error: "Password must be at least 8 characters." };
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { error: "User not found." };
  await prisma.user.update({ where: { id: userId }, data: { passwordHash: await hashPassword(password) } });
  revalidatePath(`/rudrone/admin/businesses/${user.tenantId}`);
  return { ok: true };
}

/** Enable / disable a user's access. */
export async function toggleBusinessUser(formData: FormData) {
  await requireSuperAdmin();
  const userId = String(formData.get("userId") ?? "");
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return;
  // Don't disable the last active owner of a business.
  if (user.isActive && user.role === "OWNER") {
    const owners = await prisma.user.count({ where: { tenantId: user.tenantId, role: "OWNER", isActive: true } });
    if (owners <= 1) throw new Error("A business must keep at least one active owner.");
  }
  await prisma.user.update({ where: { id: userId }, data: { isActive: !user.isActive } });
  revalidatePath(`/rudrone/admin/businesses/${user.tenantId}`);
}

/** Remove a user from a business. */
export async function removeBusinessUser(formData: FormData) {
  await requireSuperAdmin();
  const userId = String(formData.get("userId") ?? "");
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return;
  if (user.role === "OWNER") {
    const owners = await prisma.user.count({ where: { tenantId: user.tenantId, role: "OWNER" } });
    if (owners <= 1) throw new Error("A business must keep at least one owner.");
  }
  await prisma.user.delete({ where: { id: userId } });
  revalidatePath(`/rudrone/admin/businesses/${user.tenantId}`);
}
