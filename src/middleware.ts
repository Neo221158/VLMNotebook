import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * Middleware for optimistic authentication redirects
 *
 * IMPORTANT: This middleware provides optimistic redirects for better UX but does NOT replace
 * server-side authentication checks. All protected pages MUST still use `requireAuth()` from
 * `@/lib/auth-helpers` for actual security validation.
 *
 * Why both middleware and server-side checks?
 * - Middleware: Fast client-side redirect for UX (checks cookie existence only)
 * - Server Components: Actual security validation (validates session authenticity)
 *
 * From Better Auth documentation:
 * "The getSessionCookie function only checks for existence of a session cookie; it does not
 * validate it. Relying solely on this check for security is dangerous, as anyone can manually
 * create a cookie to bypass it. You must always validate the session on your server for any
 * protected actions or pages."
 */
export async function middleware(request: NextRequest) {
  // Define protected routes that require authentication
  const protectedRoutes = ["/dashboard", "/profile", "/chat", "/documents"];

  // Check if current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // Check for session cookie (optimistic check only)
    const sessionCookie = getSessionCookie(request);

    if (!sessionCookie) {
      // No session cookie found - redirect to home page
      const homeUrl = new URL("/", request.url);
      return NextResponse.redirect(homeUrl);
    }
  }

  // Continue to the route (server-side validation will happen in Server Components)
  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  // Match all routes except static files, images, and API routes
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)",
  ],
};
