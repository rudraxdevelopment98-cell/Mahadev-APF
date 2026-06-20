"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import type { SiteSettings } from "@/lib/settings";

export async function saveSettings(formData: FormData) {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  const get = (k: string) => String(formData.get(k) ?? "").trim();

  const data: SiteSettings = {
    name: get("name"),
    legalName: get("legalName"),
    tagline: get("tagline"),
    intro: get("intro"),
    phone: get("phone"),
    whatsapp: get("whatsapp"),
    email: get("email"),
    address: get("address"),
    gstin: get("gstin"),
    pan: get("pan"),
    invoicePrefix: get("invoicePrefix") || "MAPF",
    bankName: get("bankName"),
    bankAccount: get("bankAccount"),
    bankIfsc: get("bankIfsc"),
    bankHolder: get("bankHolder"),
    terms: [get("term1"), get("term2"), get("term3")].filter(Boolean),
  };

  const json = data as unknown as Prisma.InputJsonObject;
  await prisma.siteSetting.upsert({
    where: { id: 1 },
    update: { data: json },
    create: { id: 1, data: json },
  });

  // Refresh the whole site so the new content shows immediately.
  revalidatePath("/", "layout");
  redirect("/admin/settings?saved=1");
}
