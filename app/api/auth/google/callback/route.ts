import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAllowedAdmin } from "@/lib/auth-google";
import { createSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { parsePerms } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const loginErr = (code: string) =>
    NextResponse.redirect(new URL(`/admin/login?error=${code}`, url.origin));

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const jar = await cookies();
  const savedState = jar.get("g_oauth_state")?.value;
  jar.delete("g_oauth_state");

  if (!code || !state || !savedState || state !== savedState) {
    return loginErr("google_failed");
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) return loginErr("google_not_configured");

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: `${url.origin}/api/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });
    const tokens = await tokenRes.json();
    if (!tokens.access_token) return loginErr("google_failed");

    const profileRes = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      { headers: { Authorization: `Bearer ${tokens.access_token}` } },
    );
    const profile = await profileRes.json();
    const email = String(profile.email ?? "").toLowerCase();
    if (!profile.verified_email) return loginErr("not_allowed");

    // Access is granted by the User table. The built-in owner emails are
    // bootstrapped as OWNERs on first sign-in so they can never be locked out.
    let dbUser = await prisma.user.findUnique({ where: { email } }).catch(() => null);

    if (!dbUser && isAllowedAdmin(email)) {
      dbUser = await prisma.user
        .create({
          data: {
            email,
            name: String(profile.name ?? email.split("@")[0]),
            role: "OWNER",
            permissions: "",
            isActive: true,
            passwordHash: "",
          },
        })
        .catch(() => null);
    }

    if (!dbUser || !dbUser.isActive) return loginErr("not_allowed");

    await createSession({
      id: dbUser.id,
      name: dbUser.name || String(profile.name ?? email.split("@")[0]),
      email,
      role: dbUser.role,
      perms: parsePerms(dbUser.permissions),
    });

    return NextResponse.redirect(new URL("/admin", url.origin));
  } catch {
    return loginErr("google_failed");
  }
}
