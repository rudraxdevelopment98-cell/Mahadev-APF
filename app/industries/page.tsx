import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import MagneticButton from "@/components/MagneticButton";
import { industries } from "@/lib/data";

export const metadata: Metadata = {
  title: "Industries",
  description:
    "Mahadev APF serves infrastructure, construction, energy, oil & gas, pharmaceuticals, aerospace, automotive and water treatment.",
};

export default function IndustriesPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Industries We Serve"
        title="Trusted across the world's most critical sectors"
        description="From utility-scale power to validated pharmaceutical environments, our systems are engineered for the demands of each industry we serve."
        crumbs={[{ label: "Industries" }]}
      />

      <section className="container-px pb-28 md:pb-36">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {industries.map((ind, i) => (
            <Reveal key={ind.name} index={i % 3}>
              <article className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-panel/60 p-8 transition-all duration-500 hover:-translate-y-1 hover:border-gold/40">
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-transparent" />
                </div>
                <span className="font-heading text-4xl font-bold text-white/10 transition-colors group-hover:text-gold/30">
                  0{i + 1}
                </span>
                <h3 className="mt-4 font-heading text-xl font-bold">{ind.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {ind.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-16 flex flex-col items-center gap-6 rounded-3xl border border-white/10 bg-ink-soft/60 p-12 text-center">
            <h2 className="font-heading text-3xl font-bold text-balance md:text-4xl">
              Don&rsquo;t see your sector?
            </h2>
            <p className="max-w-xl text-muted">
              Our bespoke OEM engineering practice partners with clients across
              every industrial domain. Tell us your challenge.
            </p>
            <MagneticButton href="/contact" variant="solid">
              Talk to our engineers
            </MagneticButton>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
