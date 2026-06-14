"use server";

import { unstable_noStore as noStore } from "next/cache";
import { validateRequest } from "@/lib/auth";
import { db } from "@/db";
import { order, orderGood, payment } from "@/db/schema";
import {
  and,
  asc,
  countDistinct,
  desc,
  eq,
  gt,
  inArray,
  or,
} from "drizzle-orm";
import { OrderAdmin, Order } from "./schema";

export async function fetchUserOrders() {
  noStore();

  const { user } = await validateRequest();

  if (!user) {
    throw new Error("Вы не авторизованы. Войдите в ваш аккаунт.");
  }

  try {
    const orders = await db.query.order.findMany({
      where: and(eq(order.userId, Number(user.id)), eq(order.isDeleted, false)),
      orderBy: [desc(order.createdAt)],
      columns: {
        id: true,
        fbId: true,
        status: true,
        sum: true,
        allSum: true,
        deliveryFee: true,
        deliveryTime: true,
        paymentType: true,
        createdAt: true,
        version: true,
      },
      with: {
        orderGoods: {
          columns: {
            id: true,
            price: true,
            qnt: true,
          },
          with: {
            good: {
              columns: {
                regId: true,
                drug: true,
                title: true,
                subtitle: true,
                form: true,
                img: true,
              },
            },
          },
        },
        address: {
          columns: {
            address: true,
            apartment: true,
            comment: true,
            entrance: true,
            floor: true,
          },
        },
        branch: {
          columns: {
            title: true,
            address: true,
          },
        },
        payments: {
          columns: {
            token: true,
            status: true,
          },
        },
      },
    });

    return orders satisfies Order[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Не удалось загрузить список заказов.");
  }
}

export async function fetchOrderById(id: number) {
  noStore();

  const { user } = await validateRequest();

  if (!user) {
    throw new Error("Вы не авторизованы. Войдите в ваш аккаунт.");
  }

  try {
    const orderData = await db.query.order.findFirst({
      where: and(
        eq(order.isDeleted, false),
        eq(order.id, id),
        eq(order.userId, Number(user.id))
      ),
      columns: {
        id: true,
        fbId: true,
        status: true,
        sum: true,
        allSum: true,
        deliveryFee: true,
        deliveryTime: true,
        paymentType: true,
        createdAt: true,
        version: true,
      },
      with: {
        orderGoods: {
          columns: {
            id: true,
            price: true,
            qnt: true,
          },
          with: {
            good: {
              columns: {
                regId: true,
                drug: true,
                title: true,
                subtitle: true,
                form: true,
                img: true,
              },
            },
          },
        },
        address: {
          columns: {
            address: true,
            apartment: true,
            comment: true,
            entrance: true,
            floor: true,
          },
        },
        branch: {
          columns: {
            title: true,
            address: true,
          },
        },
        payments: {
          columns: {
            token: true,
            status: true,
          },
        },
      },
    });

    if (!orderData) return null;

    return orderData satisfies Order;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Не удалось загрузить заказ.");
  }
}

export async function getOrder(id: number) {
  try {
    const found = await db.query.order.findFirst({
      where: eq(order.id, id),
    });

    return found;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Не удалось загрузить заказ.");
  }
}

export async function fetchOrders({
  page = 1,
  limit = 10,
}: {
  page?: number;
  limit?: number;
}) {
  noStore();

  try {
    const orders = await db.query.order.findMany({
      // where: eq(order.isDeleted, false),
      limit: limit,
      offset: (page - 1) * limit,
      orderBy: [desc(order.createdAt)],
      columns: {
        id: true,
        fbId: true,
        createdAt: true,
        updatedAt: true,
        allSum: true,
        deliveryFee: true,
        status: true,
        paymentType: true,
        isDeleted: true,
        body: true,
        version: true,
        error: true,
      },
      with: {
        orderGoods: {
          where: eq(orderGood.isDeleted, false),
          columns: {
            id: true,
            price: true,
            qnt: true,
          },
          with: {
            good: {
              columns: {
                drug: true,
                form: true,
                regId: true,
                img: true,
                title: true,
                subtitle: true,
              },
            },
          },
        },
        payments: {
          where: eq(payment.isDeleted, false),
          columns: {
            id: true,
            amount: true,
            status: true,
            token: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        address: {
          columns: {
            address: true,
            entrance: true,
            floor: true,
            apartment: true,
            comment: true,
          },
        },
        branch: {
          columns: {
            title: true,
            address: true,
          },
        },
        user: {
          columns: {
            id: true,
            phone: true,
          },
        },
      },
    });

    return orders satisfies OrderAdmin[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Не удалось загрузить список заказов.");
  }
}

export async function fetchOrdersCount() {
  noStore();

  try {
    const result = await db
      .select({ count: countDistinct(order.id) })
      .from(order);

    return result[0].count;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Не удалось загрузить количество заказов.");
  }
}

export async function fetchCurrentOrders(userId: number | string) {
  noStore();

  try {
    const orders = await db.query.order.findMany({
      where: and(
        eq(order.userId, Number(userId)),
        eq(order.isDeleted, false),
        eq(order.version, 2),
        or(
          and(
            inArray(order.status, [
              "Доставили до вас",
              "Готово к выдаче",
              "Отменен",
            ]),
            gt(order.updatedAt, new Date(Date.now() - 1000 * 60 * 5))
          ),
          and(inArray(order.status, ["Передали курьеру", "Собираем заказ"]))
        )
      ),
      orderBy: [asc(order.createdAt)],
      columns: {
        id: true,
        fbId: true,
        status: true,
        sum: true,
        allSum: true,
        deliveryFee: true,
        deliveryTime: true,
        paymentType: true,
        createdAt: true,
        version: true,
      },
      with: {
        orderGoods: {
          columns: {
            id: true,
            price: true,
            qnt: true,
          },
          with: {
            good: {
              columns: {
                regId: true,
                drug: true,
                title: true,
                subtitle: true,
                form: true,
                img: true,
              },
            },
          },
        },
        address: {
          columns: {
            address: true,
            apartment: true,
            comment: true,
            entrance: true,
            floor: true,
          },
        },
        branch: {
          columns: {
            title: true,
            address: true,
          },
        },
        payments: {
          columns: {
            token: true,
            status: true,
          },
        },
      },
    });

    return orders satisfies Order[];
  } catch (err) {
    console.log(err);
    throw new Error("Не удалось загрузить текущие заказы.");
  }
}
