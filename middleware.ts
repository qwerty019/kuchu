import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const sessionToken = request.cookies.get("session")?.value ?? null;

  if (sessionToken !== null) {
    // Re-set the cookie with updated expiration
    response.cookies.set({
      name: "session",
      value: sessionToken,
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
  }

  return response;
}
