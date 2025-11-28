import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyTokenEdge } from "@/lib/jwt-edge";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't need authentication
  const publicRoutes = ["/", "/login", "/register"];
  const isPublicRoute = publicRoutes.includes(pathname);

  // Dashboard routes that need authentication
  const isDashboardRoute = pathname.startsWith("/dashboard") || 
                          pathname.startsWith("/users") ||
                          pathname.startsWith("/orders") ||
                          pathname.startsWith("/subscriptions") ||
                          pathname.startsWith("/activity") ||
                          pathname.startsWith("/settings");

  // Create response
  const response = NextResponse.next();
  
  // Add pathname to headers for server components
  response.headers.set("x-pathname", pathname);

  // If it's a public route, allow access
  if (isPublicRoute) {
    return response;
  }

  // If it's a dashboard route, check authentication
  if (isDashboardRoute) {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      // No token, redirect to login
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      // Verify token using Edge-compatible function
      await verifyTokenEdge(token);
      // Token is valid, allow access
      return response;
    } catch (error) {
      // Invalid token, redirect to login
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      const redirectResponse = NextResponse.redirect(loginUrl);
      // Clear invalid token
      redirectResponse.cookies.delete("token");
      return redirectResponse;
    }
  }

  // For all other routes, allow access
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes handle their own auth)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

