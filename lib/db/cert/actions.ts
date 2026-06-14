"use server";

import { db } from "@/db";
import { cert } from "@/db/schema";
import { validateRequest } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { MailerooClient } from "maileroo";

export async function checkCertCode(
  number: string
): Promise<{ id: number; email: string } | { message: string }> {
  const { user } = await validateRequest();

  if (!user) {
    return { message: "Вы должны быть авторизованы." };
  }

  if (!number) {
    return { message: "Введите номер сертификата." };
  }

  try {
    const found = await db.query.cert.findFirst({
      where: and(
        eq(cert.isDeleted, false),
        eq(cert.number, number),
        eq(cert.isPaid, true),
        eq(cert.status, 5)
      ),
      columns: {
        id: true,
        title: true,
        nominal: true,
        expDate: true,
        email: true,
        number: true,
      },
    });

    if (!found) {
      return { message: "Сертификат не найден." };
    }

    if (new Date() > new Date(found.expDate)) {
      return { message: "Сертификат не найден." };
    }

    const randomCode = Math.floor(1000 + Math.random() * 9000);

    const maileroo = MailerooClient.getClient(process.env.MAILEROO_API_KEY);

    maileroo
      .setFrom("KUCHU", "info@kuchu.shop")
      .setTo(`Получатель`, found.email)
      .setSubject("Подтверждение сертификата")
      .setPlain(`Ваш код подтверждения: ${randomCode}`)
      .setTracking(true);

    await maileroo.sendBasicEmail();

    await db
      .update(cert)
      .set({ code: randomCode.toString() })
      .where(eq(cert.id, found.id));

    return { id: found.id, email: found.email };
  } catch (error) {
    console.log(error);
    return { message: "Ошибка при проверке сертификата. Повторите еще." };
  }
}

export async function validateCertCode(id: number, code: string) {
  if (!code) {
    return { message: "Введите код подтверждения." };
  }

  const { user } = await validateRequest();

  if (!user) {
    return { message: "Вы должны быть авторизованы." };
  }

  try {
    const found = await db.query.cert.findFirst({
      where: and(
        eq(cert.isDeleted, false),
        eq(cert.code, code),
        eq(cert.id, id),
        eq(cert.isPaid, true)
      ),
      columns: {
        id: true,
        title: true,
        nominal: true,
        expDate: true,
        email: true,
        number: true,
      },
    });

    if (!found) {
      return { message: "Сертификат не найден." };
    }

    return found;
  } catch (error) {
    console.log(error);
    return { message: "Ошибка при проверке сертификата. Повторите еще." };
  }
}

export async function updateCert(id: number) {
  try {
    await db
      .update(cert)
      .set({ status: 5, isPaid: true, updatedAt: new Date().toISOString() })
      .where(eq(cert.id, id));

    return { success: true };
  } catch (err) {
    console.log(err);
    return { message: "Ошибка при обновлении сертификата." };
  }
}
