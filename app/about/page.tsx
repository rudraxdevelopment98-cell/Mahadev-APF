import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import Stats from "@/components/Stats";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import { company, milestones } from "@/lib/data";

export const metadata: Metadata = {
  title: "About",
  description: `15+ years of in-house craftsmanship. ${company.intro}`,
};

export default function AboutPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Our Story"
        title="Built in our workshop, fitted by our team"
        description={company.intro}
        crumbs={[{ label: "About" }]}
      />

      <section className="container-px pb-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <p className="text-lg leading-relaxed text-muted">
              Mahadev APF started as a small aluminium fabrication workshop in
              Ahmedabad and has grown into a one-stop shop for furniture, aluminium
              and uPVC windows & doors, and glass works. Over 15 years we&rsquo;ve
              fitted thousands of windows and built hundreds of kitchens, wardrobes
              and interiors for happy families and businesses.
            </p>
          </Reveal>
          <Reveal index={1}>
            <p className="text-lg leading-relaxed text-muted">
              Our advantage is control. Because we design, fabricate and fit with
              our own team and workshop, we keep quality high, prices fair and
              timelines short — and we back every job with a proper GST bill and
              after-sales service.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Timeline */}
      <section className="container-px py-20">
        <Reveal>
          <h2 className="font-heading text-3xl font-bold md:text-4xl">
            Our journey so far
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
