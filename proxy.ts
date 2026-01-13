import auth from "@/auth";
import { NextResponse } from "next/server";

// Simple in-memory rate limiter using a Map
// Note: In a distributed environment (e.g., Vercel, AWS Lambda), this Map will be specific 
// to each running instance. For strictly enforced global limits, use Redis (e.g., Upstash).
const rateLimit = new Map<string, { count: number; lastReset: number }>();

// Rate limit usage helper
function checkRateLimit(ip: string, limit: number, windowMs: number) {
  const now = Date.now();
  const record = rateLimit.get(ip);

  if (!record) {
    rateLimit.set(ip, { count: 1, lastReset: now });
    return { success: true, count: 1 };
  }

  if (now - record.lastReset > windowMs) {
    // Reset window
    record.count = 1;
    record.lastReset = now;
    return { success: true, count: 1 };
  }

  if (record.count >= limit) {
    return { success: false, count: record.count };
  }

  record.count += 1;
  return { success: true, count: record.count };
}

// Cleanup old entries every 5 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimit.entries()) {
    if (now - value.lastReset > 60000 * 5) { // 5 minutes
      rateLimit.delete(key);
    }
  }
}, 60000 * 5);

export const proxy = auth((req) => {
  const { pathname } = req.nextUrl;
  const ip = req.headers.get("x-forwarded-for") || "unknown";

  // --- Rate Limiting Logic ---

  // 1. Strict Limiting for Auth Processing (Login/Signup/Verify)
  // Limit: 20 reqs / 60 sec
  if (pathname.startsWith("/api/auth") || pathname.startsWith("/api/verify")) {
    const status = checkRateLimit(`auth:${ip}`, 20, 60 * 1000);
    if (!status.success) {
      return new NextResponse(
        JSON.stringify({ error: "Too many login attempts. Please try again later." }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  // 2. Strict Limiting for Checkout/Payments (Card Testing Protection)
  // Limit: 10 reqs / 60 sec
  if (pathname.startsWith("/api/checkout")) {
    const status = checkRateLimit(`checkout:${ip}`, 10, 60 * 1000);
    if (!status.success) {
      return new NextResponse(
        JSON.stringify({ error: "Too many checkout attempts. Please wait a moment." }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  // 3. Moderate Limiting for General API
  // Limit: 100 reqs / 60 sec
  if (pathname.startsWith("/api")) {
    const status = checkRateLimit(`api:${ip}`, 100, 60 * 1000);
    if (!status.success) {
      return new NextResponse(
        JSON.stringify({ error: "Rate limit exceeded." }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  // --- End Rate Limiting Logic ---

  // Allow all API routes to proceed without page-level redirects
  // (API authentication is handled by the route handlers themselves)
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  // Public routes (no authentication required)
  const publicRoutes = ["/", "/about", "/contact", "/courses", "/book-a-call", "/cart", "/blog"];
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

  // Allow access
  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api/webhooks (Stripe and other webhooks)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images folder (public assets)
     * - assets folder (public assets)
     * - Any files with common extensions (images, fonts, etc.)
     *
     * Note: Included "api/auth" in matching so we can rate limit it
     */
    "/((?!api/webhooks|_next/static|_next/image|favicon.ico|images|assets|.*\\.(?:jpg|jpeg|png|gif|svg|ico|webp|pdf|woff|woff2|ttf|eot|otf|css|js)).*)",
  ],
};
