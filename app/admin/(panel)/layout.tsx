import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import Sidebar from "@/components/admin/Sidebar";
import AdminMobileNav from "@/components/admin/AdminMobileNav";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-ink text-paper">
      <Sidebar userName={user.name} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="no-print flex items-center justify-between border-b border-white/10 px-5 py-3 lg:hidden">
          <Link href="/admin" className="font-heading font-bold">
            Admin
          </Link>
          <Link href="/admin/invoices/new" className="text-sm text-gold">
            + Invoice
          </Link>
        </header>
        <AdminMobileNav />
        <main className="min-w-0 flex-1 p-5 pb-24 md:p-8 lg:pb-8">{children}</main>
      </div>
    </div>
  );
}
