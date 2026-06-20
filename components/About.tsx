"use client";

import { motion } from "framer-motion";
import type { SiteSettings } from "@/lib/settings";
import Reveal from "./Reveal";

export default function About({ site }: { site: SiteSettings }) {
  return (
    <section id="about" className="container-px relative py-28 md:py-36">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        {/* Split-screen image with reveal */}
        <div className="relative">
          <motion.div
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            whileInView={{ clipPath: "inset(0 0% 0 0)" }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/10"
          >
            {/* Stylised facility visual (pure CSS, no asset required) */}
            <div className="absolute inset-0 bg-gradient-to-br from-panel via-ink-soft to-ink" />
            <div className="absolute inset-0 grid-lines opacity-70" />
            <div className="gold-streak" />
            <div className="absolute inset-0 flex items-end p-8">
              <div className="glass rounded-2xl p-5">
                <p className="font-heading text-3xl font-bold text-gold">15+</p>
                <p className="text-sm text-muted">Years of in-house craftsmanship</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="absolute -right-4 -top-4 h-24 w-24 rounded-2xl border border-gold/40 bg-ink/60 backdrop-blur animate-float-slow"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <div className="flex h-full flex-col items-center justify-center">
              <span className="font-heading text-2xl font-bold text-gold">GST</span>
              <span className="text-[10px] text-muted">Registered</span>
            </div>
          </motion.div>
        </div>

        {/* Copy */}
        <div>
          <Reveal>
            <span className="text-xs uppercase tracking-[0.3em] text-gold">
              Who We Are
            </span>
          </Reveal>
          <Reveal index={1}>
            <h2 className="mt-4 font-heading text-4xl font-bold leading-tight text-balance md:text-5xl">
              {site.aboutHeading}{" "}
              <span className="text-gold-gradient">{site.aboutHeadingGold}</span>.
            </h2>
          </Reveal>
          <Reveal index={2}>
            <p className="mt-6 text-muted leading-relaxed">{site.aboutPara1}</p>
          </Reveal>
          <Reveal index={3}>
            <p className="mt-4 text-muted leading-relaxed">{site.aboutPara2}</p>
          </Reveal>

          <Reveal index={4}>
            <ul className="mt-8 grid grid-cols-2 gap-4">
              {[
                "Own in-house workshop",
                "Free design & measurement",
                "Made-to-measure work",
                "On-time fitting & service",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm">
                  <span className="grid h-6 w-6 place-items-center rounded-full border border-gold/40 text-gold">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
