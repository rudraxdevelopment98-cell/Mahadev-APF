import Link from "next/link";
import { prisma } from "@/lib/db";
import { createSpace, deleteSpace } from "@/lib/actions/space-actions";

export const dynamic = "force-dynamic";

const input =
  "w-full rounded-lg border border-white/10 bg-ink/60 px-3 py-2 text-sm outline-none focus:border-gold";

export default async function SpacesPage() {
  let spaces: Awaited<ReturnType<typeof prisma.space.findMany>> = [];
  try {
    spaces = await prisma.space.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
  } catch {
    spaces = [];
  }

  return (
    <div>
      <h1 className="mb-1 font-heading text-3xl font-bold">Spaces</h1>
      <p className="mb-6 text-sm text-muted">
        The &ldquo;Spaces we work in&rdquo; cards (homes, offices, shops…). Add a
        photo to each. Until you add any, a default set is shown.
      </p>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_2fr]">
        <form
          action={createSpace}
          className="h-fit space-y-3 rounded-2xl border border-white/10 bg-ink-soft/40 p-5"
        >
          <h2 className="font-heading text-lg font-bold">Add Space</h2>
          <input name="name" placeholder="Name * (e.g. Homes & Apartments)" required className={input} />
          <textarea name="body" placeholder="Short description *" rows={3} required className={input} />
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-muted">Photo</label>
            <input
              name="image"
              type="file"
              accept="image/*"
              className="w-full text-sm text-muted file:mr-3 file:rounded-full file:border-0 file:bg-gold file:px-4 file:py-2 file:text-sm file:font-semibold file:text-ink"
            />
            <input name="imageUrl" placeholder="…or paste an image link" className={input + " mt-2"} />
          </div>
          <input name="order" type="number" placeholder="Order (0 = first)" className={input} />
          <button className="w-full rounded-full bg-gold py-2.5 text-sm font-semibold text-ink hover:bg-gold-soft">
            Add Space
          </button>
        </form>

        <div className="space-y-3">
          {spaces.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-white/15 p-10 text-center text-muted">
              No spaces added yet — the website shows a default set.
            </p>
          ) : (
            spaces.map((sp) => (
              <div key={sp.id} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-ink-soft/40 p-4">
                {sp.imageUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={sp.imageUrl} alt={sp.name} className="h-16 w-16 shrink-0 rounded-lg object-cover" />
                ) : (
                  <div className="grid h-16 w-16 shrink-0 place-items-center rounded-lg border border-white/10 text-xs text-muted">
                    no photo
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-medium">
                    {sp.name}
                    {!sp.isActive && <span className="ml-2 text-xs text-muted">(hidden)</span>}
                  </p>
                  <p className="text-sm text-muted">{sp.body}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2 text-sm">
                  <Link href={`/admin/spaces/${sp.id}`} className="text-gold hover:underline">Edit</Link>
                  <form action={deleteSpace.bind(null, sp.id)}>
                    <button className="text-red-300 hover:underline">Delete</button>
                  </form>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
