"use server";

import { cookies } from "next/headers";
import { CallData, Payment, SmsData } from "./definitions";
import { v4 as uuidv4 } from "uuid";
import Email from "@/components/certificate/email";
import { render } from "@react-email/render";
import { MailerooClient } from "maileroo";

export async function callToNumber(phone: string) {
  try {
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    console.log(randomCode);
    const url =
      "https://zvonok.com/manager/cabapi_external/api/v1/phones/flashcall/";

    let formData = new FormData();
    formData.append("public_key", process.env.ZVONOK_API as string);
    formData.append("phone", phone);
    formData.append("campaign_id", process.env.ZVONOK_CAMPAIGN_ID as string);
    formData.append("phone_suffix", randomCode.toString());

    const res = await fetch(url, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      return { message: "Ошибка при создании вызова. Повторите еще." };
    }

    const data = await res.json();

    if (data.status !== "ok") {
      return { message: "Ошибка при создании вызова. Повторите еще." };
    }

    return data.data as CallData;
  } catch (error) {
    return { message: "Ошибка при создании вызова. Повторите еще." };
  }
}

export async function createPayment(
  value: number,
  orderId: number,
  phone: string
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
    description: `Заказ №${orderId} на сумму ${value} руб.`,
    merchant_customer_id: phone,
    metadata: {
      orderId: orderId,
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
      return { message: "Ошибка при создании платежа" };
    }

    const data = await res.json();

    return data;
  } catch (error) {
    console.log(error);
    return { message: "Ошибка при создании платежа" };
  }
}

export async function createNewPayment({
  value,
  phone,
  dbOrderId,
}: {
  value: number;
  phone: string;
  dbOrderId?: number;
}) {
  const endpoint = "https://api.yookassa.ru/v3/payments";

  const body = {
    amount: { value: value, currency: "RUB" },
    capture: true,
    confirmation: { type: "embedded" },
    description: `Заказ №${dbOrderId} на сумму ${value} руб.`,
    merchant_customer_id: phone,
    metadata: { dbOrderId },
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
      return { message: "Ошибка при создании платежа" };
    }

    const data: Payment = await res.json();

    return data;
  } catch (error) {
    console.log(error);
    return { message: "Ошибка при создании платежа" };
  }
}

export async function setCookie(name: string, value: string) {
  cookies().set(name, value, {
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    httpOnly: false,
  });
}

export async function updateAllCookies() {
  const cookieStore = cookies();
  const allCookies = cookieStore.getAll();

  for (const cookie of allCookies) {
    if (cookie.value) {
      cookieStore.set(cookie.name, cookie.value, {
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        httpOnly: false,
      });
    }
  }
}

export async function sendEmail(
  email: string,
  cert_number: string,
  nominal: number
): Promise<{ success: boolean } | { message: string }> {
  try {
    const maileroo = MailerooClient.getClient(process.env.MAILEROO_API_KEY);

    const emailHtml = await render(
      Email({ cert_number, nominal: Number(nominal) })
    );

    maileroo
      .setFrom("KUCHU", "info@kuchu.shop")
      .setTo(`Получатель`, email)
      .setSubject("Письмо с сертификатом")
      .setHtml(emailHtml)
      .setTracking(true);

    await maileroo.sendBasicEmail();

    return { success: true };
  } catch (error) {
    return { message: "Ошибка при отправке письма." };
  }
}

export async function sendSms(phone: string) {
  try {
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    console.log(randomCode);

    const email = process.env.SMS_AERO_EMAIL!;
    const apiKey = process.env.SMS_AERO_API_KEY!;
    const website = "kuchu.shop";
    const text = `Код подтверждения номера телефона для ${website}: ${randomCode}`;

    const params = new URLSearchParams({
      number: phone,
      text,
      sign: "SMSAero",
    });

    const url = `https://gate.smsaero.ru/v2/sms/send`;

    const res = await fetch(`${url}?${params}`, {
      headers: {
        Authorization: `Basic ${btoa(email + ":" + apiKey)}`,
      },
    });

    if (!res.ok) {
      return { message: "Ошибка при отправке SMS. Повторите еще." };
    }

    const data: SmsData = await res.json();

    if (!data.success) {
      return { message: "Ошибка при отправке SMS. Повторите еще." };
    }

    if (Array.isArray(data.data)) {
      if (data.data.length === 0) {
        return { message: "Ошибка при отправке SMS. Повторите еще." };
      }

      if (!data.data[0].id) {
        return { message: "Ошибка при отправке SMS. Повторите еще." };
      }

      return { call_id: data.data[0].id, pincode: randomCode };
    }

    if (!data.data.id) {
      return { message: "Ошибка при отправке SMS. Повторите еще." };
    }

    return { call_id: data.data.id, pincode: randomCode };
  } catch (error) {
    console.log(error);
    return { message: "Ошибка при отправке SMS. Повторите еще." };
  }
}

export async function sendOrderEmail({
  email,
  title,
  text,
}: {
  email: string | undefined;
  title: string;
  text: string;
}): Promise<{ success: boolean } | { message: string }> {
  if (!email) return { message: "Не указан email получателя." };

  try {
    const action = await sendBasicEmail({ title, text, email });

    if ("message" in action) {
      return { message: "Ошибка при отправке письма." };
    }

    return { success: true };
  } catch (error) {
    return { message: "Ошибка при отправке письма о заказе." };
  }
}

async function sendBasicEmail({
  title,
  text,
  email,
}: {
  title: string;
  text: string;
  email: string;
}) {
  try {
    const url = "https://smtp.maileroo.com/api/v2/emails";

    const body = {
      from: { address: "info@kuchu.shop", display_name: "KUCHU" },
      to: { address: email },
      subject: title,
      plain: text,
      tracking: true,
    };

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.MAILEROO_API_KEY!,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return { message: "Ошибка при отправке письма." };
    }

    const data: {
      success: boolean;
      message: string;
      data: {
        reference_id: string;
      };
    } = await res.json();

    if (!data.success) {
      return { message: data.message };
    }

    return { success: true, data };
  } catch (error) {
    console.log(error);
    return { message: "Ошибка при отправке письма." };
  }
}
