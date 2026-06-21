"use client";

import { motion } from "framer-motion";
import type { SpaceItem } from "@/lib/spaces";
import Reveal from "./Reveal";

export default function Industries({ spaces }: { spaces: SpaceItem[] }) {
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
              Where We Work
            </span>
          </Reveal>
          <Reveal index={1}>
            <h2 className="mt-4 font-heading text-4xl font-bold leading-tight text-balance md:text-5xl">
              Spaces we work in
            </h2>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
          {spaces.map((sp, i) => (
            <motion.div
              key={sp.id ?? sp.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 4) * 0.08, duration: 0.5 }}
              className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl border border-white/10 bg-ink p-5"
            >
              {sp.imageUrl ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sp.imageUrl}
                    alt={sp.name}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
                </>
              ) : (
                <>
                  <div className="absolute inset-0 grid-lines opacity-40" />
                  <span className="absolute right-4 top-3 font-heading text-3xl font-bold text-white/10 transition-colors group-hover:text-gold/30">
                    0{i + 1}
                  </span>
                </>
              )}
              <div className="relative">
                <h3 className="font-heading text-base font-bold leading-tight transition-colors group-hover:text-gold">
                  {sp.name}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs text-muted">{sp.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
