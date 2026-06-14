"use server";

import { db } from "@/db";
import { certOption } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { unstable_noStore as noStore } from "next/cache";
import { CertOption } from "./schema";

export async function fetchCertOptions() {
  noStore();

  try {
    const certs = await db.query.certOption.findMany({
      orderBy: [asc(certOption.nominal)],
      columns: {
        id: true,
        title: true,
        nominal: true,
        url: true,
        show: true,
      },
    });

    return certs satisfies CertOption[];
  } catch (error) {
    throw new Error("Ошибка при загрузке сертификатов");
  }
}

export async function fetchShowedCertOptions() {
  noStore();

  try {
    const certs = await db.query.certOption.findMany({
      where: eq(certOption.show, true),
      orderBy: [asc(certOption.nominal)],
      columns: {
        id: true,
        title: true,
        url: true,
        nominal: true,
        show: true,
      },
    });

    return certs satisfies CertOption[];
  } catch (error) {
    throw new Error("Ошибка при загрузке сертификатов");
  }
}
