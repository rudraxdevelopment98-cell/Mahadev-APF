import "server-only";
import { prisma } from "./db";
import { hashPassword } from "./auth";
import { normalizeSlug, slugError } from "./slug";

export type ProvisionInput = {
  businessName: string;
  slug: string;
  ownerName: string;
  ownerEmail: string;
  password: string;
};

export type ProvisionResult =
  | { ok: true; tenantId: string; slug: string }
  | { ok: false; error: string; field?: keyof ProvisionInput };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Create a new business (tenant) plus its first OWNER user. Validates input
 * and enforces slug/email uniqueness. Safe to call from a server action; the
 * pure validation lives in lib/slug so it can be reused on the client.
 */
export async function provisionTenant(input: ProvisionInput): Promise<ProvisionResult> {
  const businessName = input.businessName.trim();
  const ownerName = input.ownerName.trim();
  const ownerEmail = input.ownerEmail.toLowerCase().trim();
  const slug = normalizeSlug(input.slug || businessName);

  if (!businessName) return { ok: false, error: "Business name is required.", field: "businessName" };
  const se = slugError(slug);
  if (se) return { ok: false, error: se, field: "slug" };
  if (!ownerName) return { ok: false, error: "Your name is required.", field: "ownerName" };
  if (!EMAIL_RE.test(ownerEmail)) return { ok: false, error: "Enter a valid email.", field: "ownerEmail" };
  if (input.password.length < 8) return { ok: false, error: "Password must be at least 8 characters.", field: "password" };

  if (await prisma.tenant.findUnique({ where: { slug } })) {
    return { ok: false, error: "That address is already taken.", field: "slug" };
  }
  if (await prisma.user.findUnique({ where: { email: ownerEmail } })) {
    return { ok: false, error: "That email is already registered.", field: "ownerEmail" };
  }

  const tenant = await prisma.tenant.create({
    data: { slug, name: businessName, plan: "free", status: "active" },
  });
  await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: ownerEmail,
      name: ownerName,
      role: "OWNER",
      passwordHash: await hashPassword(input.password),
    },
  });

  return { ok: true, tenantId: tenant.id, slug };
}
