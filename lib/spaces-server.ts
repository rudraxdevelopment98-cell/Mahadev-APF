import "server-only";
import { prisma } from "./db";
import { defaultSpaces, type SpaceItem } from "./spaces";

/** Active spaces, ordered. Falls back to defaults if none / DB offline. */
export async function getSpaces(): Promise<SpaceItem[]> {
  try {
    const rows = await prisma.space.findMany({
      where: { isActive: true },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
    if (!rows.length) return defaultSpaces;
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      body: r.body,
      imageUrl: r.imageUrl,
    }));
  } catch {
    return defaultSpaces;
  }
}
