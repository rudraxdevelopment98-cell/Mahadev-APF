import { prisma } from "@/lib/db";
import { deleteGalleryItem } from "@/lib/actions/gallery-actions";
import GalleryUploadForm from "@/components/admin/GalleryUploadForm";

export const dynamic = "force-dynamic";

export default async function GalleryAdminPage() {
  // Blob can be connected via a read-write token OR via OIDC (store ID).
  const blobOn = Boolean(
    process.env.BLOB_READ_WRITE_TOKEN ||
      process.env.BLOB_STORE_ID ||
      process.env.VERCEL_OIDC_TOKEN,
  );
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
      <p className="mb-4 text-sm text-muted">
        Add photos of your work to show on the website.
      </p>

      <div
        className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
          blobOn
            ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
            : "border-amber-400/30 bg-amber-400/10 text-amber-200"
        }`}
      >
        {blobOn ? (
          <>✓ Photo upload is <b>ON</b> — you can upload photos directly from your phone.</>
        ) : (
          <>
            ⚠ Photo upload is <b>OFF</b> on this deployment. Connect a Blob store
            to the project in Vercel and <b>redeploy</b>. Until then, paste an
            image link instead. (If you just connected it, you must redeploy.)
          </>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_2fr]">
        <GalleryUploadForm />

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
