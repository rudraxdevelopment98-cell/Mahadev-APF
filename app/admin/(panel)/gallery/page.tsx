import { prisma } from "@/lib/db";
import { createGalleryItem, deleteGalleryItem } from "@/lib/actions/gallery-actions";

export const dynamic = "force-dynamic";

const input =
  "w-full rounded-lg border border-white/10 bg-ink/60 px-3 py-2 text-sm outline-none focus:border-gold";

export default async function GalleryAdminPage() {
  let items: Awaited<ReturnType<typeof prisma.galleryItem.findMany>> = [];
  try {
    items = await prisma.galleryItem.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
  } catch {
    items = [];
  }

  return (
    <div>
      <h1 className="mb-1 font-heading text-3xl font-bold">Photo Gallery</h1>
      <p className="mb-6 text-sm text-muted">
        Add photos of your work to show on the website. Paste an image link (URL)
        for each photo.
      </p>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_2fr]">
        <form
          action={createGalleryItem}
          className="h-fit space-y-3 rounded-2xl border border-white/10 bg-ink-soft/40 p-5"
        >
          <h2 className="font-heading text-lg font-bold">Add Photo</h2>
          <input name="imageUrl" placeholder="Image link (https://…) *" required className={input} />
          <input name="caption" placeholder="Caption (e.g. Modular kitchen, Satellite)" className={input} />
          <input name="category" placeholder="Category (e.g. Kitchen)" className={input} />
          <input name="order" type="number" placeholder="Order (0 = first)" className={input} />
          <button className="w-full rounded-full bg-gold py-2.5 text-sm font-semibold text-ink hover:bg-gold-soft">
            Add Photo
          </button>
          <p className="text-xs text-muted">
            Tip: upload your photo to any image host and paste its link here.
            Direct phone upload can be added later.
          </p>
        </form>

        <div>
          {items.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-white/15 p-10 text-center text-muted">
              No photos yet. The gallery section stays hidden on the site until
              you add some.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {items.map((it) => (
                <div key={it.id} className="overflow-hidden rounded-xl border border-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={it.imageUrl} alt={it.caption ?? ""} className="aspect-square w-full object-cover" />
                  <div className="p-2">
                    {it.caption && <p className="truncate text-xs">{it.caption}</p>}
                    <form action={deleteGalleryItem.bind(null, it.id)}>
                      <button className="mt-1 text-xs text-red-300 hover:underline">
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
