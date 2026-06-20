import Link from "next/link";
import { prisma } from "@/lib/db";
import { createCustomer, deleteCustomer } from "@/lib/actions/customer-actions";

export const dynamic = "force-dynamic";

const inputCls =
  "w-full rounded-lg border border-white/10 bg-ink/60 px-3 py-2 text-sm outline-none focus:border-gold";

export default async function CustomersPage() {
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { invoices: true } } },
  });

  return (
    <div>
      <h1 className="mb-6 font-heading text-3xl font-bold">Customers</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
        {/* Add form */}
        <form
          action={createCustomer}
          className="h-fit rounded-2xl border border-white/10 bg-ink-soft/40 p-5"
        >
          <h2 className="mb-4 font-heading text-lg font-bold">Add Customer</h2>
          <div className="space-y-3">
            <input name="name" placeholder="Name *" required className={inputCls} />
            <input name="phone" placeholder="Phone" className={inputCls} />
            <input name="email" placeholder="Email" className={inputCls} />
            <input name="gstin" placeholder="GSTIN (optional)" className={inputCls} />
            <textarea name="address" placeholder="Address" rows={2} className={inputCls} />
            <button className="w-full rounded-full bg-gold py-2.5 text-sm font-semibold text-ink hover:bg-gold-soft">
              Add Customer
            </button>
          </div>
        </form>

        {/* List */}
        <div className="overflow-hidden rounded-2xl border border-white/10">
          {customers.length === 0 ? (
            <p className="p-10 text-center text-muted">No customers yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-left text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3 text-center">Invoices</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id} className="border-t border-white/5 hover:bg-white/5">
                    <td className="px-4 py-3">
                      <p className="font-medium">{c.name}</p>
                      {c.gstin && (
                        <p className="text-xs text-muted">GSTIN: {c.gstin}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted">{c.phone ?? "—"}</td>
                    <td className="px-4 py-3 text-center">{c._count.invoices}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-3">
                        <Link
                          href={`/admin/customers/${c.id}`}
                          className="text-gold hover:underline"
                        >
                          Edit
                        </Link>
                        <form action={deleteCustomer.bind(null, c.id)}>
                          <button className="text-red-300 hover:underline">
                            Delete
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
