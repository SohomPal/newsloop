import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Skip processing for the onboarding route to prevent infinite loops
  if (url.pathname.startsWith("/onboarding")) {
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
    return NextResponse.redirect(new URL("/onboarding", req.url));
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
