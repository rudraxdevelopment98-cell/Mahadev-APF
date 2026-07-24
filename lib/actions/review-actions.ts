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
  let rating = Number(formData.get("rating")) || 5;
  rating = Math.max(1, Math.min(5, rating));
  return {
    name: String(formData.get("name") ?? "").trim(),
    location: String(formData.get("location") ?? "").trim() || null,
    quote: String(formData.get("quote") ?? "").trim(),
    rating,
    order: Number(formData.get("order")) || 0,
    isActive:
      formData.get("hasActive") != null
        ? formData.get("isActive") === "on"
        : true,
  };
}

function refresh() {
  revalidatePath("/", "layout");
  revalidatePath("/admin/reviews");
}

export async function createReview(formData: FormData) {
  await requireAuth();
  const data = parse(formData);
  if (!data.name || !data.quote) return;
  await prisma.review.create({ data });
  refresh();
}

export async function updateReview(id: string, formData: FormData) {
  await requireAuth();
  const data = parse(formData);
  if (!data.name || !data.quote) return;
  await prisma.review.update({ where: { id }, data });
  refresh();
  redirect("/admin/reviews");
}

export async function deleteReview(id: string) {
  await requireAuth();
  await prisma.review.delete({ where: { id } });
  refresh();
}
