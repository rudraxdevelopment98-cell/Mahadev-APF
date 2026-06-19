"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type Crumb = { label: string; href?: string };

export default function PageHeader({
  eyebrow,
  title,
  description,
  crumbs = [],
}: {
  eyebrow: string;
  title: string;
  description?: string;
  crumbs?: Crumb[];
}) {
  return (
    <header className="relative overflow-hidden pt-36 pb-16 md:pt-44 md:pb-20">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 grid-lines opacity-50" />
        <div className="gold-streak" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink-soft/40 to-ink" />
      </div>

      <div className="container-px">
        <nav className="flex items-center gap-2 text-xs text-muted">
          <Link href="/" className="hover:text-gold">
            Home
          </Link>
          {crumbs.map((c) => (
            <span key={c.label} className="flex items-center gap-2">
              <span className="text-white/20">/</span>
              {c.href ? (
                <Link href={c.href} className="hover:text-gold">
                  {c.label}
                </Link>
              ) : (
                <span className="text-paper">{c.label}</span>
              )}
            </span>
          ))}
        </nav>

        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8 block text-xs uppercase tracking-[0.3em] text-gold"
        >
          {eyebrow}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mt-4 max-w-4xl font-heading text-4xl font-black leading-[1.02] tracking-tight text-balance md:text-6xl"
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-6 max-w-2xl text-muted leading-relaxed md:text-lg"
          >
            {description}
          </motion.p>
        )}
      </div>
    </header>
  );
}
