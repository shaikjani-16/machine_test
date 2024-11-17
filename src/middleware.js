import { NextResponse } from "next/server";

export function middleware(request) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("token")?.value || "";

  // Redirect unauthenticated users to login for protected routes
  if (!token && path !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect authenticated users away from the login page
  if (token && path === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Allow the request to continue if no conditions are met
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/employee/:path*"], // Match root, login, and all employee-related paths
};
