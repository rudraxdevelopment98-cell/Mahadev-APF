"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

async function requireAuth() {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
}

function refresh() {
  revalidatePath("/", "layout");
  revalidatePath("/admin/gallery");
}

export async function createGalleryItem(formData: FormData) {
  await requireAuth();
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  if (!imageUrl) return;
  await prisma.galleryItem.create({
    data: {
      imageUrl,
      caption: String(formData.get("caption") ?? "").trim() || null,
      category: String(formData.get("category") ?? "").trim() || null,
      order: Number(formData.get("order")) || 0,
    },
  });
  refresh();
}

export async function deleteGalleryItem(id: string) {
  await requireAuth();
  await prisma.galleryItem.delete({ where: { id } });
  refresh();
}
