import {
  CertificateData,
  ClassifierData,
  GoodsData,
  LoginData,
  OrderData,
  OstData,
} from "./definitions";
import { unstable_noStore as noStore } from "next/cache";

export async function getSessionId() {
  noStore();

  const endpoint = "https://api.farmbazis.ru/Login";
  const searchParams = new URLSearchParams({
    userId: process.env.USER_ID! || "",
    customerId: process.env.CUSTOMER_ID! || "",
    password: process.env.PASSWORD!,
  });

  if (
    (!process.env.USER_ID && !process.env.CUSTOMER_ID) ||
    !process.env.PASSWORD
  ) {
    return { message: "Нет логина и пароля для сессии" };
  }

  try {
    const res = await fetch(`${endpoint}?${searchParams}`);
    if (!res.ok) {
      return { message: "Ошибка при получении идентификатора сессии." };
    }

    const data: LoginData = await res.json();

    if (data.status !== "0") {
      return { message: "Неверные учетные данные." };
    }

    return data.sessionId;
  } catch (error) {
    return { message: "Ошибка сервера. Что-то пошло не так." };
  }
}

export async function getOstByDate(branchId: string) {
  noStore();

  const endpoint = "https://api.farmbazis.ru/OstByDate";

  const tomorrow = Date.now() + 3600 * 1000 * 24;
  const date = new Date(tomorrow).toLocaleString("sv") + ".000";

  const searchParams = new URLSearchParams({
    branchId,
    date,
  });

  const sessionId = await getSessionId();
  if (typeof sessionId !== "string") {
    return { message: sessionId.message };
  }

  try {
    const res = await fetch(`${endpoint}?${searchParams}`, {
      headers: {
        WebApiSession: sessionId,
      },
    });
    if (!res.ok) {
      const data = await res.json();
      return { message: data?.error || "Ошибка при получении остатка товаров" };
    }

    const data: OstData = await res.json();

    if (data.status !== "0") {
      return { message: "Ошибка сервера. Что-то пошло не так." };
    }

    return data.items;
  } catch (error) {
    return { message: "Ошибка сервера. Что-то пошло не так." };
  }
}

export async function getGoods(goodsList?: string, lastId?: string) {
  noStore();

  const endpoint = "https://api.farmbazis.ru/SprGoods";

  const searchParams = new URLSearchParams({
    date: "2000-01-01 00:00:00",
    lastId: lastId || "0",
    goodsList: goodsList || "",
  });

  const sessionId = await getSessionId();
  if (typeof sessionId !== "string") {
    return { message: sessionId.message };
  }

  try {
    const res = await fetch(`${endpoint}?${searchParams}`, {
      headers: {
        WebApiSession: sessionId,
      },
    });
    if (!res.ok) {
      const data = await res.json();
      return { message: data?.error || "Ошибка при получении списка товаров" };
    }

    const data: GoodsData = await res.json();

    if (data.status !== "0") {
      console.log(data);
      return { message: "Ошибка сервера. Что-то пошло не так." };
    }

    return data.items;
  } catch (error) {
    console.log(error);
    return { message: "Ошибка сервера. Что-то пошло не так." };
  }
}

export async function getOrders(branchId?: string) {
  noStore();

  const endpoint = "https://api.farmbazis.ru/WA31";

  const searchParams = new URLSearchParams();
  searchParams.append("branchId", branchId || "");

  const sessionId = await getSessionId();
  if (typeof sessionId !== "string") {
    return { message: sessionId.message };
  }

  try {
    const res = await fetch(`${endpoint}?${searchParams}`, {
      headers: {
        WebApiSession: sessionId,
      },
    });
    if (!res.ok) {
      const data = await res.json();
      return { message: data?.error || "Ошибка при получении списка заказов" };
    }

    const data: OrderData = await res.json();

    if (data.status !== "0") {
      return { message: "Ошибка сервера. Что-то пошло не так." };
    }

    return data.Orders;
  } catch (error) {
    return { message: "Ошибка сервера. Что-то пошло не так." };
  }
}

export async function getOrders2(ordersList: string) {
  noStore();

  const endpoint = "https://api.farmbazis.ru/WA31";

  const searchParams = new URLSearchParams({
    ordersList,
  });

  const sessionId = await getSessionId();
  if (typeof sessionId !== "string") {
    return { message: sessionId.message };
  }

  try {
    const res = await fetch(`${endpoint}?${searchParams}`, {
      headers: {
        WebApiSession: sessionId,
      },
    });
    if (!res.ok) {
      const data = await res.json();
      return { message: data?.error || "Ошибка при получении списка заказов" };
    }

    const data: OrderData = await res.json();

    if (data.status !== "0") {
      return { message: "Ошибка сервера. Что-то пошло не так." };
    }

    return data.Orders;
  } catch (error) {
    return { message: "Ошибка сервера. Что-то пошло не так." };
  }
}

export async function getCertificates(
  status?: string,
  cert_number?: string,
  upd_count?: string
) {
  noStore();

  const endpoint = "https://api.farmbazis.ru/WA47";

  const searchParams = new URLSearchParams({
    status: status || "",
    cert_number: cert_number || "",
    upd_count: upd_count || "",
  });

  const sessionId = await getSessionId();
  if (typeof sessionId !== "string") {
    return { message: sessionId.message };
  }

  try {
    const res = await fetch(`${endpoint}?${searchParams}`, {
      headers: { WebApiSession: sessionId },
    });

    if (!res.ok) {
      const data = await res.json();
      return {
        message: data?.error || "Ошибка при получении списка сертификатов.",
      };
    }

    const data: CertificateData = await res.json();

    if (data.status !== "0") {
      return { message: "Ошибка сервера. Что-то пошло не так." };
    }

    return data.cert_list;
  } catch (error) {
    console.log(error);
    return { message: "Ошибка сервера. Что-то пошло не так." };
  }
}

export async function getClassifier() {
  noStore();

  const endpoint = "https://api.farmbazis.ru/WA36";

  try {
    const sessionId = await getSessionId();

    if (typeof sessionId !== "string") {
      throw new Error("Ошибка при получении идентификатора сессии.");
    }

    const res = await fetch(`${endpoint}`, {
      headers: { WebApiSession: sessionId },
    });
    if (!res.ok) {
      throw new Error("Ошибка при получении списка классификаторов.");
    }

    const data: ClassifierData = await res.json();

    if (data.status !== "0") {
      throw new Error("Ошибка при получении списка классификаторов.");
    }

    if (!data.items.row) {
      return [];
    }

    return data.items.row;
  } catch (error) {
    throw new Error("Ошибка сервера. Что-то пошло не так.");
  }
}
