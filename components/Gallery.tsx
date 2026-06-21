"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { GalleryImage } from "@/lib/gallery-server";
import Reveal from "./Reveal";

function TiltPhoto({ item }: { item: GalleryImage }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [7, -7]), { stiffness: 180, damping: 18 });
  const ry = useSpring(useTransform(mx, [0, 1], [-7, 7]), { stiffness: 180, damping: 18 });

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
    <motion.figure
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className="group relative mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-white/10 shadow-lg [transform-style:preserve-3d]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.imageUrl}
        alt={item.caption ?? "Our work"}
        loading="lazy"
        className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
      />
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute inset-0 bg-gradient-to-t from-gold/10 via-transparent to-transparent" />
      </div>
      {(item.caption || item.category) && (
        <figcaption className="absolute inset-x-0 bottom-0 translate-y-1 bg-gradient-to-t from-ink/90 to-transparent p-4 opacity-90 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          {item.category && (
            <span className="text-[10px] uppercase tracking-[0.2em] text-gold">
              {item.category}
            </span>
          )}
          {item.caption && <p className="text-sm text-paper">{item.caption}</p>}
        </figcaption>
      )}
    </motion.figure>
  );
}

export default function Gallery({
  items,
  heading = true,
}: {
  items: GalleryImage[];
  heading?: boolean;
}) {
  if (items.length === 0) return null;

  return (
    <section id="gallery" className="container-px py-24 md:py-32">
      {heading && (
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <Reveal>
            <span className="text-xs uppercase tracking-[0.3em] text-gold">
              Our Work
            </span>
          </Reveal>
          <Reveal index={1}>
            <h2 className="mt-4 font-heading text-4xl font-bold leading-tight text-balance md:text-5xl">
              A look at what we&rsquo;ve built
            </h2>
          </Reveal>
        </div>
      )}

      <div className="columns-2 gap-4 md:columns-3">
        {items.map((it) => (
          <TiltPhoto key={it.id} item={it} />
        ))}
      </div>
    </section>
  );
}
