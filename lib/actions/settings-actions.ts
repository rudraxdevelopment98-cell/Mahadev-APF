"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { put } from "@vercel/blob";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { getTenantId } from "@/lib/tenant";
import { getSettings } from "@/lib/settings-server";
import { assertFeature } from "@/lib/entitlements";
import { getTheme } from "@/lib/themes";
import { normalizeSections, sectionDef, isAlwaysOn, sectionFeature } from "@/lib/sections";
import type { SiteSettings } from "@/lib/settings";

export async function saveSettings(formData: FormData) {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  const get = (k: string) => String(formData.get(k) ?? "").trim();

  // Upload an optional image field to Blob; keep the current URL if none/failed.
  async function uploadImage(field: string, prefix: string, current: string) {
    const f = formData.get(field);
    if (f instanceof File && f.size > 0) {
      try {
        const safe = f.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const blob = await put(`${prefix}/${Date.now()}-${safe}`, f, {
          access: "public",
        });
        return blob.url;
      } catch {
        return current;
      }
    }
    return current;
  }

  const logoUrl = await uploadImage("logo", "logo", get("logoUrl"));
  const aboutImageUrl = await uploadImage("aboutImage", "about", get("aboutImageUrl"));

  // The big content form doesn't edit appearance — keep theme + sections.
  const current = await getSettings();

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
    aboutImageUrl,
    theme: current.theme,
    sections: current.sections,
  };

  const json = data as unknown as Prisma.InputJsonObject;
  const tenantId = await getTenantId();
  await prisma.siteSetting.upsert({
    where: { tenantId },
    update: { data: json },
    create: { tenantId, data: json },
  });

  // Refresh the whole site so the new content shows immediately.
  revalidatePath("/", "layout");
  redirect("/admin/settings?saved=1");
}

/** Change the business's site theme (Appearance). A website-plan feature. */
export async function setSiteTheme(formData: FormData) {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
  await assertFeature("website");

  const themeId = getTheme(String(formData.get("theme") ?? "")).id;
  const current = await getSettings();
  const data = { ...current, theme: themeId } as unknown as Prisma.InputJsonObject;
  const tenantId = await getTenantId();
  await prisma.siteSetting.upsert({
    where: { tenantId },
    update: { data },
    create: { tenantId, data },
  });

  revalidatePath("/", "layout");
  redirect("/admin/appearance?saved=1");
}

/** Persist a new ordered list of enabled homepage sections. */
async function saveSectionsList(list: string[]) {
  const current = await getSettings();
  const data = { ...current, sections: normalizeSections(list) } as unknown as Prisma.InputJsonObject;
  const tenantId = await getTenantId();
  await prisma.siteSetting.upsert({
    where: { tenantId },
    update: { data },
    create: { tenantId, data },
  });
  revalidatePath("/", "layout");
}

/** Turn a homepage section on/off (always-on sections can't be turned off). */
export async function toggleSection(formData: FormData) {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
  await assertFeature("website");

  const key = String(formData.get("key") ?? "");
  if (!sectionDef(key) || isAlwaysOn(key)) return;

  const cur = normalizeSections((await getSettings()).sections);
  const turningOn = !cur.includes(key);
  // Enabling a premium section requires its plan feature.
  const feature = sectionFeature(key);
  if (turningOn && feature) await assertFeature(feature);

  const next = turningOn ? [...cur, key] : cur.filter((k) => k !== key);
  await saveSectionsList(next);
}

/** Move a homepage section up or down in the order. */
export async function moveSection(formData: FormData) {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
  await assertFeature("website");

  const key = String(formData.get("key") ?? "");
  const dir = String(formData.get("dir") ?? "");
  const cur = normalizeSections((await getSettings()).sections);
  const i = cur.indexOf(key);
  const j = dir === "up" ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= cur.length) return;

  const next = [...cur];
  [next[i], next[j]] = [next[j], next[i]];
  await saveSectionsList(next);
}
