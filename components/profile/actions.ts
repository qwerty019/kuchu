"use server";

import { callToNumber } from "@/lib/actions";
import { invalidateSession, validateRequest } from "@/lib/auth";
import { updateCard } from "@/lib/db/discountcard/actions";
import {
  createDiscountCard,
  updateDiscountCard,
} from "@/lib/farmbazis/actions";
import { getDiscountCards } from "@/lib/farmbazis/data";
import { generateEAN13 } from "@/lib/utils";
import { deleteSessionTokenCookie } from "../login/actions";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import {
  user as userTable,
  call as callTable,
  discountCard,
} from "@/db/schema";

export async function changeName(name: string) {
  const { user } = await validateRequest();

  if (!user) {
    return { message: "Войдите в аккаунт." };
  }

  try {
    await db
      .update(userTable)
      .set({ name: name || null, updatedAt: new Date() })
      .where(eq(userTable.id, Number(user.id)));
  } catch (error) {
    return { message: "Что-то пошло не так. Повторите еще." };
  }
}

export async function applyForCard(body: { [key: string]: string }) {
  const { user } = await validateRequest();

  if (!user) {
    return { message: "Войдите в аккаунт." };
  }

  const todo = true;
  const { surname, name, patronymic, dob } = body;

  if (!surname || !name || !patronymic || !dob) {
    return { message: "Заполните все поля." };
  }

  try {
    const [thisUser] = await db
      .update(userTable)
      .set({
        applied: true,
        surname,
        name,
        patronymic,
        dob: new Date(dob).toISOString(),
        updatedAt: new Date(),
      })
      .where(eq(userTable.id, Number(user.id)))
      .returning();

    if (!thisUser || !thisUser.phone) {
      return { message: "Что-то пошло не так. Повторите еще." };
    }

    if (todo) {
      return { success: true };
    }

    const cards = await db.query.discountCard.findMany({
      where: eq(discountCard.userId, thisUser.id),
    });

    if (cards.length > 0) {
      return { message: "У вас уже есть дисконтная карта." };
    }

    const dcs = await getDiscountCards(thisUser.phone);
    if ("message" in dcs) {
      return { message: dcs.message };
    }

    if (dcs.length > 0) {
      const card = dcs[0];

      await db.insert(discountCard).values({
        userId: thisUser.id,
        barcode: card.barcode,
        accumulation: card.accumulation,
        discount: card.discount,
        discountJ: card.discountJ,
        rateAccumulation: card.rateAccumulation,
        rateAccumulationJ: card.rateAccumulationJ,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      });
    } else {
      const ean13 = generateEAN13();
      const fbCard = await createDiscountCard({
        phone: thisUser.phone,
        individualDiscount: ean13,
        holderName: `${surname} ${name} ${patronymic}`,
        comment: "Создано из сайта",
      });

      if ("message" in fbCard) {
        return { message: fbCard.message };
      }

      const [created] = await db
        .insert(discountCard)
        .values({
          userId: thisUser.id,
          barcode: fbCard.individualDiscount,
          accumulation: 0,
          discount: 0,
          discountJ: 30,
          rateAccumulation: 5,
          rateAccumulationJ: 3,
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        })
        .returning();

      const updFbCard = await updateDiscountCard(created.barcode, 1, 100);
      if ("message" in updFbCard) return { message: updFbCard.message };

      const action = await updateCard(created.id, 100, 1);
      if ("message" in action) return { message: action.message };
    }
  } catch (error) {
    return { message: "Что-то пошло не так. Повторите еще." };
  }
}

export async function logout() {
  const { session } = await validateRequest();
  if (!session) {
    return { error: "Unauthorized" };
  }

  await invalidateSession(session.id);

  await deleteSessionTokenCookie();
}

export async function changePhone(code: string, callId: string) {
  const { user } = await validateRequest();

  if (!user) {
    return { message: "Войдите в аккаунт." };
  }

  try {
    const call = await db.query.call.findFirst({
      where: eq(callTable.callId, callId),
    });

    if (!call) {
      return { message: "Запрос не найден." };
    }

    if (call.code !== code) {
      return { message: "Неправильный код." };
    }

    await db.delete(callTable).where(eq(callTable.phone, call.phone));

    await db
      .update(userTable)
      .set({
        phone: call.phone,
        updatedAt: new Date(),
      })
      .where(eq(userTable.id, Number(user.id)));
  } catch (error) {
    return { message: "Что-то пошло не так. Повторите еще." };
  }
}

export async function createCall(phone: string) {
  try {
    const zvonok = await callToNumber(phone);
    if ("message" in zvonok) {
      return { message: zvonok.message };
    }

    const { pincode, call_id } = zvonok;

    const [call] = await db
      .insert(callTable)
      .values({
        callId: call_id.toString(),
        phone,
        code: pincode,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      })
      .returning();

    return call.callId;
  } catch (error) {
    return { message: "Что-то пошло не так. Повторите еще." };
  }
}

export async function deleteAccount() {
  const { user } = await validateRequest();

  if (!user) {
    return { message: "Войдите в аккаунт." };
  }

  try {
    await db
      .update(userTable)
      .set({ isDeleted: true, updatedAt: new Date() })
      .where(eq(userTable.id, Number(user.id)));
  } catch (error) {
    return { message: "Что-то пошло не так. Повторите еще." };
  }
}

export async function changePreferences(body: { [key: string]: boolean }) {
  const { user } = await validateRequest();

  if (!user) {
    return { message: "Войдите в аккаунт." };
  }

  try {
    await db
      .update(userTable)
      .set({
        share: body.share,
        promo: body.promo,
        updatedAt: new Date(),
      })
      .where(eq(userTable.id, Number(user.id)));
  } catch (error) {
    return { message: "Что-то пошло не так. Повторите еще." };
  }
}

export async function changeDob(dob: string | null) {
  const { user } = await validateRequest();

  if (!user) {
    return { message: "Войдите в аккаунт." };
  }

  try {
    await db
      .update(userTable)
      .set({
        dob: dob ? new Date(dob).toISOString() : null,
        updatedAt: new Date(),
      })
      .where(eq(userTable.id, Number(user.id)));
  } catch (error) {
    return { message: "Что-то пошло не так. Повторите еще." };
  }
}
