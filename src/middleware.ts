import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!req.auth;
  const isAdmin = req.auth?.user?.role === "admin";
  const isPremium = req.auth?.user?.subscriptionTier === "premium" || isAdmin;

  if (pathname.startsWith("/admin") && !isAuthenticated) {
    const callbackUrl = encodeURIComponent(pathname);
    return NextResponse.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, req.url));
  }

  if (pathname.startsWith("/admin") && !isAdmin) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (pathname.startsWith("/dashboard") && !isAuthenticated) {
    const callbackUrl = encodeURIComponent(pathname);
    return NextResponse.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, req.url));
  }

  const needsAuth = pathname.startsWith("/dashboard");

  if (needsAuth && !isAuthenticated) {
    const callbackUrl = encodeURIComponent(pathname);
    return NextResponse.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, req.url));
  }

  const premiumRoutes = ["/flashcards", "/simulation"];
  const needsPremium = premiumRoutes.some((route) => pathname.startsWith(route));

  if (needsPremium && !isAuthenticated) {
    const callbackUrl = encodeURIComponent(pathname);
    return NextResponse.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, req.url));
  }

  if (needsPremium && !isPremium) {
    return NextResponse.redirect(new URL("/upgrade", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/flashcards/:path*", "/simulation/:path*"],
};
