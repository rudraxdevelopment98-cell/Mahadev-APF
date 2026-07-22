import "server-only";
import { redirect, notFound } from "next/navigation";
import { getSessionUser, type SessionUser } from "./auth";

/**
 * RudrOne platform admins ("super-admins") — the people who run RudrOne
 * itself, distinct from a business's own OWNER. Identified by email allowlist
 * so it stays independent of any single tenant. Override with the
 * RUDRONE_SUPERADMINS env var (comma-separated emails).
 */
const DEFAULT_SUPERADMINS = [
  "atuljotaniya151@gmail.com",
  "rudraxdevelopment98@gmail.com",
  "kuldeepjotaniya83@gmail.com",
];

function allowlist(): string[] {
  const raw = process.env.RUDRONE_SUPERADMINS;
  const list = raw ? raw.split(",") : DEFAULT_SUPERADMINS;
  return list.map((s) => s.trim().toLowerCase()).filter(Boolean);
}

export function isSuperAdminEmail(email: string | null | undefined): boolean {
  return !!email && allowlist().includes(email.toLowerCase());
}

/** Gate a super-admin page/action. Sends signed-out users to login; hides the
 *  area (404) from signed-in users who aren't platform admins. */
export async function requireSuperAdmin(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login?next=/rudrone/admin");
  if (!isSuperAdminEmail(user.email)) notFound();
  return user;
}
