"use server";

import { Info } from "@/components/cart/definitions";
import { db } from "@/db";
import { address, branch, cert, deliveryZone, order, promo } from "@/db/schema";
import { and, asc, eq, ilike } from "drizzle-orm";

export async function getDeliveryData(userId: string | number) {
  try {
    const selectedAddress = await db.query.address.findFirst({
      where: and(
        eq(address.isDeleted, false),
        eq(address.selected, true),
        eq(address.userId, Number(userId))
      ),
      columns: {
        id: true,
        address: true,
        apartment: true,
        entrance: true,
        floor: true,
        comment: true,
        zoneId: true,
        selected: true,
        lat: true,
        long: true,
      },
    });

    if (!selectedAddress) {
      throw new Error("Адрес не выбран");
    }

    if (!selectedAddress.zoneId) {
      throw new Error("Зона доставки для выбранного адреса не найдена.");
    }

    const mainBranch = await db.query.branch.findFirst({
      where: and(eq(branch.isDeleted, false), eq(branch.main, true)),
      columns: { id: true, title: true, fbId: true },
    });

    if (!mainBranch) {
      throw new Error("Главный филиал не найден.");
    }

    if (!mainBranch.fbId) {
      throw new Error("Выбранный филиал не готов для заказа.");
    }

    const zone = await db.query.deliveryZone.findFirst({
      where: and(
        eq(deliveryZone.isDeleted, false),
        eq(deliveryZone.id, selectedAddress.zoneId)
      ),
      columns: {
        id: true,
        price: true,
        threshold: true,
        freeDelivery: true,
      },
    });

    if (!zone) {
      throw new Error("Зона доставки для выбранного адреса не найдена.");
    }

    return {
      address: selectedAddress,
      branch: mainBranch as { id: number; title: string; fbId: number },
      zone,
    };
  } catch (error) {
    console.log(error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Ошибка при получении данных для доставки."
    );
  }
}

export async function getSelectedBranch(branchId: number) {
  try {
    const thisBranch = await db.query.branch.findFirst({
      where: and(eq(branch.isDeleted, false), eq(branch.id, branchId)),
      columns: { id: true, title: true, fbId: true },
    });

    if (!thisBranch) {
      throw new Error("Выбранный филиал не найден.");
    }

    if (!thisBranch.fbId) {
      throw new Error("Выбранный филиал не готов для заказа.");
    }

    return thisBranch as { id: number; title: string; fbId: number };
  } catch (error) {
    console.log(error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Ошибка при получении данных для доставки."
    );
  }
}

export async function getDiscounts(userId: string | number, info: Info) {
  let amount = null;
  let percent = null;

  try {
    if (info.promo) {
      const promoResult = await db.query.promo.findFirst({
        where: and(eq(promo.isDeleted, false), ilike(promo.code, info.promo)),
        orderBy: [asc(promo.id)],
        columns: {
          id: true,
          code: true,
          amount: true,
          percent: true,
          forFirstOrder: true,
          completed: true,
        },
      });

      if (!promoResult) {
        throw new Error("Промокод не найден.");
      }

      if (promoResult.forFirstOrder) {
        const orders = await db.query.order.findMany({
          where: and(
            eq(order.isDeleted, false),
            eq(order.userId, Number(userId))
          ),
          columns: { id: true },
        });

        if (orders.length > 0) {
          throw new Error("Промокод доступен только для первого заказа.");
        }
      }

      amount = promoResult.amount ?? null;
      percent = promoResult.percent ?? null;
    }

    if (info.cert) {
      const found = await db.query.cert.findFirst({
        where: and(
          eq(cert.isDeleted, false),
          eq(cert.isPaid, true),
          eq(cert.number, info.cert),
          eq(cert.status, 5)
        ),
        columns: {
          id: true,
          number: true,
          nominal: true,
        },
      });

      if (!found) {
        throw new Error("Сертификат не найден.");
      }

      amount = found.nominal ?? null;
      percent = null;
    }

    return { amount, percent };
  } catch (error) {
    console.log(error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Ошибка при получении данных скидок."
    );
  }
}
