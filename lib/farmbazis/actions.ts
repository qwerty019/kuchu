"use server";

import { Book } from "../definitions";
import { getSessionId } from "./data";

export async function createOrderFb(branchId: number, body: any) {
  const endpoint = `https://api.farmbazis.ru/WA23`;

  const searchParams = new URLSearchParams({ branchId: branchId.toString() });

  try {
    const sessionId = await getSessionId();

    const res = await fetch(`${endpoint}?${searchParams}`, {
      method: "POST",
      headers: { WebApiSession: sessionId },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data: { status: string; error: string } = await res.json();
      return {
        message: data?.error || "Ошибка сервера. Что-то пошло не так.",
      };
    }

    const data: Book = await res.json();

    if (data.status !== "0") {
      return { message: "Ошибка при создании заказа." };
    }

    return data;
  } catch (err) {
    return { message: "Ошибка сервера. Что-то пошло не так." };
  }
}

export async function updateDiscountCard(
  discountCardNumber: string,
  operationType: 1 | 2, // 1 - накопление, 2 - списание
  quantity: number
) {
  const endpoint = `https://api.farmbazis.ru/WA44`;

  const searchParams = new URLSearchParams({
    discountCardNumber,
    operationType: operationType.toString(),
    quantity: quantity.toString(),
  });

  try {
    const sessionId = await getSessionId();

    const res = await fetch(`${endpoint}?${searchParams}`, {
      headers: { WebApiSession: sessionId },
    });

    if (!res.ok) {
      const data: { status: string; error: string } = await res.json();
      return {
        message: data?.error || "Ошибка сервера. Что-то пошло не так.",
      };
    }

    const data: { status: string } = await res.json();

    if (data.status !== "0") {
      return { message: "Ошибка при списании/начислении бонусов." };
    }

    return data;
  } catch (err) {
    return { message: "Ошибка сервера. Что-то пошло не так." };
  }
}

export async function cancelOrderFb(
  MadeToOrderTitleID: string,
  comment: string
) {
  const endpoint = `https://api.farmbazis.ru/WA38`;

  const searchParams = new URLSearchParams({ MadeToOrderTitleID, comment });

  try {
    const sessionId = await getSessionId();

    const res = await fetch(`${endpoint}?${searchParams}`, {
      headers: { WebApiSession: sessionId },
    });

    if (!res.ok) {
      const data: { status: string; error: string } = await res.json();
      return {
        message: data?.error || "Ошибка сервера. Что-то пошло не так.",
      };
    }

    const data: Book = await res.json();

    if (data.status !== "0") {
      return { message: "Ошибка при удалении заказа." };
    }

    return data;
  } catch (err) {
    return { message: "Ошибка сервера. Что-то пошло не так." };
  }
}

export async function createDiscountCard(body: {
  phone: string;
  holderName: string;
  individualDiscount: string;
  comment?: string;
}) {
  const { individualDiscount, holderName, phone, comment } = body;

  const endpoint = `https://api.farmbazis.ru/WA48`;

  const searchParams = new URLSearchParams({
    typeDiscountTitleId: "3252",
    individualDiscount,
    holderName,
    phone: phone.replace(/\D/g, ""),
    comment: comment || "",
  });

  try {
    const sessionId = await getSessionId();

    const res = await fetch(`${endpoint}?${searchParams}`, {
      headers: { WebApiSession: sessionId },
    });

    if (!res.ok) {
      const data: { status: string; error: string } = await res.json();
      return {
        message: data?.error || "Ошибка сервера. Что-то пошло не так.",
      };
    }

    const data = await res.json();

    if (data.status !== "0") {
      return { message: "Ошибка при создании карты." };
    }

    return data as { status: string; individualDiscount: string };
  } catch (err) {
    return { message: "Ошибка сервера. Что-то пошло не так." };
  }
}

export async function createCertificate(data: {
  title: string;
  number: string;
  nominal: number;
  expDate: string;
  cert_branchs: number[];
}) {
  const { title, number, nominal, expDate, cert_branchs } = data;

  const endpoint = `https://api.farmbazis.ru/WA46`;

  const body = {
    title,
    create_type_id: 1,
    cert_number_begin: number,
    nominal,
    comment_text: "Создан из сайта",
    expiration_date: expDate,
    cert_branchs,
  };

  try {
    const sessionId = await getSessionId();

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { WebApiSession: sessionId },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data: { status: string; error: string } = await res.json();
      return {
        message: data?.error || "Ошибка сервера. Что-то пошло не так.",
      };
    }

    const data = await res.json();

    if (data.status !== "0") {
      return { message: "Ошибка при создании сертификата." };
    }

    return data as {
      status: string;
      result: {
        is_success: boolean;
        created_count: number;
        planned_count: number;
        certificate_list: number[];
      };
    };
  } catch (err) {
    return { message: "Ошибка сервера. Что-то пошло не так." };
  }
}
