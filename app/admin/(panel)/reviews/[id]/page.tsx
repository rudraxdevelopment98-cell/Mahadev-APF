import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { updateReview } from "@/lib/actions/review-actions";

export const dynamic = "force-dynamic";

const input =
  "w-full rounded-lg border border-white/10 bg-ink/60 px-3 py-2 text-sm outline-none focus:border-gold";

export default async function EditReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const r = await prisma.review.findUnique({ where: { id } });
  if (!r) notFound();
  const save = updateReview.bind(null, id);

  return (
    <div className="max-w-lg">
      <Link href="/admin/reviews" className="text-sm text-muted hover:text-gold">
        ← Reviews
      </Link>
      <h1 className="mb-6 mt-2 font-heading text-3xl font-bold">Edit Review</h1>
      <form action={save} className="space-y-3 rounded-2xl border border-white/10 bg-ink-soft/40 p-5">
        <input name="name" defaultValue={r.name} placeholder="Customer name *" required className={input} />
        <input name="location" defaultValue={r.location ?? ""} placeholder="Area / type" className={input} />
        <textarea name="quote" defaultValue={r.quote} placeholder="What they said *" rows={4} required className={input} />
        <div className="grid grid-cols-2 gap-3">
          <select name="rating" defaultValue={String(r.rating)} className={input}>
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>{n} star{n > 1 ? "s" : ""}</option>
            ))}
          </select>
          <input name="order" type="number" defaultValue={r.order} placeholder="Order" className={input} />
        </div>
        <input type="hidden" name="hasActive" value="1" />
        <label className="flex items-center gap-2 text-sm text-muted">
          <input type="checkbox" name="isActive" defaultChecked={r.isActive} /> Show on website
        </label>
        <button className="w-full rounded-full bg-gold py-2.5 text-sm font-semibold text-ink hover:bg-gold-soft">
          Save Changes
        </button>
      </form>
    </div>
  );
}
