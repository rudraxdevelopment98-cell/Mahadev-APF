import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { authSecretKey } from "@/lib/auth-secret";
import { sectionForPath, userCan } from "@/lib/permissions";

const COOKIE = "mapf_session";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only guard the admin area; the login page is public.
  const isAdmin = pathname.startsWith("/admin");
  const isLogin = pathname === "/admin/login";
  if (!isAdmin || isLogin) return NextResponse.next();

  const token = req.cookies.get(COOKIE)?.value;
  let payload: Record<string, unknown> | null = null;
  if (token) {
    try {
      payload = (await jwtVerify(token, authSecretKey())).payload as Record<
        string,
        unknown
      >;
    } catch {
      payload = null;
    }
  }

  // Not signed in → login.
  if (!payload) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Signed in → enforce section permissions.
  const section = sectionForPath(pathname);
  if (section) {
    const role = String(payload.role ?? "");
    const perms = Array.isArray(payload.perms) ? payload.perms.map(String) : [];
    if (!userCan(role, perms, section)) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin";
      url.searchParams.set("denied", section);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
