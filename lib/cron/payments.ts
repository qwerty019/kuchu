"use server";

import {
  getDbCertPayments,
  getDbPayments,
  updateCertPayment,
  updatePayment,
} from "./db";

export async function handlePayments() {
  const start = getCurrentTime();
  const paymentsCount: UpdateCount = {
    deleted: 0,
    created: 0,
    updated: 0,
    skipped: 0,
  };
  const certPaymentsCount: UpdateCount = {
    deleted: 0,
    created: 0,
    updated: 0,
    skipped: 0,
  };

  const items = await getPayments();

  if ("message" in items) {
    return { message: items.message };
  }

  const refunds = await getRefunds();

  if ("message" in refunds) {
    return { message: refunds.message };
  }

  const payments = await getDbPayments();

  if ("message" in payments) {
    return { message: payments.message };
  }

  const certPayments = await getDbCertPayments();

  if ("message" in certPayments) {
    return { message: certPayments.message };
  }

  for (const p of payments) {
    const refund = refunds.find((r) => r.payment_id === p.ykId);

    if (refund && refund.status === "succeeded") {
      if (p.status === "canceled") {
        paymentsCount.skipped++;
        continue;
      }

      const action = await updatePayment(p.id, "canceled");

      if ("message" in action) {
        return { message: action.message };
      }

      paymentsCount.updated++;
      continue;
    }

    const found = items.find((i) => i.id === p.ykId);

    if (!found) {
      continue;
    }

    const status = getStatus(found.status);

    if (status === p.status) {
      paymentsCount.skipped++;
      continue;
    }

    const action = await updatePayment(p.id, status);

    if ("message" in action) {
      return { message: action.message };
    }

    paymentsCount.updated++;
  }

  for (const p of certPayments) {
    const refund = refunds.find((r) => r.payment_id === p.ykId);

    if (refund && refund.status === "succeeded") {
      if (p.status === "canceled") {
        certPaymentsCount.skipped++;
        continue;
      }

      const action = await updateCertPayment(p.id, "canceled");

      if ("message" in action) {
        return { message: action.message };
      }

      certPaymentsCount.updated++;
      continue;
    }

    const found = items.find((i) => i.id === p.ykId);

    if (!found) {
      continue;
    }

    const status = getStatus(found.status);

    if (status === p.status) {
      certPaymentsCount.skipped++;
      continue;
    }

    const action = await updateCertPayment(p.id, status);

    if ("message" in action) {
      return { message: action.message };
    }

    certPaymentsCount.updated++;
  }

  const message = {
    start,
    end: getCurrentTime(),
    payments: payments.length,
    certPayments: certPayments.length,
    paymentsCount,
    certPaymentsCount,
  };

  return message;
}

async function getPayments() {
  let items: any[] = [];
  let cursor = null;

  do {
    const params = new URLSearchParams({
      limit: "100",
    });

    if (cursor) {
      params.append("cursor", cursor);
    }

    const endpoint = "https://api.yookassa.ru/v3/payments";
    const res = await fetch(`${endpoint}?${params}`, {
      headers: {
        Authorization: `Basic ${Buffer.from(
          process.env.YOOKASSA_SHOP_ID + ":" + process.env.YOOKASSA_API_KEY
        ).toString("base64")}`,
      },
    });

    if (!res.ok) {
      console.log(await res.json());
      return { message: "Ошибка при создании платежа" };
    }

    const jsonData = await res.json();

    items = [...items, ...jsonData.items];
    cursor = jsonData.next_cursor;
  } while (cursor);

  return items;
}

async function getRefunds() {
  let items: any[] = [];
  let cursor = null;

  do {
    const params = new URLSearchParams({
      limit: "100",
    });

    if (cursor) {
      params.append("cursor", cursor);
    }

    const endpoint = "https://api.yookassa.ru/v3/refunds";
    const res = await fetch(`${endpoint}?${params}`, {
      headers: {
        Authorization: `Basic ${Buffer.from(
          process.env.YOOKASSA_SHOP_ID + ":" + process.env.YOOKASSA_API_KEY
        ).toString("base64")}`,
      },
    });

    if (!res.ok) {
      console.log(await res.json());
      return { message: "Ошибка при создании платежа" };
    }

    const jsonData = await res.json();

    items = [...items, ...jsonData.items];
    cursor = jsonData.next_cursor;
  } while (cursor);

  return items;
}

function getStatus(status: string) {
  if (status === "waiting_for_capture") {
    status = "waiting";
  }

  if (status === "succeeded") {
    status = "paid";
  }

  if (status === "canceled") {
    status = "canceled";
  }

  return status;
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
