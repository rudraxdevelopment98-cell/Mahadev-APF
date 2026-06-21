import Link from "next/link";
import { prisma } from "@/lib/db";
import { createService, deleteService } from "@/lib/actions/service-actions";

export const dynamic = "force-dynamic";

const input =
  "w-full rounded-lg border border-white/10 bg-ink/60 px-3 py-2 text-sm outline-none focus:border-gold";

function points(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String) : [];
}

export default async function ServicesPage() {
  let services: Awaited<ReturnType<typeof prisma.service.findMany>> = [];
  try {
    services = await prisma.service.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
  } catch {
    services = [];
  }

  return (
    <div>
      <h1 className="mb-1 font-heading text-3xl font-bold">Services</h1>
      <p className="mb-6 text-sm text-muted">
        The work you offer, shown on the website. Until you add any here, the
        website shows a default set.
      </p>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_2fr]">
        {/* Add form */}
        <form
          action={createService}
          className="h-fit space-y-3 rounded-2xl border border-white/10 bg-ink-soft/40 p-5"
        >
          <h2 className="font-heading text-lg font-bold">Add Service</h2>
          <input name="title" placeholder="Title * (e.g. Aluminium Windows)" required className={input} />
          <input name="category" placeholder="Category (e.g. Aluminium)" className={input} />
          <textarea name="blurb" placeholder="Short description *" rows={3} required className={input} />
          <textarea
            name="points"
            placeholder="Key points — one per line&#10;e.g. Made to size&#10;Powder-coated&#10;Weather-sealed"
            rows={4}
            className={input}
          />
          <input name="order" type="number" placeholder="Order (0 = first)" className={input} />
          <button className="w-full rounded-full bg-gold py-2.5 text-sm font-semibold text-ink hover:bg-gold-soft">
            Add Service
          </button>
        </form>

        {/* List */}
        <div className="space-y-3">
          {services.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-white/15 p-10 text-center text-muted">
              No services added yet — the website is showing the default set.
            </p>
          ) : (
            services.map((s) => (
              <div
                key={s.id}
                className="rounded-2xl border border-white/10 bg-ink-soft/40 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs uppercase tracking-[0.2em] text-gold">
                      {s.category}
                    </span>
                    <h3 className="mt-1 font-heading text-lg font-bold">
                      {s.title}
                      {!s.isActive && (
                        <span className="ml-2 text-xs text-muted">(hidden)</span>
                      )}
                    </h3>
                    <p className="mt-1 text-sm text-muted">{s.blurb}</p>
                    {points(s.points).length > 0 && (
                      <p className="mt-2 text-xs text-muted">
                        {points(s.points).join(" · ")}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <Link href={`/admin/services/${s.id}`} className="text-sm text-gold hover:underline">
                      Edit
                    </Link>
                    <form action={deleteService.bind(null, s.id)}>
                      <button className="text-sm text-red-300 hover:underline">
                        Delete
                      </button>
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
