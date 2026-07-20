"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { getTenantId } from "@/lib/tenant";
import { assertFeature, assertUserQuota } from "@/lib/entitlements";
import { GRANTABLE_SECTIONS, isOwner } from "@/lib/permissions";

async function requireOwner() {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
  if (!isOwner(user.role)) redirect("/admin");
  return user;
}

const VALID = new Set(GRANTABLE_SECTIONS.map((s) => s.key as string));

function readPerms(formData: FormData): string {
  return formData
    .getAll("perms")
    .map((p) => String(p))
    .filter((p) => VALID.has(p))
    .join(",");
}

export async function createUser(formData: FormData) {
  await requireOwner();
  await assertFeature("multiUser");
  const tenantId = await getTenantId();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const name = String(formData.get("name") ?? "").trim();
  const role = String(formData.get("role") ?? "STAFF") === "OWNER" ? "OWNER" : "STAFF";
  if (!email || !name) throw new Error("Name and email are required.");

  // Emails are unique platform-wide; never let an upsert reach into another
  // business's account.
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing && existing.tenantId !== tenantId) {
    throw new Error("That email is already in use.");
  }
  if (!existing) await assertUserQuota(); // only new seats count against the plan

  await prisma.user.upsert({
    where: { email },
    create: {
      tenantId,
      email,
      name,
      role,
      permissions: role === "OWNER" ? "" : readPerms(formData),
      isActive: true,
      passwordHash: "",
    },
    update: {
      name,
      role,
      permissions: role === "OWNER" ? "" : readPerms(formData),
      isActive: true,
    },
  });

  revalidatePath("/admin/users");
}

export async function updateUser(id: string, formData: FormData) {
  await requireOwner();
  const tenantId = await getTenantId();
  const target = await prisma.user.findFirst({ where: { id, tenantId } });
  if (!target) throw new Error("User not found.");

  const name = String(formData.get("name") ?? "").trim();
  const role = String(formData.get("role") ?? "STAFF") === "OWNER" ? "OWNER" : "STAFF";
  const isActive = formData.get("isActive") != null;

  await prisma.user.update({
    where: { id: target.id },
    data: {
      name: name || undefined,
      role,
      permissions: role === "OWNER" ? "" : readPerms(formData),
      isActive,
    },
  });

  revalidatePath("/admin/users");
}

export async function deleteUser(id: string) {
  const me = await requireOwner();
  if (me.id === id) throw new Error("You can't remove your own access.");
  const tenantId = await getTenantId();

  const target = await prisma.user.findFirst({ where: { id, tenantId } });
  if (!target) throw new Error("User not found.");
  if (isOwner(target.role)) {
    const owners = await prisma.user.count({
      where: { tenantId, role: { in: ["OWNER", "ADMIN"] }, isActive: true },
    });
    if (owners <= 1) throw new Error("At least one owner must remain.");
  }

  await prisma.user.delete({ where: { id: target.id } });
  revalidatePath("/admin/users");
}
