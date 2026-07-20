import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { prisma } from "./db";
import { authSecretKey } from "./auth-secret";

const COOKIE = "mapf_session";
const ALG = "HS256";

function secret(): Uint8Array {
  return authSecretKey();
}

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  perms: string[];
};

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

/**
 * Validate credentials against a specific tenant and, on success, return the
 * user. Scoping by tenant means a user can only sign in on their own
 * business's site, even though emails are unique platform-wide.
 */
export async function verifyCredentials(
  email: string,
  password: string,
  tenantId: string,
): Promise<SessionUser | null> {
  const user = await prisma.user.findFirst({
    where: { email: email.toLowerCase().trim(), tenantId, isActive: true },
  });
  if (!user || !user.passwordHash) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    perms: user.permissions
      ? user.permissions.split(",").map((s) => s.trim()).filter(Boolean)
      : [],
  };
}

export async function createSession(user: SessionUser): Promise<void> {
  const token = await new SignJWT({
    name: user.name,
    email: user.email,
    role: user.role,
    perms: user.perms ?? [],
  })
    .setProtectedHeader({ alg: ALG })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());

  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE);
}

/** Read the current session from the cookie, or null if signed out / invalid. */
export async function getSessionUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return {
      id: String(payload.sub),
      name: String(payload.name ?? ""),
      email: String(payload.email ?? ""),
      role: String(payload.role ?? "STAFF"),
      perms: Array.isArray(payload.perms) ? payload.perms.map(String) : [],
    };
  } catch {
    return null;
  }
}

export const SESSION_COOKIE = COOKIE;
