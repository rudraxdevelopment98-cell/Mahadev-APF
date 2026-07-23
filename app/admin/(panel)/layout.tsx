import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { getCurrentTenant } from "@/lib/tenant";
import { getImpersonatedTenantId } from "@/lib/impersonation";
import { stopImpersonating } from "@/lib/actions/superadmin-actions";
import Sidebar from "@/components/admin/Sidebar";
import AdminMobileNav from "@/components/admin/AdminMobileNav";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
  const tenant = await getCurrentTenant();
  const planFeatures = tenant.planDetails.features;
  const impersonating = !!(await getImpersonatedTenantId());

  return (
    <div className={`flex min-h-screen bg-ink text-paper ${impersonating ? "pt-10" : ""}`}>
      {impersonating && (
        <form
          action={stopImpersonating}
          className="no-print fixed inset-x-0 top-0 z-50 flex items-center justify-center gap-3 bg-gold px-4 py-2 text-center text-sm font-medium text-ink"
        >
          <span>
            Viewing <b>{tenant.name}</b> as a RudrOne admin
          </span>
          <button className="rounded-full bg-ink/15 px-3 py-1 text-xs font-semibold hover:bg-ink/25">
            Exit ✕
          </button>
        </form>
      )}
      <Sidebar userName={user.name} role={user.role} perms={user.perms} planFeatures={planFeatures} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="no-print flex items-center justify-between border-b border-white/10 px-5 py-3 lg:hidden">
          <Link href="/admin" className="font-heading font-bold">
            Admin
          </Link>
          <Link href="/admin/invoices/new" className="text-sm text-gold">
            + Invoice
          </Link>
        </header>
        <AdminMobileNav role={user.role} perms={user.perms} planFeatures={planFeatures} />
        <main className="min-w-0 flex-1 p-5 pb-24 md:p-8 lg:pb-8">{children}</main>
      </div>
    </div>
  );
}
