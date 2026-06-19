"use client";

import { useMemo, useState } from "react";
import { products } from "@/lib/data";
import ProductCard from "./ProductCard";
import Reveal from "./Reveal";

/** Filterable product grid shared by the home section and the catalog page. */
export default function ProductCatalog() {
  const [filter, setFilter] = useState("All");
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((p) => p.category)))],
    []
  );
  const visible =
    filter === "All" ? products : products.filter((p) => p.category === filter);

  return (
    <>
      <Reveal>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`rounded-full border px-4 py-1.5 text-xs transition-colors ${
                filter === c
                  ? "border-gold bg-gold text-ink"
                  : "border-white/15 text-muted hover:border-gold/60 hover:text-paper"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </Reveal>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((p, i) => (
          <ProductCard key={p.slug} product={p} index={i} />
        ))}
      </div>
    </>
  );
}
