import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAdmin } from "./lib/auth"; // Adjust this path to your utility file

export async function proxy(request: NextRequest) {
  // Only protect routes starting with /admin
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const { authenticated } = await verifyAdmin(request);

    if (!authenticated) {
      // If not authenticated, redirect to login or return 401
      // For API routes:
      if (request.nextUrl.pathname.startsWith("/api/")) {
        return NextResponse.json(
          { message: "Authentication required" },
          { status: 401 }
        );
      }

      // For Page routes:
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Optimization: Only run middleware on specific paths
export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
