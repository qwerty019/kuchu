"use server";

import { fetchBranches } from "./db/branch/data";
import { cookies } from "next/headers";
import { BranchWithCity } from "./db/branch/schema";

export async function getMethodAndBranch(cityRoute?: string): Promise<{
  method: string | null;
  branch: string | null;
  branches: BranchWithCity[];
}> {
  let method: string | null = null;
  let branch: string | null = null;

  try {
    const branches = await fetchBranches(cityRoute);

    const mainBranch = branches.find((b) => b.main);

    if (!mainBranch) return { method, branch, branches };

    method = cookies().get("method")?.value || null;
    branch = cookies().get("branch")?.value || null;

    if (method !== "delivery" && method !== "pickup") {
      method = null;
    }

    if (!branches.find((b) => b.id === Number(branch))) {
      branch = mainBranch.id.toString();
    }

    if (!method || method === "delivery") {
      branch = mainBranch.id.toString();
    }

    return { method, branch, branches };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Не удалось загрузить список филиалов.");
  }
}

export async function getBalance() {
  const endpoint = "https://zvonok.com";
  const pathname = "/manager/cabapi_external/api/v1/users/balance/";

  const searchParams = new URLSearchParams({
    public_key: process.env.ZVONOK_API!,
  });
  try {
    const res = await fetch(`${endpoint}${pathname}?${searchParams}`);
    if (!res.ok) {
      return { message: "Ошибка при запросе баланса." };
    }

    const data: { balance: number } = await res.json();

    return data;
  } catch (error) {
    console.log(error);
    return { message: "Ошибка при запросе баланса." };
  }
}
