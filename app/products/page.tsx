import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ProductCatalog from "@/components/ProductCatalog";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Explore the Mahadev APF catalogue — structural steel, aluminium extrusion, cleanroom systems, switchgear, conveyance and bespoke OEM engineering.",
};

export default function ProductsPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Catalogue"
        title="Precision systems for demanding industries"
        description="Engineered, fabricated and finished under one roof. Browse our core capabilities or request a tailored specification."
        crumbs={[{ label: "Products" }]}
      />
      <section className="container-px pb-28 md:pb-36">
        <ProductCatalog />
      </section>
    </main>
  );
}
