import { unstable_noStore as noStore } from "next/cache";
import { DeliveryZone } from "./schema";
import { db } from "@/db";
import { city, deliveryZone } from "@/db/schema";
import { and, eq, inArray } from "drizzle-orm";

export async function fetchZones(cityRoute?: string) {
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

    const zones = await db.query.deliveryZone.findMany({
      where: and(
        eq(deliveryZone.isDeleted, false),
        cityIds ? inArray(deliveryZone.cityId, cityIds) : undefined
      ),
      columns: {
        id: true,
        title: true,
        price: true,
        threshold: true,
        freeDelivery: true,
        polygon: true,
        color: true,
      },
    });

    return zones satisfies DeliveryZone[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Не удалось загрузить список зон доставки.");
  }
}

export async function fetchZone({ id }: { id: number }) {
  noStore();

  try {
    const zone = await db.query.deliveryZone.findFirst({
      where: eq(deliveryZone.id, id),
      columns: {
        id: true,
        title: true,
        price: true,
        threshold: true,
        freeDelivery: true,
        polygon: true,
        color: true,
      },
    });

    if (!zone) return null;

    return zone satisfies DeliveryZone;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Не удалось загрузить зону доставки.");
  }
}
