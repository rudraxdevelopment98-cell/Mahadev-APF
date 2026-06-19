"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { type Product } from "@/lib/data";
import Reveal from "./Reveal";

/** 3D-tilt + hover-glow product card linking to the detail page. */
export default function ProductCard({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [8, -8]), {
    stiffness: 200,
    damping: 20,
  });
  const ry = useSpring(useTransform(mx, [0, 1], [-8, 8]), {
    stiffness: 200,
    damping: 20,
  });

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  }
  function reset() {
    mx.set(0.5);
    my.set(0.5);
  }

  return (
    <Reveal index={index % 3}>
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={reset}
        style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
        className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-panel/60 p-7 transition-shadow duration-500 hover:[box-shadow:var(--shadow-glow)]"
      >
        <div className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-transparent" />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-[0.2em] text-gold">
            {product.category}
          </span>
          <span className="font-heading text-sm text-muted">0{index + 1}</span>
        </div>

        <h3 className="mt-5 font-heading text-2xl font-bold leading-tight">
          {product.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted">{product.blurb}</p>

        <ul className="mt-6 space-y-2">
          {product.specs.slice(0, 3).map((spec) => (
            <li
              key={spec.label}
              className="flex items-center gap-2 text-xs text-muted"
            >
              <span className="h-1 w-1 rounded-full bg-gold" />
              {spec.value}
            </li>
          ))}
        </ul>

        <Link
          href={`/products/${product.slug}`}
          className="mt-7 flex items-center gap-2 text-sm font-medium text-gold transition-all hover:gap-3"
        >
          View product
          <span>→</span>
        </Link>
      </motion.div>
    </Reveal>
  );
}
