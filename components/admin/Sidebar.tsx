"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/lib/actions/auth-actions";
import { shop } from "@/lib/shop";

const links = [
  { href: "/admin", label: "Dashboard", icon: "▤", exact: true },
  { href: "/admin/invoices", label: "Invoices", icon: "🧾" },
  { href: "/admin/customers", label: "Customers", icon: "👥" },
  { href: "/admin/materials", label: "Rate List", icon: "📦" },
  { href: "/admin/services", label: "Services", icon: "🛠️" },
  { href: "/admin/gallery", label: "Gallery", icon: "🖼️" },
  { href: "/admin/reviews", label: "Reviews", icon: "⭐" },
  { href: "/admin/leads", label: "Enquiries", icon: "📩" },
  { href: "/admin/settings", label: "Settings", icon: "⚙️" },
];

export default function Sidebar({ userName }: { userName: string }) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="no-print flex w-64 shrink-0 flex-col border-r border-white/10 bg-ink-soft/60 p-4 max-lg:hidden">
      <Link href="/admin" className="mb-8 flex items-center gap-3 px-2 pt-2">
        <span className="grid h-9 w-9 place-items-center rounded-lg border border-gold/50 font-heading text-sm font-bold text-gold">
          M
        </span>
        <div className="leading-tight">
          <p className="font-heading text-sm font-bold">{shop.name}</p>
          <p className="text-[10px] uppercase tracking-[0.15em] text-muted">
            Billing Admin
          </p>
        </div>
      </Link>

      <nav className="flex-1 space-y-1">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
              isActive(l.href, l.exact)
                ? "bg-gold/15 text-gold"
                : "text-muted hover:bg-white/5 hover:text-paper"
            }`}
          >
            <span className="w-5 text-center">{l.icon}</span>
            {l.label}
          </Link>
        ))}
      </nav>

      <div className="mt-4 border-t border-white/10 pt-4">
        <p className="px-3 text-xs text-muted">Signed in as</p>
        <p className="px-3 text-sm font-medium">{userName}</p>
        <form action={logoutAction} className="mt-3">
          <button className="w-full rounded-lg border border-white/10 px-3 py-2 text-left text-sm text-muted transition-colors hover:border-red-400/40 hover:text-red-300">
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
