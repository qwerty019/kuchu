"use server";

import { validateRequest } from "./auth";
import { redirect } from "next/navigation";

export async function isAdmin(callbackUrl: string) {
  const { user } = await validateRequest();

  if (!user) redirect(`/login?callbackUrl=${callbackUrl}`);

  if (!user.roles || !user.roles.includes("admin")) redirect("/");
}
