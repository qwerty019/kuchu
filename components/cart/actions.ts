"use server";

import { createNewPayment, sendOrderEmail } from "@/lib/actions";
import { User, validateRequest } from "@/lib/auth";
import { createNewOrder } from "@/lib/db/order/actions";
import { createDbPayment } from "@/lib/db/payment/actions";
import { createOrderFb } from "@/lib/farmbazis/actions";
import { CartItemState } from "@/stores/cart-store";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { Info } from "./definitions";
import { Address } from "@/lib/db/address/schema";
import {
  getDeliveryData,
  getDiscounts,
  getSelectedBranch,
} from "@/lib/db/order/helpers";
import { fetchCurrentOrders } from "@/lib/db/order/data";
import { parsePhoneNumber } from "libphonenumber-js/mobile";

type Branch = {
  title: string;
  id: number;
  fbId: number | null;
};

const orderStatusMail = process.env.ORDER_STATUS_MAIL;

export async function newOrder(
  items: CartItemState[],
  info: Info,
  method: string | null,
  branchId: string | null
) {
  try {
    const { user } = await validateRequest();

    if (!user || !user.phone) {
      return { message: "Войдите в ваш аккаунт и сделайте заказ." };
    }

    if (!method || !branchId) {
      return { message: "Выберите способ заказа." };
    }

    const filtered = items.filter((i) => i.qnt > 0 && !i.disabled);

    if (filtered.length === 0) {
      return { message: "Все товары не доступны для заказа." };
    }

    const arr = [info.useCard, info.promo, info.cert];
    const discounts = arr.filter(Boolean);

    if (discounts.length > 1) {
      return { message: "Можно использовать только один метод скидки." };
    }

    if (info.useCard) {
      return { message: "Использование бонусных карт пока недоступно." };
    }

    const sum = filtered.reduce((t, ci) => {
      const item = ci.qnts?.reduce((ip, qi) => ip + qi.price * qi.added, 0);
      return t + item;
    }, 0);

    const rightSum = parseFloat(sum.toFixed(2));

    const { amount, percent } = await getDiscounts(user.id, info);

    const distract = amount ? amount : percent ? rightSum * (percent / 100) : 0;
    const distracted = distract > rightSum ? 0 : rightSum - distract;

    const client = `Тел: ${
      info.value === "someone" ? `${info.contact} - заказ другому` : user.phone
    }, ID: ${user.id}`;

    if (method === "delivery") {
      const { address, branch, zone } = await getDeliveryData(user.id);

      if (rightSum < zone.threshold) {
        return { message: `Минимальная сумма заказа ${zone.threshold} ₽.` };
      }

      const delivery = rightSum < zone.freeDelivery ? zone.price : 0;
      const allSum = parseFloat((distracted + delivery).toFixed(2));

      const comment = getComment(
        method,
        info,
        branch,
        distracted,
        distract,
        delivery,
        address
      );

      const body = getBody({
        info,
        filtered,
        user,
        comment,
        isDelivery: true,
        distracted: distracted,
        certAmount: amount,
      });

      if (info.payment === "none" || info.payment === "cash" || allSum <= 0) {
        const fbOrder = await createOrderFb(branch.fbId, body);

        if ("message" in fbOrder) {
          return { message: fbOrder.message };
        }

        const order = await createNewOrder({
          body: {
            fbId: fbOrder.MadeToOrderTitleID,
            userId: Number(user.id),
            branchId: Number(branchId),
            addressId: address?.id,
            deliveryFee: zone.price,
            deliveryTime: `${info.date === "today" ? "сегодня" : "завтра"} ${info.time}`,
            sum: rightSum,
            allSum,
            paymentType: info.payment,
            body: JSON.stringify(body),
            version: 2,
          },
          items,
        });

        if ("message" in order) {
          return { message: order.message };
        }

        await sendOrderEmail({
          email: orderStatusMail,
          title: `Заказ на доставку №${fbOrder.MadeToOrderTitleID}`,
          text:
            "Можете начинать собирать заказ, не забудьте актуализировать статус заказа. " +
            client +
            ", " +
            comment,
        });

        const orders = await fetchCurrentOrders(user.id);

        revalidatePath("/", "layout");

        return { success: true, orders };
      }

      const order = await createNewOrder({
        body: {
          fbId: null,
          userId: Number(user.id),
          branchId: Number(branchId),
          addressId: address?.id,
          deliveryFee: zone.price,
          deliveryTime: `${info.date === "today" ? "сегодня" : "завтра"} ${info.time}`,
          sum: rightSum,
          allSum,
          paymentType: info.payment,
          body: JSON.stringify(body),
          version: 2,
        },
        items,
      });

      if ("message" in order) {
        return { message: order.message };
      }

      const payment = await createNewPayment({
        value: allSum,
        phone: user.phone,
        dbOrderId: order.id,
      });

      if ("message" in payment) {
        return { message: payment.message };
      }

      const dbPayment = await createDbPayment({
        body: {
          orderId: order.id,
          userId: Number(user.id),
          status: payment.status,
          ykId: payment.id,
          url: payment.confirmation.confirmation_url || null,
          token: payment.confirmation.confirmation_token,
          amount: allSum,
        },
      });

      if ("message" in dbPayment) {
        return { message: dbPayment.message };
      }

      revalidatePath("/", "layout");

      return {
        token: payment.confirmation.confirmation_token,
        orderId: order.id,
      };
    }

    const branch = await getSelectedBranch(Number(branchId));

    const allSum = parseFloat(distracted.toFixed(2));

    const comment = getComment(method, info, branch, distracted, distract);

    const body = getBody({
      info,
      filtered,
      user,
      comment,
      isDelivery: false,
      distracted: allSum,
      certAmount: amount,
    });

    if (info.payment === "none" || info.payment === "cash" || allSum <= 0) {
      const fbOrder = await createOrderFb(branch.fbId, body);

      if ("message" in fbOrder) {
        return { message: fbOrder.message };
      }

      const order = await createNewOrder({
        body: {
          fbId: fbOrder.MadeToOrderTitleID,
          userId: Number(user.id),
          branchId: Number(branchId),
          deliveryTime: `${info.date === "today" ? "сегодня" : "завтра"} ${info.time}`,
          sum: rightSum,
          allSum,
          paymentType: info.payment,
          body: JSON.stringify(body),
          version: 2,
          addressId: null,
          deliveryFee: null,
        },
        items,
      });

      if ("message" in order) {
        return { message: order.message };
      }

      await sendOrderEmail({
        email: orderStatusMail,
        title: `Заказ на самовывоз №${fbOrder.MadeToOrderTitleID}`,
        text:
          "Можете начинать собирать заказ, не забудьте актуализировать статус заказа. " +
          client +
          ", " +
          comment,
      });

      revalidatePath("/", "layout");

      const orders = await fetchCurrentOrders(user.id);

      return { success: true, orders };
    }

    const order = await createNewOrder({
      body: {
        fbId: null,
        userId: Number(user.id),
        branchId: Number(branchId),
        deliveryTime: `${info.date === "today" ? "сегодня" : "завтра"} ${info.time}`,
        sum: rightSum,
        allSum,
        paymentType: info.payment,
        body: JSON.stringify(body),
        version: 2,
        addressId: null,
        deliveryFee: null,
      },
      items,
    });

    if ("message" in order) {
      return { message: order.message };
    }

    const payment = await createNewPayment({
      value: allSum,
      phone: user.phone,
      dbOrderId: order.id,
    });

    if ("message" in payment) {
      return { message: payment.message };
    }

    const dbPayment = await createDbPayment({
      body: {
        orderId: order.id,
        userId: Number(user.id),
        status: payment.status,
        ykId: payment.id,
        url: payment.confirmation.confirmation_url || null,
        token: payment.confirmation.confirmation_token,
        amount: allSum,
      },
    });

    if ("message" in dbPayment) {
      return { message: dbPayment.message };
    }

    revalidatePath("/", "layout");

    return {
      token: payment.confirmation.confirmation_token,
      orderId: order.id,
    };
  } catch (error) {
    return {
      message:
        error instanceof Error
          ? error.message
          : "Что-то пошло не так. Повторите еще.",
    };
  }
}

const list = [
  { value: "none", label: "Картой при получении" },
  { value: "cash", label: "Наличными" },
  { value: "card", label: "Картой на сайте" },
];

function getComment(
  method: string,
  info: Info,
  branch: Branch,
  distracted: number,
  distract: number,
  delivery?: number,
  address?: Address
) {
  const found = list.find((p) => p.value === info.payment);
  const payment = found?.label || "Неизвестно";
  const date = info.date === "today" ? "сегодня" : "завтра";
  const baseComment = `Сумма: ${distracted}р, Платеж: ${payment}`;
  const discountComment = distract ? `Скидка: ${distract}р` : "";
  const someoneComment = info.value === "someone" ? "Заказ другому" : "";
  const banknote = info.payment === "cash" ? `Купюра: ${info.banknote}р` : "";
  const additionalInfo = [
    info.useCard && "Бонусная карта",
    info.cert && `Сертификат: ${info.cert}`,
    info.promo && `Промокод: ${info.promo}`,
    banknote,
  ]
    .filter(Boolean)
    .join(", ");

  if (method === "delivery") {
    return [
      baseComment,
      `Адрес: ${getFullAddress(address)}`,
      `Время: ${date} ${info.time}`,
      `Доставка: ${delivery}р`,
      discountComment,
      someoneComment,
      additionalInfo,
    ]
      .filter(Boolean)
      .join(", ");
  }

  return [
    baseComment,
    `Самовывоз: ${branch.title}`,
    discountComment,
    additionalInfo,
  ]
    .filter(Boolean)
    .join(", ");
}

function getFullAddress(addr: Address | undefined) {
  if (!addr) return "";

  const { address, entrance, floor, apartment, comment } = addr;

  let all = address;

  if (entrance) all += `, П: ${entrance}`;
  if (floor) all += `, Э: ${floor}`;
  if (apartment) all += `, К: ${apartment}`;
  if (comment) all += `, Км: ${comment}`;

  return all;
}

// function getCompleteComment(info: Info, branch: Branch, address?: Address) {
//   let comment = "Спасибо! ";

//   if (address) {
//     const time = info.time.split(" - ")[1];
//     const date = info.date === "today" ? "сегодня" : "завтра";
//     comment += `Доставим заказ ${date} до ${time} по адресу ${address.address}`;
//   } else {
//     comment += `Заберите заказ в аптеке по адресу ${branch.title}`;
//   }

//   return comment;
// }

function getBody({
  info,
  filtered,
  user,
  comment,
  isDelivery,
  certAmount,
  distracted,
}: {
  info: Info;
  filtered: CartItemState[];
  user: User;
  comment: string;
  isDelivery: boolean;
  certAmount: number | null;
  distracted: number;
}) {
  let phoneNumber: string | null = null;

  try {
    const phone = info.value === "someone" ? info.contact : user.phone;

    if (!phone) {
      throw new Error("Неправильный номер телефона.");
    }

    const parsed = parsePhoneNumber(phone, "RU");

    if (parsed.country !== "RU" || !parsed.isValid()) {
      throw new Error("Неправильный номер телефона.");
    }

    phoneNumber = parsed.number;
  } catch (err) {
    throw new Error("Неправильный номер телефона.");
  }

  if (!phoneNumber) {
    throw new Error("Неправильный номер телефона.");
  }

  const body = {
    prod: filtered.flatMap((i) => {
      if (!i.qnts || i.qnts.length === 0) {
        return [{ regId: i.regId, price: 0, qnt: i.qnt }];
      }

      return i.qnts
        .filter((qnt) => qnt.added > 0)
        .map((qnt) => {
          const rightPrice = parseFloat(qnt.price.toFixed(2));

          return {
            regId: i.regId,
            price: rightPrice,
            qnt: qnt.added,
          };
        });
    }),
    phoneNumber: phoneNumber,
    client: `Тел: ${
      info.value === "someone" ? info.contact : user.phone
    }, ID: ${user.id}`.trim(),
    comment,
    // datereserv: new Date().toLocaleString("sv"),
    orderType: 1,
    isDelivery: isDelivery ? "1" : "0",
    prepay: info.payment === "card" ? distracted : 0,
    ...(info.cert && {
      certNumber: info.cert,
      certAmount: certAmount,
    }),
  };

  return body;
}

export async function getPrevBranch() {
  const prev = cookies().get("prevBranch");
  if (!prev) return null;
  return prev.value;
}
