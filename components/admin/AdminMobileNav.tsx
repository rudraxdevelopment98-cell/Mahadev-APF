"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SECTIONS, userCan, planHasSection } from "@/lib/permissions";

export default function AdminMobileNav({
  role,
  perms,
  planFeatures = [],
}: {
  role: string;
  perms: string[];
  planFeatures?: string[];
}) {
  const pathname = usePathname() || "";

  const links = [
    { href: "/admin", label: "Dashboard", exact: true },
    ...SECTIONS.filter(
      (s) => userCan(role, perms, s.key) && planHasSection(s.key, planFeatures),
    ).map((s) => ({
      href: s.href,
      label: s.label,
      exact: false,
    })),
  ];

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
