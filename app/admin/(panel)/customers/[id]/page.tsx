import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { updateCustomer } from "@/lib/actions/customer-actions";

export const dynamic = "force-dynamic";

const inputCls =
  "w-full rounded-lg border border-white/10 bg-ink/60 px-3 py-2 text-sm outline-none focus:border-gold";

export default async function EditCustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = await prisma.customer.findUnique({ where: { id } });
  if (!customer) notFound();

  const save = updateCustomer.bind(null, id);

  return (
    <div className="max-w-lg">
      <Link href="/admin/customers" className="text-sm text-muted hover:text-gold">
        ← Customers
      </Link>
      <h1 className="mb-6 mt-2 font-heading text-3xl font-bold">Edit Customer</h1>

      <form
        action={save}
        className="space-y-3 rounded-2xl border border-white/10 bg-ink-soft/40 p-5"
      >
        <input name="name" defaultValue={customer.name} placeholder="Name *" required className={inputCls} />
        <input name="phone" defaultValue={customer.phone ?? ""} placeholder="Phone" className={inputCls} />
        <input name="email" defaultValue={customer.email ?? ""} placeholder="Email" className={inputCls} />
        <input name="gstin" defaultValue={customer.gstin ?? ""} placeholder="GSTIN" className={inputCls} />
        <textarea name="address" defaultValue={customer.address ?? ""} placeholder="Address" rows={2} className={inputCls} />
        <textarea name="notes" defaultValue={customer.notes ?? ""} placeholder="Notes" rows={2} className={inputCls} />
        <button className="w-full rounded-full bg-gold py-2.5 text-sm font-semibold text-ink hover:bg-gold-soft">
          Save Changes
        </button>
      </form>
    </div>
  );
}
