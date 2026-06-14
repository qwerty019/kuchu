"use server";

import { db } from "@/db";
import { and, eq } from "drizzle-orm";
import { cert, certBranch, certPayment } from "@/db/schema";
import { unstable_noStore as noStore } from "next/cache";
import { CertWithBranchesAndPayments, CertWithPayments } from "./schema";

export async function fetchCerts() {
  noStore();

  try {
    const certs = await db.query.cert.findMany({
      where: eq(cert.isDeleted, false),
      columns: {
        id: true,
        title: true,
        nominal: true,
        number: true,
        expDate: true,
        email: true,
        createdAt: true,
        isPaid: true,
        status: true,
      },
      with: {
        certPayments: {
          where: eq(certPayment.isDeleted, false),
          columns: { id: true, status: true, ykId: true },
        },
      },
    });

    return certs satisfies CertWithPayments[];
  } catch (error) {
    console.log(error);
    throw new Error("Что-то пошло не так. Повторите еще.");
  }
}

export async function getCert(number: string) {
  try {
    const found = await db.query.cert.findFirst({
      where: and(eq(cert.isDeleted, false), eq(cert.number, number)),
      columns: {
        id: true,
        title: true,
        nominal: true,
        number: true,
        expDate: true,
        email: true,
        createdAt: true,
        isPaid: true,
        status: true,
      },
      with: {
        certBranches: {
          where: eq(certBranch.isDeleted, false),
          columns: { id: true },
          with: {
            branch: {
              columns: {
                fbId: true,
              },
            },
          },
        },
        certPayments: {
          where: eq(certPayment.isDeleted, false),
          columns: { id: true, ykId: true, status: true },
        },
      },
    });

    if (!found) return null;

    return found satisfies CertWithBranchesAndPayments;
  } catch (err) {
    console.log(err);
    throw new Error("Ошибка при получении сертификата.");
  }
}
