import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ProductCatalog from "@/components/ProductCatalog";

export const metadata: Metadata = {
  title: "Our Work",
  description:
    "Explore Mahadev APF's work — aluminium & uPVC windows and doors, modular kitchens, wardrobes, glass works and office interiors.",
};

export default function ProductsPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Our Work"
        title="Windows, furniture & glass — made to fit"
        description="Designed, fabricated and fitted by our own team. Browse what we do, or send us your sizes for a free estimate."
        crumbs={[{ label: "Our Work" }]}
      />
      <section className="container-px pb-28 md:pb-36">
        <ProductCatalog />
      </section>
    </main>
  );
}
