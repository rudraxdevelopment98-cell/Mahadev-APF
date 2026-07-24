import { prisma } from "@/lib/db";
import { createMaterial, deleteMaterial } from "@/lib/actions/material-actions";
import { categoryLabels, units, type ServiceCategory } from "@/lib/shop";
import { formatINR } from "@/lib/money";

export const dynamic = "force-dynamic";

const inputCls =
  "w-full rounded-lg border border-white/10 bg-ink/60 px-3 py-2 text-sm outline-none focus:border-gold";

export default async function MaterialsPage() {
  const materials = await prisma.material.findMany({
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  return (
    <div>
      <h1 className="mb-1 font-heading text-3xl font-bold">Rate List</h1>
      <p className="mb-6 text-sm text-muted">
        Materials and work items with default rates, used to build invoices fast.
      </p>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_2fr]">
        {/* Add form */}
        <form
          action={createMaterial}
          className="h-fit rounded-2xl border border-white/10 bg-ink-soft/40 p-5"
        >
          <h2 className="mb-4 font-heading text-lg font-bold">Add Item</h2>
          <div className="space-y-3">
            <input name="name" placeholder="Item / work name *" required className={inputCls} />
            <div className="grid grid-cols-2 gap-3">
              <select name="category" className={inputCls} defaultValue="ALUMINIUM">
                {(Object.keys(categoryLabels) as ServiceCategory[]).map((c) => (
                  <option key={c} value={c}>
                    {categoryLabels[c]}
                  </option>
                ))}
              </select>
              <select name="kind" className={inputCls} defaultValue="WORK">
                <option value="MATERIAL">Material</option>
                <option value="WORK">Work / Labour</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <select name="unit" className={inputCls} defaultValue="sqft">
                {units.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
              <input name="hsn" placeholder="HSN/SAC" className={inputCls} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input name="rate" type="number" step="0.01" placeholder="Rate ₹" className={inputCls} />
              <input name="taxRate" type="number" step="0.01" defaultValue="18" placeholder="GST %" className={inputCls} />
            </div>
            <button className="w-full rounded-full bg-gold py-2.5 text-sm font-semibold text-ink hover:bg-gold-soft">
              Add to Rate List
            </button>
          </div>
        </form>

        {/* List */}
        <div className="overflow-hidden rounded-2xl border border-white/10">
          {materials.length === 0 ? (
            <p className="p-10 text-center text-muted">No items yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-left text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-4 py-3">Item</th>
                  <th className="px-4 py-3">Unit</th>
                  <th className="px-4 py-3 text-right">Rate</th>
                  <th className="px-4 py-3 text-center">GST</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {materials.map((m) => (
                  <tr key={m.id} className="border-t border-white/5 hover:bg-white/5">
                    <td className="px-4 py-3">
                      <p className="font-medium">{m.name}</p>
                      <p className="text-xs text-muted">
                        {categoryLabels[m.category as ServiceCategory] ?? m.category}
                        {" · "}
                        {m.kind === "WORK" ? "Work" : "Material"}
                        {m.hsn ? ` · HSN ${m.hsn}` : ""}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-muted">{m.unit}</td>
                    <td className="px-4 py-3 text-right">{formatINR(m.rate)}</td>
                    <td className="px-4 py-3 text-center text-muted">{m.taxRate}%</td>
                    <td className="px-4 py-3 text-right">
                      <form action={deleteMaterial.bind(null, m.id)}>
                        <button className="text-red-300 hover:underline">Delete</button>
                      </form>
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
