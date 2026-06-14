import { unstable_noStore as noStore } from "next/cache";
import {
  Branch,
  GoodsData,
  LoginData,
  OrderData,
  OstByGoodsData,
  OstData,
} from "../definitions";
import {
  CertificateData,
  ClassifierData,
  DiscountCardData,
  DopData,
  FindData,
} from "./definitions";

export async function getSessionId() {
  noStore();

  const endpoint = "https://api.farmbazis.ru/Login";

  const searchParams = new URLSearchParams({
    userId: process.env.USER_ID! || "",
    customerId: process.env.CUSTOMER_ID! || "",
    password: process.env.PASSWORD!,
  });

  try {
    if (
      (!process.env.USER_ID && !process.env.CUSTOMER_ID) ||
      !process.env.PASSWORD
    ) {
      throw new Error("Нет логина и пароля для сессии");
    }

    const res = await fetch(`${endpoint}?${searchParams}`);
    if (!res.ok) {
      throw new Error("Ошибка при получении идентификатора сессии.");
    }

    const data: LoginData = await res.json();

    if (data.status !== "0") {
      throw new Error("Неверные учетные данные.");
    }

    return data.sessionId;
  } catch (error) {
    throw new Error("Ошибка сервера. Что-то пошло не так.");
  }
}

export async function getBranchList() {
  noStore();

  const endpoint = "https://api.farmbazis.ru/BranchList";

  try {
    const sessionId = await getSessionId();

    const res = await fetch(endpoint, {
      headers: { WebApiSession: sessionId },
    });
    if (!res.ok) {
      throw new Error("Ошибка при получении списка филиалов");
    }

    const data: { status: string; items: Branch[] } = await res.json();

    if (data.status !== "0") {
      throw new Error("Ошибка при получении списка филиалов");
    }

    return data.items;
  } catch (error) {
    throw new Error("Ошибка сервера. Что-то пошло не так.");
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

  try {
    const sessionId = await getSessionId();

    const res = await fetch(`${endpoint}?${searchParams}`, {
      headers: { WebApiSession: sessionId },
    });
    if (!res.ok) {
      throw new Error("Ошибка при получении остатка товаров.");
    }

    const data: OstData = await res.json();

    if (data.status !== "0") {
      throw new Error("Ошибка при получении остатка товаров.");
    }

    return data.items;
  } catch (error) {
    throw new Error("Ошибка сервера. Что-то пошло не так.");
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

  try {
    const sessionId = await getSessionId();

    const res = await fetch(`${endpoint}?${searchParams}`, {
      headers: { WebApiSession: sessionId },
    });
    if (!res.ok) {
      throw new Error("Ошибка при получении списка товаров.");
    }

    const data: GoodsData = await res.json();

    if (data.status !== "0") {
      throw new Error("Ошибка при получении списка товаров.");
    }

    return data;
  } catch (error) {
    throw new Error("Ошибка сервера. Что-то пошло не так.");
  }
}

export async function getOstByGood(
  regId: string,
  drugId?: string,
  formId?: string
) {
  noStore();

  const endpoint = "https://api.farmbazis.ru/OstByGoods";

  const searchParams = new URLSearchParams({
    regId,
    drugId: drugId || "",
    formId: formId || "",
  });

  try {
    const sessionId = await getSessionId();

    const res = await fetch(`${endpoint}?${searchParams}`, {
      headers: { WebApiSession: sessionId },
    });
    if (!res.ok) {
      throw new Error("Ошибка при получении остатка товара.");
    }

    const data: OstData = await res.json();

    if (data.status !== "0") {
      throw new Error("Ошибка сервера. Что-то пошло не так.");
    }

    return data.items;
  } catch (error) {
    throw new Error("Ошибка сервера. Что-то пошло не так.");
  }
}

export async function getOrders(ordersList: string) {
  noStore();

  const endpoint = "https://api.farmbazis.ru/WA31";

  const searchParams = new URLSearchParams({
    ordersList,
  });

  try {
    const sessionId = await getSessionId();

    const res = await fetch(`${endpoint}?${searchParams}`, {
      headers: { WebApiSession: sessionId },
    });
    if (!res.ok) {
      throw new Error("Ошибка при получении списка заказов.");
    }

    const data: OrderData = await res.json();

    if (data.status !== "0") {
      throw new Error("Ошибка при получении списка заказов.");
    }

    return data.Orders;
  } catch (error) {
    throw new Error("Ошибка сервера. Что-то пошло не так.");
  }
}

export async function getOstByGoodsList(goodsList: string, branchList: string) {
  noStore();

  const endpoint = "https://api.farmbazis.ru/OstByGoodsList";

  const searchParams = new URLSearchParams({
    goodsList: goodsList
      .split(",")
      .map((item) => `<R F1="${item.trim()}" />`)
      .join(""),
    branchList: branchList
      .split(",")
      .map((item) => `<R F1="${item.trim()}" />`)
      .join(""),
  });

  try {
    const sessionId = await getSessionId();

    const res = await fetch(`${endpoint}?${searchParams}`, {
      headers: { WebApiSession: sessionId },
    });
    if (!res.ok) {
      throw new Error("Ошибка при получении списка товаров.");
    }

    const data: OstByGoodsData = await res.json();

    if (data.status !== "0") {
      throw new Error("Ошибка при получении списка товаров.");
    }

    return data.branchList;
  } catch (error) {
    throw new Error("Ошибка сервера. Что-то пошло не так.");
  }
}

export async function getDiscountCards(phone: string) {
  noStore();

  if (!phone) {
    return { message: "Телефон не выбран." };
  }

  if (phone.startsWith("+")) phone = phone.slice(1);

  const endpoint = "https://api.farmbazis.ru/WA49";

  const searchParams = new URLSearchParams({ phone });

  try {
    const sessionId = await getSessionId();

    const res = await fetch(`${endpoint}?${searchParams}`, {
      headers: { WebApiSession: sessionId },
    });
    if (!res.ok) {
      throw new Error("Ошибка при получении дисконтных карт.");
    }

    const data: DiscountCardData = await res.json();

    if (data.status !== "0") {
      throw new Error("Ошибка при получении дисконтных карт.");
    }

    return data.items;
  } catch (error) {
    throw new Error("Ошибка сервера. Что-то пошло не так.");
  }
}

export async function findGoods(query: string, count: number = 20) {
  noStore();

  if (!query) return [];

  const endpoint = "https://api.farmbazis.ru/FindGoods";

  const searchParams = new URLSearchParams({
    goods: query,
    recordCount: count.toString(),
  });

  try {
    const sessionId = await getSessionId();

    const res = await fetch(`${endpoint}?${searchParams}`, {
      headers: { WebApiSession: sessionId },
    });
    if (!res.ok) {
      throw new Error("");
    }

    const data: FindData = await res.json();

    if (data.status !== "0") {
      throw new Error("Ошибка при поиске товаров.");
    }

    return data.items;
  } catch (error) {
    throw new Error("Ошибка сервера. Что-то пошло не так.");
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

  try {
    const sessionId = await getSessionId();

    const res = await fetch(`${endpoint}?${searchParams}`, {
      headers: { WebApiSession: sessionId },
    });
    if (!res.ok) {
      throw new Error("Ошибка при получении списка сертификатов.");
    }

    const data: CertificateData = await res.json();

    if (data.status !== "0") {
      throw new Error("Ошибка при получении списка сертификатов.");
    }

    return data.cert_list;
  } catch (error) {
    throw new Error("Ошибка сервера. Что-то пошло не так.");
  }
}

export async function getClassifier() {
  noStore();

  const endpoint = "https://api.farmbazis.ru/WA36";

  try {
    const sessionId = await getSessionId();

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

export async function getDops({
  regId,
  drugId,
}: {
  regId?: number;
  drugId?: number;
}) {
  noStore();

  if (!regId && !drugId) {
    throw new Error("Не указан regId или drugId");
  }

  const endpoint = "https://api.farmbazis.ru/WA22";

  try {
    const sessionId = await getSessionId();

    const searchParams = new URLSearchParams({
      ...(regId && { regId: regId.toString() }),
      ...(drugId && { drugId: drugId.toString() }),
    });

    const res = await fetch(`${endpoint}?${searchParams}`, {
      headers: { WebApiSession: sessionId },
    });
    if (!res.ok) {
      throw new Error("Ошибка при получении списка допродаж.");
    }

    const data: DopData = await res.json();

    if (data.status !== "0") {
      //throw new Error("Ошибка при получении списка допродаж.");
      return [];
    }

    //return data.items;
    if (!data.items) {
      return [];
    }

    return Array.isArray(data.items) ? data.items : [data.items];
  } catch (error) {
    //throw new Error("Ошибка сервера. Что-то пошло не так.");
    console.error("getDops:", error);
    return [];
  }
}
