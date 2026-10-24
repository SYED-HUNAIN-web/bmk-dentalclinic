import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const ADMIN_DEPARTED_COOKIE = "bmk_admin_departed";
export const ADMIN_ACTIVE_COOKIE = "bmk_admin_last_active";
export const ADMIN_IN_AREA_COOKIE = "bmk_admin_in_area";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Static assets and internal routes are bypassed
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/media") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname === "/icon.jpeg"
  ) {
    return NextResponse.next();
  }

  const hasActiveSession = Boolean(
    request.cookies.get(ADMIN_ACTIVE_COOKIE)?.value ||
    request.cookies.get(ADMIN_IN_AREA_COOKIE)?.value
  );

  const hasDepartedFlag = Boolean(
    request.cookies.get(ADMIN_DEPARTED_COOKIE)?.value
  );

  // 1. PUBLIC WEBSITE ROUTES: Detect departure from admin area
  if (!pathname.startsWith("/admin")) {
    if (hasActiveSession) {
      // Administrator left the admin area for the public website.
      // Terminate the active admin marker and set departed flag.
      const response = NextResponse.next();
      response.cookies.set(ADMIN_DEPARTED_COOKIE, "1", {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 3600, // 1 hour
      });
      response.cookies.delete(ADMIN_IN_AREA_COOKIE);
      response.cookies.delete(ADMIN_ACTIVE_COOKIE);
      return response;
    }
    return NextResponse.next();
  }

  // 2. ADMIN LOGIN & RECOVERY ROUTES
  if (
    pathname === "/admin/login" ||
    pathname === "/admin/forgot-password" ||
    pathname === "/admin/reset-password"
  ) {
    return NextResponse.next();
  }

  // 3. PROTECTED ADMIN ROUTES (/admin, /admin/...)
  // Check if administrator previously departed to the public website
  if (hasDepartedFlag) {
    const loginUrl = new URL("/admin/login?reason=departed", request.url);
    const response = NextResponse.redirect(loginUrl);
    // Clear departed flag so next fresh login is not blocked
    response.cookies.delete(ADMIN_DEPARTED_COOKIE);
    response.cookies.delete(ADMIN_IN_AREA_COOKIE);
    response.cookies.delete(ADMIN_ACTIVE_COOKIE);
    return response;
  }

  // If no active session timestamp exists, redirect to login
  if (!hasActiveSession) {
    const loginUrl = new URL("/admin/login", request.url);
    const response = NextResponse.redirect(loginUrl);
    return response;
  }

  // Administrator is legitimately inside the admin area
  const response = NextResponse.next();
  response.cookies.set(ADMIN_IN_AREA_COOKIE, "1", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
  });
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files
     */
    "/((?!_next/static|_next/image|favicon.ico|icon.jpeg|media/).*)",
  ],
};
