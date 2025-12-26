import auth from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  // Public routes (no authentication required)
  const publicRoutes = ["/", "/about", "/contact", "/courses"];
  const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];

  // Check if route is public or starts with public prefix
  const isPublicRoute = publicRoutes.some((route) => {
    if (route === "/") return pathname === "/";
    return pathname.startsWith(route);
  });

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // If user is logged in and trying to access auth routes, redirect to dashboard
  if (isLoggedIn && isAuthRoute) {
    const dashboardUrl =
      userRole === "ADMIN"
        ? new URL("/admin/dashboard", req.url)
        : new URL("/learner/dashboard", req.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // Allow access to public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Allow access to auth routes
  if (isAuthRoute) {
    return NextResponse.next();
  }

  // If not logged in and trying to access protected route, redirect to login
  if (!isLoggedIn) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based access control
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute && userRole !== "ADMIN") {
    // Non-admin trying to access admin routes
    return NextResponse.redirect(new URL("/learner/dashboard", req.url));
  }

  // if (isLearnerRoute && userRole === "ADMIN") {
  //   // Admin trying to access learner routes - redirect to admin dashboard
  //   return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  // }

  // Allow access
  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api/auth (NextAuth routes)
     * - api/webhooks (Stripe and other webhooks)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - assets folder
     */
    "/((?!api/auth|api/webhooks|_next/static|_next/image|favicon.ico|assets|public).*)",
  ],
};
