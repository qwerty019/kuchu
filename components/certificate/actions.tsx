"use server";

import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { validateRequest } from "@/lib/auth";
import { getCertificates } from "@/lib/farmbazis/data";
import { db } from "@/db";
import {
  branch,
  certBranch,
  certPayment,
  cert as certTable,
} from "@/db/schema";
import { and, eq } from "drizzle-orm";

const formSchema = z.object({
  email: z.string().email().trim().toLowerCase().min(1).max(255),
  expDate: z.string().trim().min(1).max(255),
  nominal: z.number().int().positive(),
});

export async function addCert(body: unknown) {
  const validatedFields = formSchema.safeParse(body);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, expDate, nominal } = validatedFields.data;

  const { user } = await validateRequest();

  if (!user) {
    return { message: "Войдите в ваш аккаунт и сделайте заказ." };
  }

  try {
    const certs = await getCertificates();
    const cert_numbers = certs.map((cert) => cert.cert_number);

    const next_cert = getNumber(cert_numbers);

    await db
      .update(certTable)
      .set({ isDeleted: true, updatedAt: new Date().toISOString() })
      .where(and(eq(certTable.number, next_cert), eq(certTable.status, 0)));

    if (!user.phone) {
      return { message: "У вас нет номера телефона." };
    }

    const payment = await createPayment(nominal, user.phone, next_cert);

    const branches = await db.query.branch.findMany({
      where: eq(branch.isDeleted, false),
      columns: { id: true },
    });

    await db.transaction(async (tx) => {
      const [created] = await tx
        .insert(certTable)
        .values({
          userId: Number(user.id),
          title: `Сертификат из сайта ${user.phone}`,
          status: 0,
          nominal,
          number: next_cert,
          expDate: new Date(expDate).toISOString(),
          email,
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        })
        .returning();

      await tx.insert(certBranch).values(
        branches.map((b) => ({
          certId: created.id,
          branchId: b.id,
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        }))
      );

      await tx.insert(certPayment).values({
        certId: created.id,
        amount: nominal,
        ykId: payment.id,
        status: payment.status,
        url: payment.confirmation.confirmation_url,
        token: payment.confirmation.confirmation_token,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      });
    });

    const cert = await db.query.cert.findFirst({
      where: and(
        eq(certTable.isDeleted, false),
        eq(certTable.userId, Number(user.id)),
        eq(certTable.number, next_cert)
      ),
      columns: { id: true },
    });

    if (!cert) {
      return { message: "Ошибка при покупке сертификата. Повторите еще." };
    }

    return {
      token: payment.confirmation.confirmation_token,
      certId: cert.id,
    };
  } catch (error) {
    console.log(error);
    return { message: "Ошибка при покупке сертификата. Повторите еще." };
  }
}

export async function createPayment(
  value: number,
  phone: string,
  certId: string
) {
  const endpoint = "https://api.yookassa.ru/v3/payments";

  const body = {
    amount: {
      value: value,
      currency: "RUB",
    },
    capture: true,
    confirmation: {
      type: "embedded",
      // return_url: `http://localhost:3000/thanks?orderId=${orderId}`,
    },
    description: `Подарочный сертификат с номиналом ${value} руб.`,
    merchant_customer_id: phone,
    metadata: {
      certId: certId,
    },
  };

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(
          process.env.YOOKASSA_SHOP_ID + ":" + process.env.YOOKASSA_API_KEY
        ).toString("base64")}`,
        "Content-Type": "application/json",
        "Idempotence-Key": uuidv4(),
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      console.log(await res.json());
      throw new Error("Ошибка при создании платежа.");
    }

    const data = await res.json();

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

function getNumber(numbers: string[]) {
  // Sort numbers in ascending order
  const sortedNumbers = numbers
    .filter((num) => /^\d{6}$/.test(num)) // Filter valid 6-digit numbers
    .sort((a, b) => parseInt(a) - parseInt(b));

  if (sortedNumbers.length === 0) {
    return "000001"; // Return initial number if array is empty
  }

  if (!sortedNumbers.includes("000001")) {
    return "000001";
  }

  // Find first gap in sequence
  for (let i = 0; i < sortedNumbers.length - 1; i++) {
    const current = parseInt(sortedNumbers[i]);
    const next = parseInt(sortedNumbers[i + 1]);

    if (next - current > 1) {
      // Gap found, return first missing number
      return (current + 1).toString().padStart(6, "0");
    }
  }

  // No gaps found, return next number after last
  const lastNumber = parseInt(sortedNumbers[sortedNumbers.length - 1]);
  return (lastNumber + 1).toString().padStart(6, "0");
}
