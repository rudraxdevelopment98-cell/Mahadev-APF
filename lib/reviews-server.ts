import "server-only";
import { prisma } from "./db";
import { defaultReviews, type ReviewItem } from "./reviews";

/** Active reviews, ordered. Falls back to defaults if none / DB offline. */
export async function getReviews(): Promise<ReviewItem[]> {
  try {
    const rows = await prisma.review.findMany({
      where: { isActive: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    if (!rows.length) return defaultReviews;
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      location: r.location ?? "",
      quote: r.quote,
      rating: r.rating,
    }));
  } catch {
    return defaultReviews;
  }
}
