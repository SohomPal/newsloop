import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Skip processing for the onboarding route to prevent infinite loops
  if (url.pathname.startsWith("/onboarding")) {
    return NextResponse.next();
  }

  // Check if the "hasVisitedOnboarding" cookie exists
  const hasVisitedOnboarding = req.cookies.get("hasVisitedOnboarding");

  if (hasVisitedOnboarding === "true") {
    // User has already visited onboarding, allow the request to proceed
    console.log("User has already visited onboarding.");
    return NextResponse.next();
  }

  // Fetch the session to check if the user is new
  const sessionResponse = await fetch(`${url.origin}/api/auth/session`, {
    headers: { Cookie: req.headers.get("cookie") || "" },
  });

  if (!sessionResponse.ok) {
    console.log("No session found. Proceeding without redirection.");
    return NextResponse.next();
  }

  const session = await sessionResponse.json();
  console.log("Session:", session);

  // Check if the user is new
  if (session?.user?.isNewUser) {
    console.log("Redirecting new user to onboarding.");
    const response = NextResponse.redirect(new URL("/onboarding", req.url));

    // Set a cookie to ensure the user is not redirected again
    response.cookies.set("hasVisitedOnboarding", "true", {
      path: "/",            // Make the cookie accessible across the site
      httpOnly: true,       // Ensure the cookie is not accessible via JavaScript
      sameSite: "strict",   // Prevent cross-site cookie leakage
      secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
      maxAge: 60 * 60 * 24 * 365, // Set a long expiry (1 year in seconds)
    });

    return response;
  }

  // Allow the request to proceed for all other cases
  return NextResponse.next();
}

// Apply middleware only to specific routes
export const config = {
  matcher: [
    "/((?!api|auth|_next/static|_next/image|favicon.ico|onboarding).*)", // Exclude static assets, API routes, and onboarding
  ],
};
