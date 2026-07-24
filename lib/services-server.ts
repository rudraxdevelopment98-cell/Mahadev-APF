import "server-only";
import { prisma } from "./db";
import { defaultServices, type ServiceItem } from "./services";

function toPoints(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  return [];
}

/** Active services, ordered. Falls back to defaults if none / DB offline. */
export async function getServices(): Promise<ServiceItem[]> {
  try {
    const rows = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
    if (!rows.length) return defaultServices;
    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      category: r.category,
      blurb: r.blurb,
      points: toPoints(r.points),
    }));
  } catch {
    return defaultServices;
  }
}
