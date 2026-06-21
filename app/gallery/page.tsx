import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Gallery from "@/components/Gallery";
import { getGallery } from "@/lib/gallery-server";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos of our furniture, windows and glass works.",
};

export default async function GalleryPage() {
  const items = await getGallery();
  return (
    <main>
      <PageHeader
        eyebrow="Our Work"
        title="Gallery of our work"
        description="A selection of furniture, windows, doors and glass works we've designed, built and fitted."
        crumbs={[{ label: "Gallery" }]}
      />
      {items.length === 0 ? (
        <p className="container-px pb-28 text-center text-muted">
          Photos coming soon.
        </p>
      ) : (
        <Gallery items={items} heading={false} />
      )}
    </main>
  );
}
