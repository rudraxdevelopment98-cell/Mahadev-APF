"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { testimonials } from "@/lib/data";
import Reveal from "./Reveal";

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const active = testimonials[index];

  const go = (dir: number) =>
    setIndex((i) => (i + dir + testimonials.length) % testimonials.length);

  return (
    <section id="testimonials" className="container-px py-28 md:py-36">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <Reveal>
            <span className="text-xs uppercase tracking-[0.3em] text-gold">
              Client Confidence
            </span>
          </Reveal>
          <Reveal index={1}>
            <h2 className="mt-4 font-heading text-4xl font-bold leading-tight text-balance md:text-5xl">
              The standard our clients{" "}
              <span className="text-gold-gradient">stake their projects on</span>.
            </h2>
          </Reveal>
        </div>

        <Reveal index={2}>
          <div className="relative glass rounded-3xl p-8 md:p-12">
            <span className="font-heading text-7xl leading-none text-gold/30">
              &ldquo;
            </span>
            <div className="min-h-[180px]">
              <AnimatePresence mode="wait">
                <motion.blockquote
                  key={index}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.5 }}
                  className="-mt-6"
                >
                  <p className="text-lg leading-relaxed md:text-xl">
                    {active.quote}
                  </p>
                  <footer className="mt-7">
                    <p className="font-heading font-bold text-gold">
                      {active.name}
                    </p>
                    <p className="text-sm text-muted">{active.role}</p>
                  </footer>
                </motion.blockquote>
              </AnimatePresence>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Testimonial ${i + 1}`}
                    onClick={() => setIndex(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === index ? "w-8 bg-gold" : "w-2 bg-white/20"
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  aria-label="Previous"
                  onClick={() => go(-1)}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/15 transition-colors hover:border-gold hover:text-gold"
                >
                  ←
                </button>
                <button
                  aria-label="Next"
                  onClick={() => go(1)}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/15 transition-colors hover:border-gold hover:text-gold"
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
