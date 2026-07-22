import "server-only";
import { prisma } from "./db";
import { getTenantId } from "./tenant";
import { defaultSettings, mergeSettings, type SiteSettings } from "./settings";

/**
 * Load the current business's editable site settings, falling back to the
 * built-in defaults if that business hasn't saved any yet or the database is
 * unavailable (so the public site always renders). Each business has its own
 * row, keyed by tenant.
 */
export async function getSettings(): Promise<SiteSettings> {
  try {
    const tenantId = await getTenantId();
    const row = await prisma.siteSetting.findUnique({ where: { tenantId } });
    return mergeSettings(row?.data as Partial<SiteSettings> | undefined);
  } catch {
    return defaultSettings;
  }
}
