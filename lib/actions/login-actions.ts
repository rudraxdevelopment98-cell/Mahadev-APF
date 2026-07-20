"use server";

import { redirect } from "next/navigation";
import { verifyCredentials, createSession } from "@/lib/auth";
import { getTenantId } from "@/lib/tenant";

export type LoginState = { error?: string };

/** Email + password sign-in, scoped to the tenant of the current host. */
export async function signInWithPassword(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };

  const tenantId = await getTenantId();
  const user = await verifyCredentials(email, password, tenantId);
  if (!user) return { error: "Wrong email or password." };

  await createSession(user);
  redirect("/admin");
}
