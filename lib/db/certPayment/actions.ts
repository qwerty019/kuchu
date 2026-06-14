"use server";

import { db } from "@/db";
import { certPayment } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function updateCertPayment(certPaymentId: number, status: string) {
  try {
    await db
      .update(certPayment)
      .set({ status, updatedAt: new Date().toISOString() })
      .where(eq(certPayment.id, certPaymentId));

    return { success: true };
  } catch (err) {
    console.log(err);
    return { message: "Ошибка при обновлении платежа сертификата." };
  }
}
