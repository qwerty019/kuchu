"use server";

import { getDbOrders, updateOrder } from "./db";
import { getOrders2 } from "./farmbazis";

export async function handleOrders() {
  const start = getCurrentTime();
  const orderCount: UpdateCount = {
    deleted: 0,
    created: 0,
    updated: 0,
    skipped: 0,
  };

  const orders = await getDbOrders();

  if ("message" in orders) {
    return { message: orders.message };
  }

  const ids = orders.map((o) => o.fbId).filter((id) => id !== null);

  if (ids.length === 0) {
    return {
      start,
      end: getCurrentTime(),
      orders: orders.length,
      orderCount,
    };
  }

  const fbOrders = [];
  const size = 500;

  for (let i = 0; i < ids.length; i += size) {
    const idsChunk = ids.slice(i, i + size).join(",");

    const fbOrdersChunk = await getOrders2(idsChunk);
    if ("message" in fbOrdersChunk) {
      return fbOrdersChunk;
    }

    fbOrders.push(...fbOrdersChunk);
  }

  for (const order of orders) {
    const fbOrder = fbOrders.find((o) => o.DocId === order.fbId);
    if (!fbOrder) {
      // const action = await deleteOrder(order.id);

      // if ("message" in action) {
      //   return { message: action.message };
      // }

      orderCount.deleted++;
      continue;
    }

    if (order.version === 1 && order.status !== fbOrder.Status.toString()) {
      const updatedOrder = await updateOrder(
        order.id,
        fbOrder.Status.toString()
      );

      if ("message" in updatedOrder) {
        return { message: updatedOrder.message };
      }

      orderCount.updated++;
      continue;
    }

    orderCount.skipped++;
  }

  const message = {
    start,
    end: getCurrentTime(),
    orders: orders.length,
    orderCount,
  };

  return message;
}

function getCurrentTime() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
}

interface UpdateCount {
  deleted: number;
  created: number;
  updated: number;
  skipped: number;
}
