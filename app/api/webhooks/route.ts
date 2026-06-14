export const dynamic = "force-dynamic";

import { sendEmail, sendOrderEmail } from "@/lib/actions";
import {
  cancelOrderFb,
  createCertificate,
  createOrderFb,
} from "@/lib/farmbazis/actions";
import { getOrder } from "@/lib/db/order/data";
import { getPayment } from "@/lib/db/payment/data";
import { updatePayment } from "@/lib/db/payment/actions";
import { getSelectedBranch } from "@/lib/db/order/helpers";
import {
  addOrderError,
  connectOrder,
  updateOrder,
} from "@/lib/db/order/actions";
import { updateCertPayment } from "@/lib/db/certPayment/actions";
import { getCert } from "@/lib/db/cert/data";
import { updateCert } from "@/lib/db/cert/actions";
//import pusher from "@/lib/pusher-server";

const orderStatusMail = process.env.ORDER_STATUS_MAIL;

export async function POST(request: Request) {
  const body = await request.json();
  console.log(body);

  const orderId = body?.object?.metadata?.orderId;
  const certId = body?.object?.metadata?.certId;
  const dbOrderId = body?.object?.metadata?.dbOrderId;

  if (!orderId && !certId && !dbOrderId) {
    return Response.json({ message: "ID не найден" }, { status: 404 });
  }

  const paymentId = body?.object?.id as string | undefined;

  if (!paymentId) {
    return Response.json({ message: "ID платежа не найден" }, { status: 404 });
  }

  try {
    if (dbOrderId) {
      const order = await getOrder(Number(dbOrderId));

      if (!order) {
        return Response.json({ message: "Заказ не найден" }, { status: 404 });
      }

      const payment = await getPayment({ ykId: paymentId });

      if (!payment) {
        return Response.json({ message: "Платеж не найден" }, { status: 404 });
      }

      const status = getStatus(body);

      const action = await updatePayment(payment.id, status);

      if ("message" in action) {
        console.log(action);
        return Response.json({ message: action.message }, { status: 400 });
      }

      if (!order.branchId) {
        return Response.json({ message: "Филиал не найден" }, { status: 404 });
      }

      const branch = await getSelectedBranch(order.branchId);

      if (!order.body) {
        return Response.json({ message: "Заказ не найден" }, { status: 404 });
      }

      if (body.event === "payment.succeeded") {
        const parsedBody = JSON.parse(order.body);
        const fbOrder = await createOrderFb(branch.fbId, parsedBody);

        if ("message" in fbOrder) {
          console.log(fbOrder);
          const action = await addOrderError(order.id, fbOrder.message);

          //trigger();

          await sendOrderEmail({
            email: orderStatusMail,
            title: `Заказ №${order.id} оплачен, но не создан в опоре`,
            text:
              "Обратитесть в тех. поддержку с ошибкой, а заказ зафиксируйте вручную в опору. " +
              parsedBody.client +
              ", " +
              parsedBody.comment,
          });

          if ("message" in action) {
            console.log(action);
            return Response.json({ message: action.message }, { status: 400 });
          }

          return Response.json({ message: fbOrder.message }, { status: 400 });
        }

        await sendOrderEmail({
          email: orderStatusMail,
          title: `Заказ №${fbOrder.MadeToOrderTitleID} оплачен картой на сайте`,
          text:
            "Можете начинать собирать заказ, не забудьте актуализировать статус заказа. " +
            parsedBody.client +
            ", " +
            parsedBody.comment,
        });

        if (order.version === 1) {
          const action = await updateOrder(
            order.id,
            "4",
            fbOrder?.MadeToOrderTitleID
          );

          if ("message" in action) {
            console.log(action);
            return Response.json({ message: action.message }, { status: 400 });
          }
        }

        if (order.version === 2) {
          const action = await connectOrder(
            order.id,
            fbOrder.MadeToOrderTitleID
          );

          if ("message" in action) {
            console.log(action);
            //trigger();
            return Response.json({ message: action.message }, { status: 400 });
          }
        }
      }

      if (body.event === "payment.canceled") {
        const parsedBody = JSON.parse(order.body);

        await sendOrderEmail({
          email: orderStatusMail,
          title: `Заказ №${order.id} не оплатили картой на сайте`,
          text:
            "Не забудьте отменить заказ в статусе на сайте. " +
            parsedBody.client +
            ", " +
            parsedBody.comment,
        });

        if (order.version === 1) {
          const action = await updateOrder(order.id, "1");

          if ("message" in action) {
            console.log(action);
            return Response.json({ message: action.message }, { status: 400 });
          }
        }

        if (order.version === 2) {
          const action = await updateOrder(order.id, "Отменен");

          if ("message" in action) {
            console.log(action);
            return Response.json({ message: action.message }, { status: 400 });
          }

          //pusher.trigger(`user-${order.userId}`, "order-updated", {
          //   id: order.id,
          //   status: "Отменен",
          // });
        }
      }

      //trigger();

      return Response.json({ success: true }, { status: 200 });
    }

    if (certId) {
      const cert = await getCert(certId);

      if (!cert) {
        return Response.json({ message: "Серт не найден" }, { status: 404 });
      }

      const payment = cert.certPayments.find((p) => p.ykId === paymentId);

      if (!payment) {
        return Response.json({ message: "Платеж не найден" }, { status: 404 });
      }

      const status = getStatus(body);

      const action = await updateCertPayment(payment.id, status);

      if ("message" in action) {
        return Response.json({ message: action.message }, { status: 400 });
      }

      if (status !== "paid") {
        return Response.json({ success: true }, { status: 200 });
      }

      const filtered = cert.certBranches.filter((x) => x.branch.fbId !== null);
      const cert_branchs = filtered.map((cb) => cb.branch.fbId);

      const expDate = new Date(cert.expDate)
        .toLocaleDateString("ru-RU", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .replace(/\//g, ".");

      if (cert_branchs.length === 0) {
        return Response.json({ message: "Нет филиалов." }, { status: 400 });
      }

      const fbCert = await createCertificate({
        title: cert.title,
        number: cert.number,
        nominal: cert.nominal,
        expDate,
        cert_branchs: cert_branchs.filter((id): id is number => id !== null),
      });

      if ("message" in fbCert) {
        return Response.json({ message: fbCert.message }, { status: 400 });
      }

      if (fbCert.status !== "0") {
        return Response.json({ message: "Ошибка создания" }, { status: 400 });
      }

      const action2 = await updateCert(cert.id);

      if ("message" in action2) {
        return Response.json({ message: action2.message }, { status: 400 });
      }

      const email = await sendEmail(cert.email, cert.number, cert.nominal);

      if ("message" in email) {
        return Response.json(
          { message: email?.message || "Ошибка при отправке письма." },
          { status: 400 }
        );
      }

      return Response.json({ success: true }, { status: 200 });
    }

    const payment = await getPayment({ ykId: paymentId });

    if (!payment) {
      return Response.json({ message: "Платеж не найден" }, { status: 404 });
    }

    const status = getStatus(body);

    const action = await updatePayment(payment.id, status);

    if ("message" in action) {
      return Response.json({ message: action.message }, { status: 400 });
    }

    const order = await getOrder(orderId);

    if (!order) {
      return Response.json({ message: "Заказ не найден" }, { status: 404 });
    }

    if (body.event === "payment.succeeded") {
      await updateOrder(order.id, "4");
    }

    if (body.event === "payment.canceled") {
      if (!order.fbId) {
        return Response.json(
          { message: "Идентификатор заказа не найден." },
          { status: 404 }
        );
      }

      const cancel = await cancelOrderFb(order.fbId.toString(), "Не оплачено.");
      if ("message" in cancel) {
        return Response.json({ message: cancel.message }, { status: 400 });
      }

      const action = await updateOrder(order.id, "1");

      if ("message" in action) {
        return Response.json({ message: action.message }, { status: 400 });
      }
    }

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({ message: "Что-то пошло не так." }, { status: 500 });
  }
}

function getStatus(body: any): string {
  let status = body.object.status;

  if (body.event === "payment.waiting_for_capture") {
    status = "waiting";
  }

  if (body.event === "payment.succeeded") {
    status = "paid";
  }

  if (body.event === "payment.canceled") {
    status = "canceled";
  }

  if (body.event === "refund.succeeded") {
    status = "refunded";
  }

  return status;
}

// function trigger() {
//   pusher.trigger(`orders`, "order-updated", { reload: "true" });
// }
