"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { put } from "@vercel/blob";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import type { SiteSettings } from "@/lib/settings";

export async function saveSettings(formData: FormData) {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  const get = (k: string) => String(formData.get(k) ?? "").trim();

  // Logo: upload a new file to Blob if provided, else keep the existing URL.
  let logoUrl = get("logoUrl");
  const logo = formData.get("logo");
  if (logo instanceof File && logo.size > 0) {
    try {
      const safe = logo.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const blob = await put(`logo/${Date.now()}-${safe}`, logo, { access: "public" });
      logoUrl = blob.url;
    } catch {
      // keep existing logo on failure
    }
  }

  const num = (k: string) => Number(formData.get(k)) || 0;
  const stats = [0, 1, 2, 3].map((i) => ({
    value: num(`stat${i}value`),
    suffix: get(`stat${i}suffix`),
    label: get(`stat${i}label`),
  })).filter((s) => s.label);

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
    heroBadge: get("heroBadge"),
    heroLine1: get("heroLine1"),
    heroLine2: get("heroLine2"),
    heroLine3: get("heroLine3"),
    heroIntro: get("heroIntro"),
    aboutHeading: get("aboutHeading"),
    aboutHeadingGold: get("aboutHeadingGold"),
    aboutPara1: get("aboutPara1"),
    aboutPara2: get("aboutPara2"),
    stats,
    logoUrl,
    googleReviewUrl: get("googleReviewUrl"),
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
