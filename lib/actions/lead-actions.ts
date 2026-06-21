"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

async function requireAuth() {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
}

export async function setLeadStatus(id: string, status: string) {
  await requireAuth();
  await prisma.lead.update({ where: { id }, data: { status } });
  revalidatePath("/admin/leads");
}

export async function deleteLead(id: string) {
  await requireAuth();
  await prisma.lead.delete({ where: { id } });
  revalidatePath("/admin/leads");
}
