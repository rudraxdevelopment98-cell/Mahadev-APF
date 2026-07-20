"use server";

import { provisionTenant } from "@/lib/tenant-provision";
import { PLATFORM } from "@/lib/platform";

export type SignupState = {
  error?: string;
  field?: string;
  ok?: boolean;
  slug?: string;
  loginUrl?: string;
};

/** Public sign-up: create a new business on RudrOne and its owner account. */
export async function signUp(_prev: SignupState, formData: FormData): Promise<SignupState> {
  const result = await provisionTenant({
    businessName: String(formData.get("businessName") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    ownerName: String(formData.get("ownerName") ?? ""),
    ownerEmail: String(formData.get("ownerEmail") ?? ""),
    password: String(formData.get("password") ?? ""),
  });

  if (!result.ok) return { error: result.error, field: result.field };

  return {
    ok: true,
    slug: result.slug,
    loginUrl: `https://${PLATFORM.clientHost(result.slug)}/admin/login`,
  };
}
