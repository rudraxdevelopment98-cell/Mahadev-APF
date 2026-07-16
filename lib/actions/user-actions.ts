"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
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
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const name = String(formData.get("name") ?? "").trim();
  const role = String(formData.get("role") ?? "STAFF") === "OWNER" ? "OWNER" : "STAFF";
  if (!email || !name) throw new Error("Name and email are required.");

  await prisma.user.upsert({
    where: { email },
    create: {
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
  const name = String(formData.get("name") ?? "").trim();
  const role = String(formData.get("role") ?? "STAFF") === "OWNER" ? "OWNER" : "STAFF";
  const isActive = formData.get("isActive") != null;

  await prisma.user.update({
    where: { id },
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

  const target = await prisma.user.findUnique({ where: { id } });
  if (target && isOwner(target.role)) {
    const owners = await prisma.user.count({
      where: { role: { in: ["OWNER", "ADMIN"] }, isActive: true },
    });
    if (owners <= 1) throw new Error("At least one owner must remain.");
  }

  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/users");
}
