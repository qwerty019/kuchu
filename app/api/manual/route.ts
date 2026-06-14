export const dynamic = "force-dynamic"; // defaults to auto

import { handleUpdate } from "@/lib/cron/update";
import { handleOrders } from "@/lib/cron/orders";
import { handlePayments } from "@/lib/cron/payments";
import { handleCerts } from "@/lib/cron/certs";
import { handleClassifiers } from "@/lib/cron/classifiers";
//import { handleStatuses } from "@/lib/cron/statuses";

export async function GET() {
  try {
    const update = await handleUpdate();
    console.log(update);
    if ("message" in update) {
      return Response.json(update, { status: 500 });
    }

    const orders = await handleOrders();
    console.log(orders);
    if ("message" in orders) {
      return Response.json(orders, { status: 500 });
    }

    const payments = await handlePayments();
    console.log(payments);
    if ("message" in payments) {
      return Response.json(payments, { status: 500 });
    }

    const certs = await handleCerts();
    console.log(certs);
    if ("message" in certs) {
      return Response.json(certs, { status: 500 });
    }

    const classifiers = await handleClassifiers();
    console.log(classifiers);
    if ("message" in classifiers) {
      return Response.json(classifiers, { status: 500 });
    }

    // const statuses = await handleStatuses();
    // console.log(statuses);
    // if ("message" in statuses) {
    //   return Response.json(statuses, { status: 500 });
    // }

    return Response.json(
      // { update, orders, payments, certs, classifiers, statuses },
      { status: 200 }
      
    );
  } catch (err) {
    console.log(err);
    return Response.json(
      { message: "Что-то пошло не так. Повторите еще." },
      { status: 500 }
    );
  }
}
