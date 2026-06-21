import type { GalleryImage } from "@/lib/gallery-server";
import Reveal from "./Reveal";

/** Photo grid of the shop's real work. */
export default function Gallery({
  items,
  heading = true,
}: {
  items: GalleryImage[];
  heading?: boolean;
}) {
  if (items.length === 0) return null;

  return (
    <section id="gallery" className="container-px py-24 md:py-32">
      {heading && (
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <Reveal>
            <span className="text-xs uppercase tracking-[0.3em] text-gold">
              Our Work
            </span>
          </Reveal>
          <Reveal index={1}>
            <h2 className="mt-4 font-heading text-4xl font-bold leading-tight text-balance md:text-5xl">
              A look at what we&rsquo;ve built
            </h2>
          </Reveal>
        </div>
      )}

      <div className="columns-2 gap-4 md:columns-3 [&>*]:mb-4">
        {items.map((it, i) => (
          <Reveal key={it.id} index={i % 3}>
            <figure className="group relative overflow-hidden rounded-2xl border border-white/10 break-inside-avoid">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={it.imageUrl}
                alt={it.caption ?? "Our work"}
                loading="lazy"
                className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {(it.caption || it.category) && (
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-4">
                  {it.category && (
                    <span className="text-[10px] uppercase tracking-[0.2em] text-gold">
                      {it.category}
                    </span>
                  )}
                  {it.caption && (
                    <p className="text-sm text-paper">{it.caption}</p>
                  )}
                </figcaption>
              )}
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
