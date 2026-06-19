"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { company, nav } from "@/lib/data";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

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
        <Link href="/" className="flex items-center gap-3" aria-label={company.name}>
          <span className="grid h-9 w-9 place-items-center rounded-lg border border-gold/50 font-heading text-sm font-bold text-gold">
            M
          </span>
          <span className="font-heading text-lg font-bold tracking-wide">
            {company.name}
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
          className="hidden rounded-full border border-gold/60 px-5 py-2 text-sm text-gold transition-colors hover:bg-gold hover:text-ink lg:inline-block"
        >
          Request Quote
        </Link>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
        >
          <span
            className={`h-px w-6 bg-paper transition-all ${open ? "translate-y-[7px] rotate-45" : ""}`}
          />
          <span className={`h-px w-6 bg-paper transition-all ${open ? "opacity-0" : ""}`} />
          <span
            className={`h-px w-6 bg-paper transition-all ${open ? "-translate-y-[7px] -rotate-45" : ""}`}
          />
        </button>
      </nav>

      {/* Mobile drawer */}
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        className="glass mx-3 overflow-hidden rounded-2xl lg:hidden"
      >
        <ul className="flex flex-col gap-1 p-4">
          {nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-4 py-3 text-muted transition-colors hover:bg-white/5 hover:text-paper"
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-2 block rounded-lg bg-gold px-4 py-3 text-center font-medium text-ink"
            >
              Request Quote
            </Link>
          </li>
        </ul>
      </motion.div>
    </motion.header>
  );
}
