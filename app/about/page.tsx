import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import Stats from "@/components/Stats";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import { company, milestones } from "@/lib/data";

export const metadata: Metadata = {
  title: "About",
  description: `Two decades of precision engineering. ${company.intro}`,
};

export default function AboutPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Our Story"
        title="Institutional discipline, engineering precision"
        description={company.intro}
        crumbs={[{ label: "About" }]}
      />

      <section className="container-px pb-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <p className="text-lg leading-relaxed text-muted">
              Founded in 1998 as a precision fabrication workshop, Mahadev APF has
              grown into a vertically integrated manufacturing house trusted on
              six continents. We engineer the structural and electromechanical
              systems behind landmark infrastructure — and we run every program
              with the measured accountability of institutional capital.
            </p>
          </Reveal>
          <Reveal index={1}>
            <p className="text-lg leading-relaxed text-muted">
              Our advantage is control. By keeping design, fabrication, finishing
              and quality assurance under one roof, we compress lead times,
              eliminate hand-off risk and guarantee tolerances that survive the
              journey from drawing board to commissioning.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Timeline */}
      <section className="container-px py-20">
        <Reveal>
          <h2 className="font-heading text-3xl font-bold md:text-4xl">
            A track record measured in decades
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 md:grid-cols-5">
          {milestones.map((m, i) => (
            <Reveal key={m.year} index={i}>
              <div className="h-full bg-ink p-6">
                <p className="font-heading text-3xl font-bold text-gold-gradient">
                  {m.year}
                </p>
                <p className="mt-3 font-heading text-base font-bold">{m.title}</p>
                <p className="mt-2 text-sm text-muted">{m.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Stats />
      <WhyChooseUs />
      <Testimonials />
    </main>
  );
}
