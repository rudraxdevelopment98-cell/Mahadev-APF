"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { nav } from "@/lib/data";
import type { SiteSettings } from "@/lib/settings";

export default function Navbar({ site }: { site: SiteSettings }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <nav
        className={`container-px flex items-center justify-between transition-all duration-500 ${
          scrolled
            ? "glass mx-3 mt-3 rounded-2xl py-3 md:mx-6"
            : "bg-transparent py-5"
        }`}
      >
        <Link href="/" className="flex items-center gap-3" aria-label={site.name}>
          <span className="grid h-9 w-9 place-items-center rounded-lg border border-gold/50 font-heading text-sm font-bold text-gold">
            {site.name.charAt(0) || "M"}
          </span>
          <span className="font-heading text-base font-bold tracking-wide sm:text-lg">
            {site.name}
          </span>
        </Link>

        <ul className="hidden items-center gap-8 lg:flex">
          {nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="group relative text-sm text-muted transition-colors hover:text-paper"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full" />
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/contact"
          className="rounded-full border border-gold/60 px-4 py-2 text-xs text-gold transition-colors hover:bg-gold hover:text-ink sm:text-sm lg:px-5"
        >
          Get Quote
        </Link>
      </nav>
    </motion.header>
  );
}
