import Link from "next/link";
import ProductCatalog from "./ProductCatalog";
import Reveal from "./Reveal";

export default function Products() {
  return (
    <section id="products" className="container-px py-28 md:py-36">
      <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <Reveal>
            <span className="text-xs uppercase tracking-[0.3em] text-gold">
              Capabilities
            </span>
          </Reveal>
          <Reveal index={1}>
            <h2 className="mt-4 font-heading text-4xl font-bold leading-tight text-balance md:text-5xl">
              A catalogue engineered for{" "}
              <span className="text-gold-gradient">demanding industries</span>.
            </h2>
          </Reveal>
        </div>

        <Reveal index={2}>
          <Link
            href="/products"
            className="rounded-full border border-gold/60 px-5 py-2 text-sm text-gold transition-colors hover:bg-gold hover:text-ink"
          >
            View full catalogue →
          </Link>
        </Reveal>
      </div>

      <div className="mt-14">
        <ProductCatalog />
      </div>
    </section>
  );
}
