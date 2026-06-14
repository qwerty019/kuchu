"use server";

//import pusher from "../pusher-server";
import { getDbOrdersWithStatuses, updateOrderStatus } from "./db";

// export async function handleStatuses() {
//   const start = getCurrentTime();
//   const orderCount: UpdateCount = {
//     updated: 0,
//   };

//   const orders = await getDbOrdersWithStatuses();

//   if ("message" in orders) {
//     return { message: orders.message };
//   }

//   for (const order of orders) {
//     const result = await updateOrderStatus(order.id, "Готово к выдаче");

//     if ("message" in result) {
//       return { message: result.message };
//     }

//     orderCount.updated++;

//     pusher.trigger(`user-${order.userId}`, "order-updated", {
//       id: order.id,
//       status: "Готово к выдаче",
//     });
//   }

//   const message = {
//     start,
//     end: getCurrentTime(),
//     orders: orders.length,
//     orderCount,
//   };

//   return message;
// }

function getCurrentTime() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
}

interface UpdateCount {
  updated: number;
}
