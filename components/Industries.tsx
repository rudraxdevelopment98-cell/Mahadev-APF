"use client";

import { motion } from "framer-motion";
import { industries } from "@/lib/data";
import Reveal from "./Reveal";

export default function Industries() {
  return (
    <section id="industries" className="relative overflow-hidden py-28 md:py-36">
      {/* Animated background layer */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 grid-lines opacity-50" />
        <div className="gold-streak" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink-soft/60 to-ink" />
      </div>

      <div className="container-px">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <span className="text-xs uppercase tracking-[0.3em] text-gold">
              Industries We Serve
            </span>
          </Reveal>
          <Reveal index={1}>
            <h2 className="mt-4 font-heading text-4xl font-bold leading-tight text-balance md:text-5xl">
              Trusted across the world&rsquo;s most critical sectors
            </h2>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 md:grid-cols-4">
          {industries.map((name, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 4) * 0.08, duration: 0.5 }}
              className="group relative flex aspect-[4/3] flex-col items-center justify-center gap-3 bg-ink p-6 text-center transition-colors hover:bg-panel"
            >
              <span className="font-heading text-3xl font-bold text-white/10 transition-colors group-hover:text-gold/30">
                0{i + 1}
              </span>
              <span className="text-sm font-medium tracking-wide transition-colors group-hover:text-gold">
                {name}
              </span>
              <span className="absolute bottom-0 left-0 h-px w-0 bg-gold transition-all duration-500 group-hover:w-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
