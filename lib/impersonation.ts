import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { authSecretKey } from "./auth-secret";

/**
 * Super-admin impersonation. When a RudrOne platform admin "opens" a business
 * from the control room, we set a short-lived signed cookie naming that tenant.
 * getCurrentTenant honours it (before host resolution), so the admin can view
 * and set up any business — and preview its public site — on the current URL,
 * with no subdomain/DNS needed. Only a super-admin action can mint the cookie
 * (it's signed with the auth secret), so it can't be forged.
 */

const COOKIE = "rudrone_imp";
const ALG = "HS256";

export async function setImpersonation(tenantId: string): Promise<void> {
  const token = await new SignJWT({ t: tenantId })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(authSecretKey());
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 2,
  });
}

export async function clearImpersonation(): Promise<void> {
  (await cookies()).delete(COOKIE);
}

/** The impersonated tenant id from a valid cookie, or null. */
export async function getImpersonatedTenantId(): Promise<string | null> {
  try {
    const token = (await cookies()).get(COOKIE)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, authSecretKey());
    return typeof payload.t === "string" ? payload.t : null;
  } catch {
    return null;
  }
}
