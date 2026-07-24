"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

async function requireAuth() {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
}

async function fields(formData: FormData, currentImage = "") {
  let imageUrl = String(formData.get("imageUrl") ?? "").trim() || currentImage || null;
  const file = formData.get("image");
  if (file instanceof File && file.size > 0) {
    try {
      const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const blob = await put(`spaces/${Date.now()}-${safe}`, file, { access: "public" });
      imageUrl = blob.url;
    } catch {
      // keep current
    }
  }
  return {
    name: String(formData.get("name") ?? "").trim(),
    body: String(formData.get("body") ?? "").trim(),
    order: Number(formData.get("order")) || 0,
    isActive:
      formData.get("hasActive") != null
        ? formData.get("isActive") === "on"
        : true,
    imageUrl,
  };
}

function refresh() {
  revalidatePath("/", "layout");
  revalidatePath("/admin/spaces");
}

export async function createSpace(formData: FormData) {
  await requireAuth();
  const data = await fields(formData);
  if (!data.name || !data.body) return;
  await prisma.space.create({ data });
  refresh();
}

export async function updateSpace(id: string, formData: FormData) {
  await requireAuth();
  const existing = await prisma.space.findUnique({ where: { id } });
  const data = await fields(formData, existing?.imageUrl ?? "");
  if (!data.name || !data.body) return;
  await prisma.space.update({ where: { id }, data });
  refresh();
  redirect("/admin/spaces");
}

export async function deleteSpace(id: string) {
  await requireAuth();
  await prisma.space.delete({ where: { id } });
  refresh();
}
