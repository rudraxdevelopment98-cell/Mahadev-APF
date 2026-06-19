import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import MagneticButton from "@/components/MagneticButton";
import ProductCard from "@/components/ProductCard";
import { getProduct, products } from "@/lib/data";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Product not found" };
  return { title: product.title, description: product.blurb };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = products.filter((p) => p.slug !== product.slug).slice(0, 3);

  return (
    <main>
      <PageHeader
        eyebrow={product.category}
        title={product.title}
        description={product.blurb}
        crumbs={[
          { label: "Products", href: "/products" },
          { label: product.title },
        ]}
      />

      <section className="container-px pb-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Gallery */}
          <Reveal>
            <div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10">
                <div className="absolute inset-0 bg-gradient-to-br from-panel via-ink-soft to-ink" />
                <div className="absolute inset-0 grid-lines opacity-60" />
                <div className="gold-streak" />
                <div className="absolute bottom-5 left-5 rounded-full border border-gold/40 bg-ink/60 px-4 py-1.5 text-xs text-gold backdrop-blur">
                  {product.subcategory}
                </div>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-4">
                {product.gallery.map((g) => (
                  <div
                    key={g}
                    className="relative grid aspect-square place-items-center overflow-hidden rounded-xl border border-white/10 bg-panel/60 text-[10px] uppercase tracking-wider text-muted"
                  >
                    <div className="absolute inset-0 grid-lines opacity-40" />
                    <span className="relative">{g}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Details */}
          <Reveal index={1}>
            <div>
              <p className="text-muted leading-relaxed">{product.description}</p>

              <div className="mt-8">
                <h3 className="font-heading text-lg font-bold">Key features</h3>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {product.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-gold/40 text-[10px] text-gold">
                        ✓
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <MagneticButton href="/contact" variant="solid">
                  Request a Quote
                </MagneticButton>
                <MagneticButton href="#downloads" variant="outline">
                  Downloads
                </MagneticButton>
              </div>

              <p className="mt-6 text-sm text-muted">
                Typical lead time:{" "}
                <span className="text-paper">{product.leadTime}</span>
              </p>
            </div>
          </Reveal>
        </div>

        {/* Specs + downloads */}
        <div className="mt-16 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <h3 className="border-b border-white/10 bg-panel/60 px-6 py-4 font-heading text-lg font-bold">
                Technical specifications
              </h3>
              <dl>
                {product.specs.map((s, i) => (
                  <div
                    key={s.label}
                    className={`flex items-center justify-between px-6 py-4 text-sm ${
                      i % 2 ? "bg-white/[0.02]" : ""
                    }`}
                  >
                    <dt className="text-muted">{s.label}</dt>
                    <dd className="font-medium">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>

          <Reveal index={1}>
            <div id="downloads" className="rounded-2xl border border-white/10 p-6">
              <h3 className="font-heading text-lg font-bold">Downloads</h3>
              <ul className="mt-4 space-y-3">
                {product.downloads.map((d) => (
                  <li key={d.label}>
                    <a
                      href="#"
                      className="group flex items-center justify-between rounded-xl border border-white/10 px-4 py-3 text-sm transition-colors hover:border-gold/50"
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-gold">⬇</span>
                        {d.label}
                      </span>
                      <span className="text-xs text-muted">{d.size}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Related */}
      <section className="container-px pb-28 md:pb-36">
        <div className="mb-10 flex items-end justify-between">
          <h2 className="font-heading text-3xl font-bold md:text-4xl">
            Related products
          </h2>
          <Link href="/products" className="text-sm text-gold hover:underline">
            All products →
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {related.map((p, i) => (
            <ProductCard key={p.slug} product={p} index={i} />
          ))}
        </div>
      </section>
    </main>
  );
}
