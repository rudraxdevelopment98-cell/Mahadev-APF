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

function refresh() {
  revalidatePath("/", "layout");
  revalidatePath("/admin/gallery");
}

export type GalleryFormState = { ok?: boolean; error?: string };

/** Add a photo — either an uploaded file (Vercel Blob) or a pasted image URL. */
export async function createGalleryItem(
  _prev: GalleryFormState,
  formData: FormData,
): Promise<GalleryFormState> {
  await requireAuth();

  let imageUrl = String(formData.get("imageUrl") ?? "").trim();
  const file = formData.get("image");

  if (file instanceof File && file.size > 0) {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return {
        error:
          "Photo upload isn't switched on yet. Either enable Blob storage in Vercel, or paste an image link instead.",
      };
    }
    try {
      const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const blob = await put(`gallery/${Date.now()}-${safe}`, file, {
        access: "public",
      });
      imageUrl = blob.url;
    } catch {
      return { error: "Upload failed. Please try again, or paste an image link." };
    }
  }

  if (!imageUrl) return { error: "Choose a photo to upload or paste an image link." };

  await prisma.galleryItem.create({
    data: {
      imageUrl,
      caption: String(formData.get("caption") ?? "").trim() || null,
      category: String(formData.get("category") ?? "").trim() || null,
      order: Number(formData.get("order")) || 0,
    },
  });
  refresh();
  return { ok: true };
}

export async function deleteGalleryItem(id: string) {
  await requireAuth();
  await prisma.galleryItem.delete({ where: { id } });
  refresh();
}
