import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { getTenantId } from "@/lib/tenant";
import { hasFeature } from "@/lib/entitlements";
import { isOwner } from "@/lib/permissions";
import UsersManager from "@/components/admin/UsersManager";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const me = await getSessionUser();
  if (!me) redirect("/admin/login");
  if (!isOwner(me.role)) redirect("/admin");
  // Users & Access is a plan feature (Plus and up).
  if (!(await hasFeature("multiUser"))) redirect("/admin?denied=users");

  let users: Awaited<ReturnType<typeof prisma.user.findMany>> = [];
  try {
    users = await prisma.user.findMany({
      where: { tenantId: await getTenantId() },
      orderBy: { createdAt: "asc" },
    });
  } catch {
    users = [];
  }

  return (
    <div>
      <h1 className="mb-1 font-heading text-3xl font-bold">Users &amp; Access</h1>
      <p className="mb-6 text-sm text-muted">
        Control who can sign in to this admin panel and which sections they can
        use. Only owners can manage users.
      </p>

      <UsersManager
        meId={me.id}
        users={users.map((u) => ({
          id: u.id,
          email: u.email,
          name: u.name,
          role: u.role,
          permissions: u.permissions,
          isActive: u.isActive,
        }))}
      />
    </div>
  );
}
