import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { updateService } from "@/lib/actions/service-actions";

export const dynamic = "force-dynamic";

const input =
  "w-full rounded-lg border border-white/10 bg-ink/60 px-3 py-2 text-sm outline-none focus:border-gold";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const s = await prisma.service.findUnique({ where: { id } });
  if (!s) notFound();

  const pts = Array.isArray(s.points) ? (s.points as string[]).join("\n") : "";
  const save = updateService.bind(null, id);

  return (
    <div className="max-w-lg">
      <Link href="/admin/services" className="text-sm text-muted hover:text-gold">
        ← Services
      </Link>
      <h1 className="mb-6 mt-2 font-heading text-3xl font-bold">Edit Service</h1>

      <form action={save} className="space-y-3 rounded-2xl border border-white/10 bg-ink-soft/40 p-5">
        <input name="title" defaultValue={s.title} placeholder="Title *" required className={input} />
        <input name="category" defaultValue={s.category} placeholder="Category" className={input} />
        <textarea name="blurb" defaultValue={s.blurb} placeholder="Short description *" rows={3} required className={input} />
        <textarea name="points" defaultValue={pts} placeholder="Key points — one per line" rows={4} className={input} />
        <input name="order" type="number" defaultValue={s.order} placeholder="Order" className={input} />
        <input type="hidden" name="hasActive" value="1" />
        <label className="flex items-center gap-2 text-sm text-muted">
          <input type="checkbox" name="isActive" defaultChecked={s.isActive} /> Show on website
        </label>
        <button className="w-full rounded-full bg-gold py-2.5 text-sm font-semibold text-ink hover:bg-gold-soft">
          Save Changes
        </button>
      </form>
    </div>
  );
}
