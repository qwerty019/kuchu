import { unstable_noStore as noStore } from "next/cache";
import { CityWithBranchesAndZones } from "./schema";
import { db } from "@/db";
import { and, count, eq } from "drizzle-orm";
import { branch, city, deliveryZone, good, ost } from "@/db/schema";

export async function fetchCitiesWithBranchesAndZones() {
  noStore();

  try {
    // Get cities with branches and zones
    const cities = await db.query.city.findMany({
      where: eq(city.isDeleted, false),
      with: {
        branches: {
          where: eq(branch.isDeleted, false),
        },
        deliveryZones: {
          where: eq(deliveryZone.isDeleted, false),
        },
      },
    });

    // Prepare to collect branch good counts
    const branchIds = cities.flatMap((c) => c.branches.map((b) => b.id));

    // Get ost counts for each branch
    const ostCounts = await Promise.all(
      branchIds.map(async (branchId) => {
        const result = await db
          .select({ count: count() })
          .from(ost)
          .where(and(eq(ost.isDeleted, false), eq(ost.branchId, branchId)));

        return result[0] || { count: 0 };
      })
    );

    // Get good counts for each branch
    const goodCounts = await Promise.all(
      branchIds.map(async (branchId) => {
        const result = await db
          .select({ count: count() })
          .from(good)
          .innerJoin(
            ost,
            and(
              eq(ost.goodId, good.id),
              eq(ost.branchId, branchId),
              eq(ost.isDeleted, false)
            )
          )
          .where(eq(good.isDeleted, false));

        return result[0] || { count: 0 };
      })
    );

    // Transform the data to match the expected output format
    const citiesWithCounts = cities.map((c) => {
      const branches = c.branches.map((b) => {
        const branchIndex = branchIds.indexOf(b.id);
        return {
          ...b,
          goodCount: goodCounts[branchIndex]?.count || 0,
          _count: {
            osts: ostCounts[branchIndex]?.count || 0,
          },
        };
      });

      return {
        ...c,
        branches,
        zones: c.deliveryZones,
      };
    });

    return citiesWithCounts satisfies CityWithBranchesAndZones[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Не удалось загрузить список городов.");
  }
}
