import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE = "mapf_session";

// Verify the session JWT at the edge (jose only — no Node APIs).
async function isValid(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const s = process.env.AUTH_SECRET;
  if (!s) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(s));
    return true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only guard the admin area; the login page is public.
  const isAdmin = pathname.startsWith("/admin");
  const isLogin = pathname === "/admin/login";
  if (!isAdmin || isLogin) return NextResponse.next();

  const ok = await isValid(req.cookies.get(COOKIE)?.value);
  if (ok) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*"],
};
