"use client";

import { advantages } from "@/lib/data";
import Reveal from "./Reveal";

const icons = ["◈", "▣", "✦", "❖", "⬡", "✧"];

export default function WhyChooseUs() {
  return (
    <section id="why" className="container-px py-28 md:py-36">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <span className="text-xs uppercase tracking-[0.3em] text-gold">
            Why Mahadev APF
          </span>
        </Reveal>
        <Reveal index={1}>
          <h2 className="mt-4 font-heading text-4xl font-bold leading-tight text-balance md:text-5xl">
            Why families &amp; businesses choose us
          </h2>
        </Reveal>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {advantages.map((a, i) => (
          <Reveal key={a.title} index={i % 3}>
            <div className="glass group h-full rounded-2xl p-8 transition-all duration-500 hover:-translate-y-1 hover:border-gold/40">
              <div className="grid h-12 w-12 place-items-center rounded-xl border border-gold/40 text-xl text-gold transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                {icons[i % icons.length]}
              </div>
              <h3 className="mt-6 font-heading text-xl font-bold">{a.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{a.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
