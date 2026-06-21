import "server-only";
import { prisma } from "./db";

export type GalleryImage = {
  id: string;
  imageUrl: string;
  caption: string | null;
  category: string | null;
};

/** Active gallery photos, ordered. Empty array if none / DB offline. */
export async function getGallery(): Promise<GalleryImage[]> {
  try {
    const rows = await prisma.galleryItem.findMany({
      where: { isActive: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    return rows.map((r) => ({
      id: r.id,
      imageUrl: r.imageUrl,
      caption: r.caption,
      category: r.category,
    }));
  } catch {
    return [];
  }
}
