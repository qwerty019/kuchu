"use server";

import { unstable_noStore as noStore } from "next/cache";
import { Branch, BranchWithCity } from "./schema";
import { db } from "@/db";
import { and, eq, inArray } from "drizzle-orm";
import { branch, city } from "@/db/schema";

export async function fetchBranches(cityRoute?: string) {
  noStore();

  try {
    // First, if we have a cityRoute, find the matching city IDs
    let cityIds: number[] | undefined;

    if (cityRoute) {
      const cities = await db.query.city.findMany({
        where: and(eq(city.route, cityRoute), eq(city.isDeleted, false)),
        columns: {
          id: true,
        },
      });

      cityIds = cities.map((c) => c.id);

      // If no matching cities found, return empty array
      if (cityIds.length === 0) {
        return [];
      }
    }

    // Then use cityIds to filter branches
    const branches = await db.query.branch.findMany({
      where: and(
        eq(branch.isDeleted, false),
        cityIds ? inArray(branch.cityId, cityIds) : undefined
      ),
      columns: {
        id: true,
        title: true,
        address: true,
        fbId: true,
        main: true,
        lat: true,
        long: true,
      },
      with: {
        city: {
          columns: {
            id: true,
            title: true,
          },
        },
      },
    });

    return branches satisfies BranchWithCity[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Не удалось загрузить список филиалов.");
  }
}

export async function fetchBranchInEdit(id: number) {
  noStore();

  try {
    const branchData = await db.query.branch.findFirst({
      where: and(eq(branch.id, id), eq(branch.isDeleted, false)),
      columns: {
        id: true,
        title: true,
        address: true,
        fbId: true,
        main: true,
        lat: true,
        long: true,
      },
    });

    if (!branchData) {
      throw new Error("Филиал не найден");
    }

    return branchData satisfies Branch;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Не удалось загрузить данные филиала.");
  }
}
