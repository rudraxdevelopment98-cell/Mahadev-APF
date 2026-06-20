"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { company } from "@/lib/data";
import MagneticButton from "./MagneticButton";

/**
 * Cinematic hero.
 * Drop a real drone clip at /public/hero.mp4 and it plays automatically;
 * otherwise an animated grid + gold-streak fallback keeps the premium feel.
 */
export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-screen items-center overflow-hidden"
    >
      {/* Background layer */}
      <motion.div style={{ scale }} className="absolute inset-0 -z-10">
        <video
          className="h-full w-full object-cover opacity-40"
          autoPlay
          muted
          loop
          playsInline
          poster=""
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        {/* Fallback cinematic background (visible when no video) */}
        <div className="absolute inset-0 grid-lines" />
        <div className="gold-streak" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/70 to-ink" />
        {/* Sweeping gold light streak */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-gold/10 to-transparent [animation:streak_7s_ease-in-out_infinite]" />
      </motion.div>

      <motion.div
        style={{ y, opacity }}
        className="container-px relative z-10 w-full pt-28"
      >
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.1, duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-gold"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          Aluminium · uPVC · Furniture · Glass
        </motion.span>

        <h1 className="mt-6 max-w-4xl font-heading text-5xl font-black leading-[0.98] tracking-tight text-balance sm:text-6xl md:text-7xl lg:text-8xl">
          <RevealLine delay={2.2}>Furniture, Windows</RevealLine>
          <RevealLine delay={2.35}>
            <span className="text-gold-gradient">&amp; Glass Works</span>
          </RevealLine>
          <RevealLine delay={2.5}>built to fit.</RevealLine>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.7, duration: 0.6 }}
          className="mt-7 max-w-xl text-base leading-relaxed text-muted md:text-lg"
        >
          {company.intro}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.85, duration: 0.6 }}
          className="mt-9 flex flex-wrap items-center gap-4"
        >
          <MagneticButton href="#products" variant="solid">
            Explore Products
          </MagneticButton>
          <MagneticButton href="#contact" variant="outline">
            Request a Quote
          </MagneticButton>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.1 }}
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-muted md:flex"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <span className="flex h-9 w-5 justify-center rounded-full border border-white/20 p-1">
          <motion.span
            className="h-1.5 w-1 rounded-full bg-gold"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          />
        </span>
      </motion.a>
    </section>
  );
}

function RevealLine({
  children,
  delay,
}: {
  children: React.ReactNode;
  delay: number;
}) {
  return (
    <span className="block overflow-hidden">
      <motion.span
        className="block"
        initial={{ y: "110%" }}
        animate={{ y: "0%" }}
        transition={{ delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
}
