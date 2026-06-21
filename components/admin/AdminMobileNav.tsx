"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/invoices", label: "Invoices" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/materials", label: "Rate List" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminMobileNav() {
  const pathname = usePathname() || "";
  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <nav className="no-print flex gap-2 overflow-x-auto border-b border-white/10 px-4 py-2 lg:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm transition-colors ${
            isActive(l.href, l.exact)
              ? "bg-gold text-ink"
              : "border border-white/10 text-muted"
          }`}
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
