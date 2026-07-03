// middleware.ts

import { NextResponse, type NextRequest } from "next/server";

const protectedRoutes = [
  "/discover",
  "/search",
  "/categories",
  "/my-vault",
  "/games",
  "/profile",
];

const authRoutes = ["/login", "/signup", "/forgot-password"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionCookie =
    request.cookies.get("better-auth.session_token") ||
    request.cookies.get("__Secure-better-auth.session_token");

  const isLoggedIn = Boolean(sessionCookie);

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);

    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/discover", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/discover/:path*",
    "/search/:path*",
    "/categories/:path*",
    "/my-vault/:path*",
    "/games/:path*",
    "/profile/:path*",
    "/login",
    "/signup",
    "/forgot-password",
  ],
};