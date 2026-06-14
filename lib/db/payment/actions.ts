import { db } from "@/db";
import { payment as paymentTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { AddPaymentSchema } from "./schema";
import { z } from "zod";

export async function createDbPayment({
  body,
}: {
  body: z.infer<typeof AddPaymentSchema>;
}) {
  const validatedFields = AddPaymentSchema.safeParse(body);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Недостающие поля. Не удалось создать платеж.",
    };
  }

  const { orderId, userId, amount, ykId, status, url, token } =
    validatedFields.data;

  try {
    await db.insert(paymentTable).values({
      userId,
      orderId,
      amount,
      ykId,
      status,
      url,
      token,
      updatedAt: new Date(),
      createdAt: new Date(),
    });

    return { success: true };
  } catch (error) {
    console.log(error);
    return { message: "Ошибка при создании платежа" };
  }
}

export async function updatePayment(id: number, status: string) {
  if (!status) {
    return { message: "Недостающие поля. Не удалось обновить платеж." };
  }

  try {
    await db
      .update(paymentTable)
      .set({ status, updatedAt: new Date() })
      .where(eq(paymentTable.id, id));

    return { success: true };
  } catch (error) {
    return { message: "Ошибка при обновлении платежа." };
  }
}
