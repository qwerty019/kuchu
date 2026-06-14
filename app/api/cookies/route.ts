export const dynamic = "force-dynamic";

import { cookies } from "next/headers";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, value } = body;

  if (!name || !value) {
    return Response.json(
      { error: "Name and value are required" },
      { status: 400 }
    );
  }

  cookies().set(name, value, {
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    httpOnly: false,
  });

  return Response.json({ success: true }, { status: 200 });
}
