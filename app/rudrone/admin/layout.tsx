import Link from "next/link";
import { requireSuperAdmin } from "@/lib/superadmin";
import { logoutAction } from "@/lib/actions/auth-actions";
import { PLATFORM } from "@/lib/platform";
import RudrAdminNav from "@/components/rudrone/RudrAdminNav";

export const dynamic = "force-dynamic";

export default async function RudrAdminLayout({ children }: { children: React.ReactNode }) {
  const me = await requireSuperAdmin();

  return (
    <div className="min-h-screen bg-ink text-paper">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-ink/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-5 py-3">
          <Link href="/rudrone/admin" className="flex items-center gap-2.5">
            <span
              className="grid h-8 w-8 place-items-center rounded-lg text-sm font-bold text-ink"
              style={{ background: "linear-gradient(150deg,#e7b34d,#e4622d)" }}
            >
              ◈
            </span>
            <span className="font-heading text-lg font-bold">
              Rudr<span className="text-gold">One</span>
              <span className="ml-2 text-xs font-medium uppercase tracking-[0.15em] text-muted">
                Control Room
              </span>
            </span>
          </Link>

          <div className="order-3 w-full lg:order-2 lg:w-auto lg:flex-1">
            <RudrAdminNav />
          </div>

          <div className="order-2 ml-auto flex items-center gap-3 lg:order-3">
            <span className="hidden text-xs text-muted sm:inline">{me.email}</span>
            <Link href="/rudrone" className="text-xs text-muted hover:text-gold">
              Portal ↗
            </Link>
            <form action={logoutAction}>
              <button className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-muted transition-colors hover:border-red-400/40 hover:text-red-300">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>

      <footer className="mx-auto max-w-6xl px-5 pb-10 pt-4 text-center text-xs text-muted">
        {PLATFORM.name} control room · platform admins only
      </footer>
    </div>
  );
}
