"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = { href: string; label: string; icon: React.ReactNode };

const I = {
  home: (
    <path d="M3 10.5 12 3l9 7.5M5 9.5V21h5v-6h4v6h5V9.5" />
  ),
  work: <path d="M4 7h16v13H4zM9 7V4h6v3M4 12h16" />,
  spaces: <path d="M3 21h18M6 21V7l6-4 6 4v14M10 11h4M10 15h4" />,
  about: <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 8h.01M11 12h1v4h1" />,
  contact: (
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
  ),
};

const items: Item[] = [
  { href: "/", label: "Home", icon: I.home },
  { href: "/products", label: "Work", icon: I.work },
  { href: "/industries", label: "Spaces", icon: I.spaces },
  { href: "/about", label: "About", icon: I.about },
  { href: "/contact", label: "Contact", icon: I.contact },
];

export default function MobileNav() {
  const pathname = usePathname() || "/";
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-[55] flex justify-center pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
      <div className="relative flex items-center gap-1 rounded-[26px] border border-white/15 bg-white/[0.07] px-2 py-2 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.7)] backdrop-blur-2xl">
        {/* liquid-glass top highlight */}
        <span className="pointer-events-none absolute inset-x-4 top-px h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        {items.map((it) => {
          const active = isActive(it.href);
          return (
            <Link
              key={it.href}
              href={it.href}
              aria-label={it.label}
              className={`relative flex w-[60px] flex-col items-center gap-1 rounded-2xl px-1 py-1.5 transition-colors ${
                active ? "text-ink" : "text-white/70"
              }`}
            >
              {active && (
                <span className="absolute inset-0 -z-10 rounded-2xl bg-gold shadow-[0_4px_16px_-2px_rgba(212,175,55,0.6)]" />
              )}
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {it.icon}
              </svg>
              <span className="text-[10px] font-medium leading-none">{it.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
