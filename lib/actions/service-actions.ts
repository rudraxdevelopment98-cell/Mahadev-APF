"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

async function requireAuth() {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
}

function parse(formData: FormData) {
  const points = String(formData.get("points") ?? "")
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);
  return {
    title: String(formData.get("title") ?? "").trim(),
    category: String(formData.get("category") ?? "").trim() || "Other",
    blurb: String(formData.get("blurb") ?? "").trim(),
    order: Number(formData.get("order")) || 0,
    // On the create form there's no checkbox (default visible); on the edit
    // form the hidden "hasActive" marker tells us to read the checkbox.
    isActive: formData.get("hasActive") != null
      ? formData.get("isActive") === "on"
      : true,
    points: points as unknown as Prisma.InputJsonValue,
  };
}

function refresh() {
  revalidatePath("/", "layout");
  revalidatePath("/admin/services");
}

export async function createService(formData: FormData) {
  await requireAuth();
  const data = parse(formData);
  if (!data.title || !data.blurb) return;
  await prisma.service.create({ data });
  refresh();
}

export async function updateService(id: string, formData: FormData) {
  await requireAuth();
  const data = parse(formData);
  if (!data.title || !data.blurb) return;
  await prisma.service.update({ where: { id }, data });
  refresh();
  redirect("/admin/services");
}

export async function deleteService(id: string) {
  await requireAuth();
  await prisma.service.delete({ where: { id } });
  refresh();
}
