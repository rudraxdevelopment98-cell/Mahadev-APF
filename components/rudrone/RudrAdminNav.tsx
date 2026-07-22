"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/rudrone/admin", label: "Dashboard", exact: true },
  { href: "/rudrone/admin/businesses", label: "Businesses", exact: false },
  { href: "/rudrone/admin/plans", label: "Plans", exact: false },
];

export default function RudrAdminNav() {
  const path = usePathname() || "";
  const isActive = (href: string, exact: boolean) =>
    exact ? path === href : path.startsWith(href);

  return (
    <nav className="flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            isActive(l.href, l.exact)
              ? "bg-gold text-ink"
              : "text-muted hover:bg-white/5 hover:text-paper"
          }`}
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
