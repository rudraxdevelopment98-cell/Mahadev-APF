import { prisma } from "@/lib/db";
import { setLeadStatus, deleteLead } from "@/lib/actions/lead-actions";

export const dynamic = "force-dynamic";

const statusStyles: Record<string, string> = {
  NEW: "bg-blue-400/15 text-blue-300",
  CONTACTED: "bg-amber-400/15 text-amber-300",
  DONE: "bg-emerald-400/15 text-emerald-300",
};

export default async function LeadsPage() {
  let leads: Awaited<ReturnType<typeof prisma.lead.findMany>> = [];
  try {
    leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    leads = [];
  }

  const newCount = leads.filter((l) => l.status === "NEW").length;

  return (
    <div>
      <h1 className="mb-1 font-heading text-3xl font-bold">Enquiries</h1>
      <p className="mb-6 text-sm text-muted">
        Messages from the website contact form. {newCount} new.
      </p>

      {leads.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-white/15 p-12 text-center text-muted">
          No enquiries yet. They appear here when someone fills the contact form.
        </p>
      ) : (
        <div className="space-y-3">
          {leads.map((l) => {
            const wa = l.phone
              ? `https://wa.me/${(l.phone.replace(/\D/g, "").length === 10 ? "91" : "") + l.phone.replace(/\D/g, "")}`
              : null;
            return (
              <div key={l.id} className="rounded-2xl border border-white/10 bg-ink-soft/40 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{l.name}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${statusStyles[l.status] ?? "bg-white/10 text-muted"}`}
                      >
                        {l.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted">
                      {l.phone && <span className="mr-3">📞 {l.phone}</span>}
                      {l.email && <span>✉ {l.email}</span>}
                    </p>
                    <p className="mt-2 text-sm">{l.message}</p>
                    <p className="mt-2 text-xs text-muted">
                      {l.createdAt.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2 text-sm">
                    {wa && (
                      <a
                        href={wa}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-300 hover:underline"
                      >
                        WhatsApp
                      </a>
                    )}
                    {l.status !== "CONTACTED" && (
                      <form action={setLeadStatus.bind(null, l.id, "CONTACTED")}>
                        <button className="text-amber-300 hover:underline">
                          Mark contacted
                        </button>
                      </form>
                    )}
                    {l.status !== "DONE" && (
                      <form action={setLeadStatus.bind(null, l.id, "DONE")}>
                        <button className="text-emerald-300 hover:underline">
                          Mark done
                        </button>
                      </form>
                    )}
                    <form action={deleteLead.bind(null, l.id)}>
                      <button className="text-red-300 hover:underline">Delete</button>
                    </form>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
