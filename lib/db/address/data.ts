import { unstable_noStore as noStore } from "next/cache";
import { Address } from "./schema";
import { db } from "@/db";
import { address } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function fetchUserAddresses(userId: string | number) {
  noStore();

  try {
    const addresses = await db
      .select({
        id: address.id,
        zoneId: address.zoneId,
        address: address.address,
        entrance: address.entrance,
        floor: address.floor,
        apartment: address.apartment,
        comment: address.comment,
        selected: address.selected,
        lat: address.lat,
        long: address.long,
      })
      .from(address)
      .where(
        and(eq(address.isDeleted, false), eq(address.userId, Number(userId)))
      );

    return addresses satisfies Address[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Не удалось загрузить список адресов.");
  }
}
