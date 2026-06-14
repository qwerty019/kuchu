"use server";

import { db } from "@/db";
import { callToNumber, sendSms } from "@/lib/actions";
import { createSession, generateSessionToken } from "@/lib/auth";
import { fetchUserAddresses } from "@/lib/db/address/data";
import { getDiscountCard } from "@/lib/db/discountcard/data";
import { and, eq } from "drizzle-orm";
import { parsePhoneNumber } from "libphonenumber-js/mobile";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { user as userTable, call as callTable } from "@/db/schema";
import { z } from "zod";
import { formSchema } from "./schema";

export async function firstCall({ phone }: { phone: string }) {
  if (!phone) {
    return { name: "phone", message: "Неправильный номер телефона." };
  }

  let phoneNumber = null;

  try {
    const parsed = parsePhoneNumber(phone, "RU");

    if (parsed.country !== "RU" || !parsed.isValid()) {
      return { name: "phone", message: "Неправильный номер телефона." };
    }

    phoneNumber = parsed.number;
  } catch (err) {
    return { name: "phone", message: "Неправильный номер телефона." };
  }

  let user = null;
  let isNew = false;

  try {
    user = await db.query.user.findFirst({
      where: and(
        eq(userTable.phone, phoneNumber),
        eq(userTable.isDeleted, false)
      ),
      columns: { id: true, phone: true },
    });

    if (!user) isNew = true;

    let call = null;

    call = await db.query.call.findFirst({
      where: eq(callTable.phone, phoneNumber),
      columns: { id: true, callId: true, createdAt: true },
    });

    let isCallOld = false;

    if (call) {
      const isoDate = toUTCISOString(call.createdAt);
      const callTime = new Date(isoDate).getTime();
      const currentTime = new Date().getTime();
      const timeDifference = currentTime - callTime;
      const threeMinutesInMs = 3 * 60 * 1000;

      if (timeDifference > threeMinutesInMs) isCallOld = true;
    }

    if (!call || isCallOld) {
      await db.delete(callTable).where(eq(callTable.phone, phoneNumber));

      const zvonok = await callToNumber(phoneNumber);
      if ("message" in zvonok) {
        return { name: "phone", message: zvonok.message };
      }

      // const zvonok = {
      //   pincode: Math.floor(1000 + Math.random() * 9000).toString(),
      //   call_id: Math.floor(10000000 + Math.random() * 90000000).toString(),
      // };

      const { pincode, call_id } = zvonok;

      console.log(pincode);

      const arr = await db
        .insert(callTable)
        .values({
          callId: call_id.toString(),
          phone: phoneNumber,
          code: pincode,
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        })
        .returning();

      call = arr[0];
    }

    return {
      callId: call.callId,
      date: toUTCISOString(call.createdAt),
      isNew,
    };
  } catch (err) {
    console.log(err);
    return { message: "Что-то пошло не так. Повторите еще." };
  }
}

export async function checkCode(values: z.infer<typeof formSchema>) {
  const { phone, code } = values;

  if (!phone) {
    return { name: "code", message: "Обновите страницу и повторите снова." };
  }

  if (!code) {
    return { name: "code", message: "Код не найден." };
  }

  let phoneNumber = null;

  try {
    const parsed = parsePhoneNumber(phone, "RU");

    if (parsed.country !== "RU" || !parsed.isValid()) {
      return { name: "phone", message: "Неправильный номер телефона." };
    }

    phoneNumber = parsed.number;
  } catch (err) {
    return { name: "phone", message: "Неправильный номер телефона." };
  }

  try {
    const call = await db.query.call.findFirst({
      where: eq(callTable.phone, phoneNumber),
      columns: { id: true, callId: true, createdAt: true, code: true },
    });

    if (!call) {
      return { name: "code", message: "Звонок не найден. Повторите снова." };
    }

    const isoDate = toUTCISOString(call.createdAt);

    if (new Date(isoDate).getTime() < new Date().getTime() - 3 * 60 * 1000) {
      return { name: "code", message: "Код устарел. Повторите снова." };
    }

    if (call.code !== code) {
      return { name: "code", message: "Неправильный код." };
    }

    await db.delete(callTable).where(eq(callTable.phone, phoneNumber));

    const { share, promo, isNew, surname, name, dob } = values;

    if (isNew) {
      const arr = await db
        .insert(userTable)
        .values({
          phone: phoneNumber,
          share,
          promo,
          surname,
          name,
          dob: dob ? new Date(dob).toISOString() : null,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return { userId: arr[0].id };
    }

    const user = await db.query.user.findFirst({
      where: and(
        eq(userTable.phone, phoneNumber),
        eq(userTable.isDeleted, false)
      ),
      columns: { id: true, phone: true },
    });

    if (!user || !user.phone) {
      return { message: "Пользователь не найден." };
    }

    const addresses = await fetchUserAddresses(user.id);
    const discountCard = await getDiscountCard(user.id);

    return { userId: user.id, addresses, discountCard };
  } catch (error) {
    console.log(error);
    return { message: "Что-то пошло не так. Повторите еще." };
  }
}

export async function newCall(phone: string) {
  if (!phone) {
    return { message: "Неправильный номер телефона." };
  }

  try {
    let phoneNumber = null;

    try {
      const parsed = parsePhoneNumber(phone, "RU");

      if (parsed.country !== "RU" || !parsed.isValid()) {
        return { name: "phone", message: "Неправильный номер телефона." };
      }

      phoneNumber = parsed.number;
    } catch (err) {
      return { name: "phone", message: "Неправильный номер телефона." };
    }

    await db.delete(callTable).where(eq(callTable.phone, phoneNumber));

    const zvonok = await callToNumber(phoneNumber);
    if ("message" in zvonok) {
      return { message: zvonok.message };
    }

    // const zvonok = {
    //   pincode: Math.floor(1000 + Math.random() * 9000).toString(),
    //   call_id: Math.floor(10000000 + Math.random() * 90000000).toString(),
    // };

    const { pincode, call_id } = zvonok;

    // console.log(pincode);

    const arr = await db
      .insert(callTable)
      .values({
        callId: call_id.toString(),
        phone: phoneNumber,
        code: pincode,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      })
      .returning();

    const call = arr[0];

    return { callId: call.callId, date: toUTCISOString(call.createdAt) };
  } catch (error) {
    return { message: "Что-то пошло не так." };
  }
}

export async function sendSmsCode(phone: string) {
  if (!phone) {
    return { message: "Неправильный номер телефона." };
  }

  try {
    let phoneNumber = null;

    try {
      const parsed = parsePhoneNumber(phone, "RU");

      if (parsed.country !== "RU" || !parsed.isValid()) {
        return { name: "phone", message: "Неправильный номер телефона." };
      }

      phoneNumber = parsed.number;
    } catch (err) {
      return { name: "phone", message: "Неправильный номер телефона." };
    }

    await db.delete(callTable).where(eq(callTable.phone, phoneNumber));

    const sms = await sendSms(phoneNumber);
    if ("message" in sms) {
      return { message: sms.message };
    }

    // const sms = {
    //   pincode: Math.floor(1000 + Math.random() * 9000).toString(),
    //   call_id: Math.floor(10000000 + Math.random() * 90000000).toString(),
    // };

    const { pincode, call_id } = sms;

    // console.log(pincode);

    const arr = await db
      .insert(callTable)
      .values({
        callId: call_id.toString(),
        phone: phoneNumber,
        code: pincode.toString(),
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      })
      .returning();

    const call = arr[0];

    return { callId: call.callId, date: toUTCISOString(call.createdAt) };
  } catch (error) {
    return { message: "Что-то пошло не так." };
  }
}

export async function setSession(userId: number) {
  const token = generateSessionToken();
  const session = await createSession(token, userId);
  setSessionTokenCookie(token, session.expiresAt);

  revalidatePath("/", "layout");
}

export async function setSessionTokenCookie(token: string, expiresAt: Date) {
  const cookieStore = cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  });
}

export async function deleteSessionTokenCookie() {
  const cookieStore = cookies();
  cookieStore.set("session", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
}

function toUTCISOString(dateString: string) {
  // Parse parts manually
  const [datePart, timePart] = dateString.split(" ");
  const [year, month, day] = datePart.split("-");
  const [hours, minutes, secondsWithMs] = timePart.split(":");
  const [seconds, ms] = secondsWithMs
    ? secondsWithMs.split(".")
    : [secondsWithMs, "0"];

  // Construct the ISO string directly in UTC format
  const isoString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${ms ? `.${ms}` : ""}Z`;

  return isoString;
}

