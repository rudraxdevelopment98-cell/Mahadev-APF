import Link from "next/link";
import { prisma } from "@/lib/db";
import { createReview, deleteReview } from "@/lib/actions/review-actions";

export const dynamic = "force-dynamic";

const input =
  "w-full rounded-lg border border-white/10 bg-ink/60 px-3 py-2 text-sm outline-none focus:border-gold";

function Stars({ n }: { n: number }) {
  return <span className="text-gold">{"★".repeat(n)}{"☆".repeat(5 - n)}</span>;
}

export default async function ReviewsPage() {
  let reviews: Awaited<ReturnType<typeof prisma.review.findMany>> = [];
  try {
    reviews = await prisma.review.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
  } catch {
    reviews = [];
  }

  return (
    <div>
      <h1 className="mb-1 font-heading text-3xl font-bold">Reviews</h1>
      <p className="mb-6 text-sm text-muted">
        Customer reviews shown on the website. Until you add any, a default set is shown.
      </p>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_2fr]">
        <form
          action={createReview}
          className="h-fit space-y-3 rounded-2xl border border-white/10 bg-ink-soft/40 p-5"
        >
          <h2 className="font-heading text-lg font-bold">Add Review</h2>
          <input name="name" placeholder="Customer name *" required className={input} />
          <input name="location" placeholder="Area / type (e.g. Homeowner, Satellite)" className={input} />
          <textarea name="quote" placeholder="What they said *" rows={4} required className={input} />
          <div className="grid grid-cols-2 gap-3">
            <select name="rating" defaultValue="5" className={input}>
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} star{r > 1 ? "s" : ""}
                </option>
              ))}
            </select>
            <input name="order" type="number" placeholder="Order" className={input} />
          </div>
          <button className="w-full rounded-full bg-gold py-2.5 text-sm font-semibold text-ink hover:bg-gold-soft">
            Add Review
          </button>
        </form>

        <div className="space-y-3">
          {reviews.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-white/15 p-10 text-center text-muted">
              No reviews added yet — the website shows a default set.
            </p>
          ) : (
            reviews.map((r) => (
              <div key={r.id} className="rounded-2xl border border-white/10 bg-ink-soft/40 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Stars n={r.rating} />
                    <p className="mt-2 text-sm">&ldquo;{r.quote}&rdquo;</p>
                    <p className="mt-2 text-sm font-medium">
                      {r.name}
                      {r.location ? <span className="text-muted"> · {r.location}</span> : null}
                      {!r.isActive && <span className="ml-2 text-xs text-muted">(hidden)</span>}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <Link href={`/admin/reviews/${r.id}`} className="text-sm text-gold hover:underline">
                      Edit
                    </Link>
                    <form action={deleteReview.bind(null, r.id)}>
                      <button className="text-sm text-red-300 hover:underline">Delete</button>
                    </form>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
