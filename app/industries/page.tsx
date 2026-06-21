import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import MagneticButton from "@/components/MagneticButton";
import { getSpaces } from "@/lib/spaces-server";

export const metadata: Metadata = {
  title: "Spaces",
  description:
    "Mahadev APF works in homes, apartments, offices, showrooms, shops, restaurants, hospitals and for builders & contractors.",
};

export default async function IndustriesPage() {
  const spaces = await getSpaces();
  return (
    <main>
      <PageHeader
        eyebrow="Where We Work"
        title="Spaces we work in"
        description="From homes and apartments to offices, showrooms and shops, we build windows, furniture and glass works to suit each space."
        crumbs={[{ label: "Spaces" }]}
      />

      <section className="container-px pb-28 md:pb-36">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {spaces.map((sp, i) => (
            <Reveal key={sp.id ?? sp.name} index={i % 3}>
              <article className="group relative flex h-full min-h-[260px] flex-col justify-end overflow-hidden rounded-2xl border border-white/10 bg-panel/60 p-8 transition-all duration-500 hover:-translate-y-1 hover:border-gold/40">
                {sp.imageUrl ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={sp.imageUrl}
                      alt={sp.name}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
                  </>
                ) : (
                  <span className="absolute right-6 top-6 font-heading text-4xl font-bold text-white/10 transition-colors group-hover:text-gold/30">
                    0{i + 1}
                  </span>
                )}
                <div className="relative">
                  <h3 className="font-heading text-xl font-bold">{sp.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {sp.body}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-16 flex flex-col items-center gap-6 rounded-3xl border border-white/10 bg-ink-soft/60 p-12 text-center">
            <h2 className="font-heading text-3xl font-bold text-balance md:text-4xl">
              Got a different space in mind?
            </h2>
            <p className="max-w-xl text-muted">
              Whatever the room or building, we can design and build windows,
              furniture or glass works to fit. Tell us what you need.
            </p>
            <MagneticButton href="/contact" variant="solid">
              Get a free estimate
            </MagneticButton>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
