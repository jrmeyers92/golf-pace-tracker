// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/courses(.*)",
  "/course/(.*)",
]);

// Define protected API routes
const isProtectedApiRoute = createRouteMatcher([
  "/api/protected(.*)",
  "/api/submit(.*)", // Add your submit round endpoint
  // Add other protected API routes
]);

// Public API routes (no auth needed)
const isPublicApiRoute = createRouteMatcher([
  "/api/webhooks(.*)",
  "/api/courses(.*)", // If you want public course data access
]);

export default clerkMiddleware(async (auth, req) => {
  const path = req.nextUrl.pathname;

  // Allow public API routes without auth check
  if (isPublicApiRoute(req)) {
    return NextResponse.next();
  }

  // Protect specific API routes
  if (isProtectedApiRoute(req)) {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  // Allow all other API routes (adjust based on your needs)
  if (path.startsWith("/api")) {
    return NextResponse.next();
  }

  // Allow public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // For protected routes, require authentication
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
