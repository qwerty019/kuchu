"use server";

import { CartItemState } from "@/stores/cart-store";
import { Address } from "../address/schema";
import { DeliveryZone } from "../deliveryzone/schema";
import { db } from "@/db";
import { order, orderGood, orderPromo, ost, payment } from "@/db/schema";
import { asc, desc, eq } from "drizzle-orm";
//import pusher from "@/lib/pusher-server";
import { sendOrderEmail } from "@/lib/actions";
import { AddOrderSchema, OrderAdmin } from "./schema";
import { z } from "zod";

const orderStatusMail = process.env.ORDER_STATUS_MAIL;

export async function createOrder(
  userId: string | number,
  fbOrder: { MadeToOrderTitleID: number },
  branchId: string,
  address: Address | undefined,
  items: CartItemState[],
  sum: number,
  allSum: number,
  info: {
    date: string;
    time: string;
    payment: string;
    useCard: boolean;
    promo: string;
  },
  promo: {
    id: number;
    amount: number | null;
    code: string;
    percent: number | null;
    forFirstOrder: boolean;
    completed: boolean;
  } | null,
  zone?: DeliveryZone
) {
  try {
    await db.transaction(async (tx) => {
      const [created] = await tx
        .insert(order)
        .values({
          userId: Number(userId),
          fbId: fbOrder.MadeToOrderTitleID,
          branchId: Number(branchId),
          addressId: address ? address.id : undefined,
          deliveryFee: address ? zone?.price : undefined,
          deliveryTime: address
            ? `${info.date === "today" ? "сегодня" : "завтра"} ${info.time}`
            : undefined,
          sum,
          allSum,
          paymentType: info.payment,
          status: "0",
          updatedAt: new Date(),
          createdAt: new Date(),
        })
        .returning();

      await tx.insert(orderGood).values(
        items.map((item) => ({
          orderId: created.id,
          goodId: item.id,
          qnt: item.qnt,
          price: parseFloat(
            item.qnts
              .reduce((acc, curr) => acc + curr.price * curr.added, 0)
              .toFixed(2)
          ),
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        }))
      );

      if (promo) {
        await tx.insert(orderPromo).values({
          orderId: created.id,
          promoId: promo.id,
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        });
      }
    });

    const newOrder = await db.query.order.findFirst({
      where: eq(order.fbId, fbOrder.MadeToOrderTitleID),
    });

    if (!newOrder) {
      return { message: "Ошибка при создании заказа. Попробуйте еще раз." };
    }

    return newOrder;
  } catch (error) {
    console.log(error);
    return { message: "Ошибка при создании заказа. Попробуйте еще раз." };
  }
}

export async function createNewOrder({
  body: data,
  items,
}: {
  body: z.infer<typeof AddOrderSchema>;
  items: CartItemState[];
}) {
  const validatedFields = AddOrderSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Недостающие поля. Не удалось добавить заказ.",
    };
  }

  const {
    userId,
    fbId,
    branchId,
    addressId,
    deliveryFee,
    deliveryTime,
    sum,
    allSum,
    paymentType,
    version,
    body,
  } = validatedFields.data;

  if (items.length === 0) {
    return { message: "Товаров нет в заказе." };
  }

  try {
    await db.transaction(async (tx) => {
      const [created] = await tx
        .insert(order)
        .values({
          userId: Number(userId),
          fbId,
          branchId: Number(branchId),
          addressId,
          deliveryFee,
          deliveryTime,
          sum,
          allSum,
          paymentType,
          status: version === 1 ? "0" : "Собираем заказ",
          updatedAt: new Date(),
          createdAt: new Date(),
          body,
          version,
        })
        .returning();

      await tx.insert(orderGood).values(
        items.map((item) => ({
          orderId: created.id,
          goodId: item.id,
          qnt: item.qnt,
          price: parseFloat(
            item.qnts
              .reduce((acc, curr) => acc + curr.price * curr.added, 0)
              .toFixed(2)
          ),
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        }))
      );

      // if (promoId) {
      //   await tx.insert(orderPromo).values({
      //     orderId: created.id,
      //     promoId,
      //     updatedAt: new Date().toISOString(),
      //     createdAt: new Date().toISOString(),
      //   });
      // }
    });

    const newOrder = await db.query.order.findFirst({
      where: eq(order.userId, Number(userId)),
      orderBy: desc(order.createdAt),
    });

    if (!newOrder) {
      return { message: "Ошибка при создании заказа. Попробуйте еще раз." };
    }

    return newOrder;
  } catch (error) {
    console.log(error);
    return { message: "Ошибка при создании заказа. Попробуйте еще раз." };
  }
}

export async function updateOrder(
  orderId: number,
  status: string,
  fbId?: number
) {
  try {
    await db
      .update(order)
      .set({ status, updatedAt: new Date() })
      .where(eq(order.id, orderId));

    if (fbId) {
      await db
        .update(order)
        .set({ fbId, updatedAt: new Date() })
        .where(eq(order.id, orderId));
    }

    return { success: true };
  } catch (err) {
    console.log(err);
    return { message: "Ошибка при обновлении заказа." };
  }
}

export async function connectOrder(orderId: number, fbId: number) {
  try {
    await db
      .update(order)
      .set({ fbId, updatedAt: new Date() })
      .where(eq(order.id, orderId));

    return { success: true };
  } catch (err) {
    console.log(err);
    return { message: "Ошибка при соединении заказа с FarmBazis." };
  }
}

export async function addOrderError(orderId: number, error: string) {
  try {
    await db
      .update(order)
      .set({ error, updatedAt: new Date() })
      .where(eq(order.id, orderId));

    return { success: true };
  } catch (err) {
    console.log(err);
    return { message: "Ошибка при добавлении ошибки в заказ." };
  }
}

export async function updateOrderStatus(orderId: number, status: string) {
  try {
    await db
      .update(order)
      .set({ status, updatedAt: new Date() })
      .where(eq(order.id, orderId));

    const found = await db.query.order.findFirst({
      where: eq(order.id, orderId),
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

    if (!found) {
      return { message: "Заказ не найден." };
    }

    // pusher.trigger(`user-${found.user.id}`, "order-updated", {
    //   id: found.id,
    //   status: found.status,
    // });

    return found satisfies OrderAdmin;
  } catch (err) {
    console.log(err);
    return { message: "Ошибка при обновлении заказа." };
  }
}

export async function cancelOrder(orderId: number): Promise<
  | {
      success: boolean;
    }
  | { message: string }
> {
  try {
    const payments = await db.query.payment.findMany({
      where: eq(payment.orderId, orderId),
      columns: { status: true },
    });

    if (
      payments.length > 0 &&
      payments.every((payment) => payment.status === "paid")
    ) {
      return {
        message:
          "Вы не можете отменить заказ, который уже оплачен. Напишите в поддержку.",
      };
    }

    await db
      .update(order)
      .set({ status: "Отменен", updatedAt: new Date() })
      .where(eq(order.id, orderId));

    await sendOrderEmail({
      email: orderStatusMail,
      title: `Заказ №${orderId} отменен пользователем`,
      text: `Заказ №${orderId} отменен пользователем`,
    });

    return { success: true };
  } catch (err) {
    console.log(err);
    return { message: "Ошибка при отмене заказа." };
  }
}

export async function repeatOrder(
  orderId: number,
  branch: string,
  method: string
) {
  try {
    const found = await db.query.order.findFirst({
      where: eq(order.id, orderId),
      columns: { id: true },
      with: {
        orderGoods: {
          columns: { id: true, qnt: true },
          with: {
            good: {
              columns: {
                id: true,
                isDeleted: true,
                regId: true,
                drug: true,
                form: true,
                img: true,
                title: true,
                subtitle: true,
              },
              with: {
                osts: {
                  where: eq(ost.isDeleted, false),
                  orderBy: asc(ost.priceRoznWNDS),
                  columns: {
                    branchId: true,
                    uQntOst: true,
                    priceRoznWNDS: true,
                    fixPriceValue: true,
                    recipe: true,
                    naklDataId: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!found) {
      return { message: "Заказ не найден." };
    }

    const items: CartItemState[] = [];

    for (const og of found.orderGoods) {
      const isDeleted = og.good.isDeleted;
      if (isDeleted) continue;

      const ost = og.good.osts.find((o) => o.branchId === Number(branch));
      if (!ost) continue;

      let qnt = og.qnt > ost.uQntOst ? Math.floor(ost.uQntOst) : og.qnt;

      if (qnt === 0) continue;

      if (method === "delivery" && ost.recipe) {
        continue;
      }

      const cartItem = {
        id: og.good.id,
        regId: og.good.regId,
        drug: og.good.drug,
        form: og.good.form,
        img: og.good.img || "",
        title: og.good.title,
        subtitle: og.good.subtitle,
        qnt: og.qnt,
        // Distribute quantity across stock records (osts) by available stock in order, up to og.qnt total
        qnts: (() => {
          let remaining = og.qnt;
          return og.good.osts.map((o) => {
            const toAdd = Math.min(remaining, Math.floor(o.uQntOst));
            remaining -= toAdd;
            return {
              branchId: o.branchId,
              price: o.priceRoznWNDS,
              qnt: o.uQntOst,
              added: toAdd,
              fixPrice: o.fixPriceValue,
              naklDataId: o.naklDataId,
            };
          });
        })(),
      };

      items.push(cartItem);
    }

    if (items.length === 0) {
      return { message: "Товары не найдены." };
    }

    return items;
  } catch (err) {
    console.log(err);
    return { message: "Ошибка при повторе заказа." };
  }
}
