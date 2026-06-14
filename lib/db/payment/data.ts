"use server";

import { db } from "@/db";
import { payment } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { Payment } from "./schema";

export async function getPayment({ ykId }: { ykId: string }) {
  try {
    const found = await db.query.payment.findFirst({
      where: and(eq(payment.isDeleted, false), eq(payment.ykId, ykId)),
      columns: {
        id: true,
        orderId: true,
        userId: true,
        status: true,
        ykId: true,
        url: true,
        token: true,
      },
    });

    if (!found) return null;

    return found satisfies Payment;
  } catch (err) {
    console.log(err);
    throw new Error("Ошибка при загрузке платежа.");
  }
}
