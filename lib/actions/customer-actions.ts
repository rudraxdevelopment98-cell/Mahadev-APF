"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

async function requireAuth() {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
}

function parse(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim() || null,
    email: String(formData.get("email") ?? "").trim() || null,
    gstin: String(formData.get("gstin") ?? "").trim() || null,
    address: String(formData.get("address") ?? "").trim() || null,
    notes: String(formData.get("notes") ?? "").trim() || null,
  };
}

export async function createCustomer(formData: FormData) {
  await requireAuth();
  const data = parse(formData);
  if (!data.name) return;
  await prisma.customer.create({ data });
  revalidatePath("/admin/customers");
}

export async function updateCustomer(id: string, formData: FormData) {
  await requireAuth();
  const data = parse(formData);
  if (!data.name) return;
  await prisma.customer.update({ where: { id }, data });
  revalidatePath("/admin/customers");
  redirect("/admin/customers");
}

export async function deleteCustomer(id: string) {
  await requireAuth();
  // Keep invoices intact; just detach the customer link.
  await prisma.invoice.updateMany({
    where: { customerId: id },
    data: { customerId: null },
  });
  await prisma.customer.delete({ where: { id } });
  revalidatePath("/admin/customers");
}
