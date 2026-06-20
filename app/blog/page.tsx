import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { blogPosts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Tips",
  description:
    "Helpful tips on windows, furniture and glass works from the Mahadev APF team.",
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogPage() {
  const [featured, ...rest] = blogPosts;

  return (
    <main>
      <PageHeader
        eyebrow="Tips & Guides"
        title="Tips to help you choose right"
        description="Simple, honest advice on windows, modular furniture and glass works — from the team that builds them."
        crumbs={[{ label: "Tips" }]}
      />

      <section className="container-px pb-28 md:pb-36">
        {/* Featured */}
        <Reveal>
          <Link
            href={`/blog/${featured.slug}`}
            className="group grid overflow-hidden rounded-3xl border border-white/10 bg-panel/60 transition-colors hover:border-gold/40 lg:grid-cols-2"
          >
            <div className="relative min-h-[260px]">
              <div className="absolute inset-0 bg-gradient-to-br from-panel via-ink-soft to-ink" />
              <div className="absolute inset-0 grid-lines opacity-50" />
              <div className="gold-streak" />
            </div>
            <div className="p-8 md:p-12">
              <span className="text-xs uppercase tracking-[0.2em] text-gold">
                {featured.category} · Featured
              </span>
              <h2 className="mt-4 font-heading text-3xl font-bold leading-tight text-balance md:text-4xl">
                {featured.title}
              </h2>
              <p className="mt-4 text-muted leading-relaxed">{featured.excerpt}</p>
              <p className="mt-6 text-xs text-muted">
                {formatDate(featured.date)} · {featured.readingTime} read
              </p>
            </div>
          </Link>
        </Reveal>

        {/* Grid */}
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((post, i) => (
            <Reveal key={post.slug} index={i % 3}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-panel/60 transition-colors hover:border-gold/40"
              >
                <div className="relative h-44">
                  <div className="absolute inset-0 bg-gradient-to-br from-panel via-ink-soft to-ink" />
                  <div className="absolute inset-0 grid-lines opacity-50" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <span className="text-xs uppercase tracking-[0.2em] text-gold">
                    {post.category}
                  </span>
                  <h3 className="mt-3 font-heading text-xl font-bold leading-snug">
                    {post.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                    {post.excerpt}
                  </p>
                  <p className="mt-5 text-xs text-muted">
                    {formatDate(post.date)} · {post.readingTime} read
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
