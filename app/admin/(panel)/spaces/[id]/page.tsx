import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { updateSpace } from "@/lib/actions/space-actions";

export const dynamic = "force-dynamic";

const input =
  "w-full rounded-lg border border-white/10 bg-ink/60 px-3 py-2 text-sm outline-none focus:border-gold";

export default async function EditSpacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sp = await prisma.space.findUnique({ where: { id } });
  if (!sp) notFound();
  const save = updateSpace.bind(null, id);

  return (
    <div className="max-w-lg">
      <Link href="/admin/spaces" className="text-sm text-muted hover:text-gold">
        ← Spaces
      </Link>
      <h1 className="mb-6 mt-2 font-heading text-3xl font-bold">Edit Space</h1>
      <form action={save} className="space-y-3 rounded-2xl border border-white/10 bg-ink-soft/40 p-5">
        <input name="name" defaultValue={sp.name} placeholder="Name *" required className={input} />
        <textarea name="body" defaultValue={sp.body} placeholder="Short description *" rows={3} required className={input} />
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-muted">Photo</label>
          {sp.imageUrl && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={sp.imageUrl} alt={sp.name} className="mb-2 h-24 w-auto rounded-lg object-cover" />
          )}
          <input
            name="image"
            type="file"
            accept="image/*"
            className="w-full text-sm text-muted file:mr-3 file:rounded-full file:border-0 file:bg-gold file:px-4 file:py-2 file:text-sm file:font-semibold file:text-ink"
          />
        </div>
        <input name="order" type="number" defaultValue={sp.order} placeholder="Order" className={input} />
        <input type="hidden" name="hasActive" value="1" />
        <label className="flex items-center gap-2 text-sm text-muted">
          <input type="checkbox" name="isActive" defaultChecked={sp.isActive} /> Show on website
        </label>
        <button className="w-full rounded-full bg-gold py-2.5 text-sm font-semibold text-ink hover:bg-gold-soft">
          Save Changes
        </button>
      </form>
    </div>
  );
}
