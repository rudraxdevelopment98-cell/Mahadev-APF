import "server-only";
import { prisma } from "./db";
import { defaultSettings, mergeSettings, type SiteSettings } from "./settings";

/**
 * Load the editable site settings from the database, falling back to the
 * built-in defaults if nothing has been saved yet or the database is
 * unavailable (so the public site always renders).
 */
export async function getSettings(): Promise<SiteSettings> {
  try {
    const row = await prisma.siteSetting.findUnique({ where: { id: 1 } });
    return mergeSettings(row?.data as Partial<SiteSettings> | undefined);
  } catch {
    return defaultSettings;
  }
}
