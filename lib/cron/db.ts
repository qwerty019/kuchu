"use server";

import { unstable_noStore as noStore } from "next/cache";
import { Good, Ost } from "./definitions";
import { db } from "@/db";
import {
  branch,
  cert,
  certPayment,
  classGood,
  classifier,
  good,
  order,
  ost,
  payment,
  user,
} from "@/db/schema";
import { and, eq, inArray, isNull, lt, ne } from "drizzle-orm";

export async function fetchBranches() {
  noStore();

  try {
    const branches = await db.query.branch.findMany({
      where: eq(branch.isDeleted, false),
      columns: {
        id: true,
        fbId: true,
      },
    });

    return branches;
  } catch (error) {
    console.error("Database Error:", error);
    return { message: "Ошибка при получении списка филиалов" };
  }
}

export async function getOsts(branchId: number) {
  noStore();

  try {
    const osts = await db.query.ost.findMany({
      where: and(eq(ost.branchId, branchId), eq(ost.isDeleted, false)),
      columns: {
        id: true,
        uQntOst: true,
        fixPriceValue: true,
        priceRoznWNDS: true,
        naklDataId: true,
      },
      with: {
        good: {
          columns: {
            regId: true,
          },
        },
      },
    });

    return osts;
  } catch (error) {
    console.error("Database Error:", error);
    return { message: "Ошибка при получении остатков" };
  }
}

export async function getDbGoods() {
  noStore();

  try {
    const dbGoods = await db.query.good.findMany({
      columns: { id: true, regId: true },
      with: {
        osts: {
          columns: {
            id: true,
            naklDataId: true,
            uQntOst: true,
            fixPriceValue: true,
            priceRoznWNDS: true,
            nds: true,
            uQntRez: true,
            brakLS: true,
          },
        },
      },
    });

    const transformed = dbGoods.map(({ osts, ...g }) => ({
      ...g,
      ost: osts,
    }));

    return transformed;
  } catch (error) {
    console.error("Database Error:", error);
    return { message: "Ошибка при получении товаров" };
  }
}

export async function updateOst(id: number, fbOst: Ost) {
  try {
    const updatedOsts = await db
      .update(ost)
      .set({
        uQntOst: fbOst.uQntOst,
        fixPriceValue: fbOst.fixPriceValue,
        priceRoznWNDS: fbOst.priceRoznWNDS,
        nds: fbOst.nds,
        uQntRez: fbOst.uQntRez,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(ost.id, id))
      .returning();

    return updatedOsts[0];
  } catch (error) {
    return { message: "Ошибка при обновлении товаров" };
  }
}

export async function createGood(fbGood: Good) {
  try {
    const createdGoods = await db
      .insert(good)
      .values({
        regId: fbGood.regId,
        drugId: fbGood.drugId,
        formId: fbGood.formId,
        fabrId: fbGood.fabrId,
        mnnId: fbGood.mnnId,
        drug: fbGood.drug,
        form: fbGood.form,
        fabr: fbGood.fabr,
        mnn: fbGood.mnn,
        flag: fbGood.flag,
        ean: fbGood.ean,
        isVital: fbGood.isVital,
        isService: fbGood.isService,
        rSum: fbGood.rSum,
        fullName: `${fbGood.drug} ${fbGood.form}`,
        contentText: `${fbGood.drug} ${fbGood.form}`,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      })
      .returning();

    return createdGoods[0];
  } catch (error) {
    return { message: "Ошибка при создании товара" };
  }
}

export async function createOst(goodId: number, branchId: number, fbOst: Ost) {
  try {
    const createdOsts = await db
      .insert(ost)
      .values({
        goodId: goodId,
        branchId: branchId,
        naklDataId: fbOst.naklDataId,
        uQntOst: fbOst.uQntOst,
        priceRoznWNDS: fbOst.priceRoznWNDS,
        fixPriceValue: fbOst.fixPriceValue,
        jv: fbOst.jv,
        brakLS: fbOst.brakLS,
        isAptekaRu: fbOst.isAptekaRu,
        isPersonalOrder: fbOst.isPersonalOrder,
        recipe: fbOst.recipe,
        uQntRez: fbOst.uQntRez,
        nds: fbOst.nds,
        srokG: fbOst.srokG,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      })
      .returning();

    return createdOsts[0];
  } catch (error) {
    return { message: "Ошибка при создании остатка" };
  }
}

export async function deleteOsts(goodId: number) {
  try {
    await db.delete(ost).where(eq(ost.goodId, goodId));
  } catch (error) {
    return { message: "Ошибка при удалении остатков" };
  }
}

export async function deleteOstsByIds(ids: number[]) {
  try {
    await db.delete(ost).where(inArray(ost.id, ids));
  } catch (error) {
    return { message: "Ошибка при удалении остатков" };
  }
}

export async function fetchOrders(branchId: number, phones: string[]) {
  noStore();

  try {
    const users = await db.query.user.findMany({
      where: and(inArray(user.phone, phones), eq(user.isDeleted, false)),
      columns: { id: true },
    });

    if (users.length === 0) return [];

    const dbOrders = await db.query.order.findMany({
      where: and(
        eq(order.isDeleted, false),
        eq(order.branchId, branchId),
        inArray(
          order.userId,
          users.map((user) => user.id)
        )
      ),
      columns: { id: true, fbId: true, status: true },
    });

    return dbOrders;
  } catch (error) {
    return { message: "Ошибка при загрузки заказов" };
  }
}

export async function updateOrder(id: number, status: string) {
  try {
    const updatedOrders = await db
      .update(order)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(order.id, id))
      .returning();

    return updatedOrders[0];
  } catch (error) {
    return { message: "Ошибка при обновлении заказа" };
  }
}

export async function deleteOrder(id: number) {
  try {
    const deletedOrders = await db
      .update(order)
      .set({
        isDeleted: true,
        updatedAt: new Date(),
      })
      .where(eq(order.id, id))
      .returning();

    return deletedOrders[0];
  } catch (error) {
    return { message: "Ошибка при удалении заказа" };
  }
}

export async function getDbCerts() {
  noStore();

  try {
    const certs = await db.query.cert.findMany({
      where: eq(cert.isDeleted, false),
      columns: { id: true, number: true, status: true, nominal: true },
    });

    return certs;
  } catch (error) {
    return { message: "Ошибка при получении сертификатов" };
  }
}

export async function updateCert(id: number, nominal: number, status: number) {
  try {
    const updatedCerts = await db
      .update(cert)
      .set({ status, nominal, updatedAt: new Date().toISOString() })
      .where(eq(cert.id, id))
      .returning();

    return updatedCerts[0];
  } catch (error) {
    return { message: "Ошибка при обновлении сертификата" };
  }
}

export async function getDbOrders() {
  noStore();

  try {
    const orders = await db.query.order.findMany({
      where: eq(order.isDeleted, false),
      columns: { id: true, fbId: true, status: true, version: true },
    });

    return orders;
  } catch (error) {
    return { message: "Ошибка при получении заказов" };
  }
}

export async function getDbPayments() {
  noStore();

  try {
    const payments = await db.query.payment.findMany({
      where: eq(payment.isDeleted, false),
      columns: { id: true, ykId: true, status: true },
    });

    return payments;
  } catch (error) {
    return { message: "Ошибка при получении платежей" };
  }
}

export async function getDbCertPayments() {
  noStore();

  try {
    const certPayments = await db.query.certPayment.findMany({
      where: eq(certPayment.isDeleted, false),
      columns: { id: true, ykId: true, status: true },
    });

    return certPayments;
  } catch (error) {
    return { message: "Ошибка при получении платежей сертификатов" };
  }
}

export async function updatePayment(id: number, status: string) {
  try {
    const updatedPayments = await db
      .update(payment)
      .set({ status, updatedAt: new Date() })
      .where(eq(payment.id, id))
      .returning();

    return updatedPayments[0];
  } catch (error) {
    return { message: "Ошибка при обновлении платежа" };
  }
}

export async function updateCertPayment(id: number, status: string) {
  try {
    const updatedCertPayments = await db
      .update(certPayment)
      .set({ status, updatedAt: new Date().toISOString() })
      .where(eq(certPayment.id, id))
      .returning();

    return updatedCertPayments[0];
  } catch (error) {
    return { message: "Ошибка при обновлении платежа сертификата" };
  }
}

export async function getCerts() {
  noStore();

  try {
    const certs = await db.query.cert.findMany({
      where: eq(cert.isDeleted, false),
      columns: { id: true, number: true, status: true, isPaid: true },
      with: {
        user: {
          columns: { name: true },
        },
        certPayments: {
          where: eq(certPayment.isDeleted, false),
          columns: { id: true, status: true },
        },
      },
    });

    const transformed = certs.map(({ certPayments, ...c }) => ({
      ...c,
      payments: certPayments,
    }));

    return transformed;
  } catch (error) {
    return { message: "Ошибка при получении сертификатов" };
  }
}

export async function updateCertIsPaid(id: number, isPaid: boolean) {
  try {
    const updatedCerts = await db
      .update(cert)
      .set({ isPaid, updatedAt: new Date().toISOString() })
      .where(eq(cert.id, id))
      .returning();

    return updatedCerts[0];
  } catch (error) {
    return { message: "Ошибка при обновлении сертификата" };
  }
}

export async function updateCertStatus(id: number, status: number) {
  try {
    const updatedCerts = await db
      .update(cert)
      .set({ status, updatedAt: new Date().toISOString() })
      .where(eq(cert.id, id))
      .returning();

    return updatedCerts[0];
  } catch (error) {
    return { message: "Ошибка при обновлении сертификата" };
  }
}

export async function getDbClassifiers() {
  noStore();

  try {
    const classifiers = await db.query.classifier.findMany({
      columns: { id: true, title: true },
      with: {
        classGoods: {
          with: {
            good: {
              columns: {
                id: true,
                regId: true,
              },
            },
          },
        },
      },
    });

    const transformed = classifiers.map(({ classGoods, ...c }) => ({
      ...c,
      classgoods: classGoods,
    }));

    return transformed;
  } catch (err) {
    return { message: "Ошибка при получении классификаторов" };
  }
}

export async function getGoods(ids: number[]) {
  noStore();

  try {
    const goods = await db.query.good.findMany({
      where: and(eq(good.isDeleted, false), inArray(good.regId, ids)),
      columns: { id: true },
    });

    return goods;
  } catch (err) {
    return { message: "Ошибка при получении товаров" };
  }
}

export async function createClassifier(
  id: number,
  title: string,
  goodIds: number[]
) {
  try {
    await db.transaction(async (tx) => {
      const created = await tx
        .insert(classifier)
        .values({ id, title })
        .returning();

      await tx.insert(classGood).values(
        goodIds.map((id) => ({
          classId: created[0].id,
          goodId: id,
        }))
      );
    });

    return { success: true };
  } catch (err) {
    return { message: "Ошибка при создании классификатора" };
  }
}

export async function getGoodsToAdd(ids: number[]) {
  noStore();

  try {
    const goodsToAdd = await db.query.good.findMany({
      where: and(eq(good.isDeleted, false), inArray(good.regId, ids)),
      columns: { id: true },
    });

    return goodsToAdd;
  } catch (err) {
    return { message: "Ошибка при получении товаров" };
  }
}

export async function addClassGoods(id: number, goodIds: number[]) {
  try {
    await db.insert(classGood).values(
      goodIds.map((goodId) => ({
        classId: id,
        goodId,
      }))
    );

    return { success: true };
  } catch (err) {
    return { message: "Ошибка при обновлении классификатора" };
  }
}

export async function deleteClassGoods(classId: number, goodIds: number[]) {
  try {
    await db
      .delete(classGood)
      .where(
        and(eq(classGood.classId, classId), inArray(classGood.goodId, goodIds))
      );

    return { success: true };
  } catch (err) {
    return { message: "Ошибка при удалении товаров из классификатора" };
  }
}

export async function deleteClassifiers(ids: number[]) {
  try {
    await db.transaction(async (tx) => {
      await tx.delete(classGood).where(inArray(classGood.classId, ids));
      await tx.delete(classifier).where(inArray(classifier.id, ids));
    });

    return { success: true };
  } catch (err) {
    return { message: "Ошибка при удалении классификатора" };
  }
}

export async function getDbOrdersWithStatuses() {
  noStore();

  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

  try {
    const orders = await db.query.order.findMany({
      where: and(
        eq(order.isDeleted, false),
        eq(order.status, "Собираем заказ"),
        isNull(order.addressId),
        ne(order.paymentType, "card"),
        lt(order.createdAt, fifteenMinutesAgo)
      ),
      columns: { id: true, status: true, userId: true },
    });

    const cardOrders = await db.query.order.findMany({
      where: and(
        eq(order.isDeleted, false),
        eq(order.status, "Собираем заказ"),
        isNull(order.addressId),
        eq(order.paymentType, "card"),
        lt(order.createdAt, fifteenMinutesAgo)
      ),
      columns: { id: true, status: true, userId: true },
      with: {
        payments: {
          columns: { id: true, status: true },
        },
      },
    });

    const filteredOrders = cardOrders.filter((o) =>
      o.payments.some((p) => p.status === "paid")
    );

    return [...orders, ...filteredOrders];
  } catch (error) {
    return { message: "Ошибка при получении заказов" };
  }
}

export async function updateOrderStatus(id: number, status: string) {
  try {
    await db
      .update(order)
      .set({ status, updatedAt: new Date() })
      .where(eq(order.id, id));

    return { success: true };
  } catch (error) {
    return { message: "Ошибка при обновлении статуса заказа" };
  }
}
