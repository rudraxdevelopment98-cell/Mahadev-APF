"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";

async function requireAuth() {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
}

function parse(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    category: String(formData.get("category") ?? "OTHER"),
    kind: String(formData.get("kind") ?? "MATERIAL"),
    unit: String(formData.get("unit") ?? "nos"),
    hsn: String(formData.get("hsn") ?? "").trim() || null,
    rate: Number(formData.get("rate")) || 0,
    taxRate: Number(formData.get("taxRate")) || 0,
  };
}

export async function createMaterial(formData: FormData) {
  await requireAuth();
  const data = parse(formData);
  if (!data.name) return;
  await prisma.material.create({ data });
  revalidatePath("/admin/materials");
}

export async function updateMaterial(id: string, formData: FormData) {
  await requireAuth();
  const data = parse(formData);
  if (!data.name) return;
  await prisma.material.update({ where: { id }, data });
  revalidatePath("/admin/materials");
}

export async function deleteMaterial(id: string) {
  await requireAuth();
  await prisma.material.delete({ where: { id } });
  revalidatePath("/admin/materials");
}
