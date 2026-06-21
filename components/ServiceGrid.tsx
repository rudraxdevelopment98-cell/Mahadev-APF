"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { ServiceItem } from "@/lib/services";
import Reveal from "./Reveal";

function ServiceCard({ service, index }: { service: ServiceItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [8, -8]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(mx, [0, 1], [-8, 8]), { stiffness: 200, damping: 20 });

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  }

  return (
    <Reveal index={index % 3}>
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={() => {
          mx.set(0.5);
          my.set(0.5);
        }}
        style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-panel/60 p-7 transition-shadow duration-500 hover:[box-shadow:var(--shadow-glow)]"
      >
        <div className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-transparent" />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-[0.2em] text-gold">
            {service.category}
          </span>
          <span className="font-heading text-sm text-muted">
            0{index + 1}
          </span>
        </div>

        <h3 className="mt-5 font-heading text-2xl font-bold leading-tight">
          {service.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted">{service.blurb}</p>

        {service.points.length > 0 && (
          <ul className="mt-6 space-y-2">
            {service.points.slice(0, 4).map((p) => (
              <li key={p} className="flex items-center gap-2 text-xs text-muted">
                <span className="h-1 w-1 rounded-full bg-gold" />
                {p}
              </li>
            ))}
          </ul>
        )}

        <Link
          href="/contact"
          className="mt-7 flex items-center gap-2 text-sm font-medium text-gold transition-all hover:gap-3"
        >
          Get a quote
          <span>→</span>
        </Link>
      </motion.div>
    </Reveal>
  );
}

export default function ServiceGrid({ services }: { services: ServiceItem[] }) {
  const [filter, setFilter] = useState("All");
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(services.map((s) => s.category)))],
    [services],
  );
  const visible =
    filter === "All" ? services : services.filter((s) => s.category === filter);

  return (
    <>
      <Reveal>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`rounded-full border px-4 py-1.5 text-xs transition-colors ${
                filter === c
                  ? "border-gold bg-gold text-ink"
                  : "border-white/15 text-muted hover:border-gold/60 hover:text-paper"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </Reveal>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((s, i) => (
          <ServiceCard key={s.id ?? s.title} service={s} index={i} />
        ))}
      </div>
    </>
  );
}
