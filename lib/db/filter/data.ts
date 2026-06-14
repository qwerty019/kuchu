"use server";

import { db } from "@/db";
import { filter, filterOption } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { Filter, FilterWithOptions } from "./schema";
import { unstable_noStore as noStore } from "next/cache";

export async function getFilters() {
  noStore();

  try {
    const filters = await db.query.filter.findMany({
      orderBy: [asc(filter.title)],
      columns: { id: true, title: true, type: true },
    });

    return filters satisfies Filter[];
  } catch (err) {
    console.log(err);
    throw new Error("Ошибка при получении фильтров.");
  }
}

export async function getFilterWithOptions({ id }: { id: number }) {
  noStore();

  try {
    const found = await db.query.filter.findFirst({
      where: eq(filter.id, id),
      columns: { id: true, title: true, type: true },
      with: {
        filterOptions: {
          orderBy: [asc(filterOption.value)],
          columns: { id: true, value: true },
        },
      },
    });

    if (!found) return null;

    return {
      ...found,
      options: found.filterOptions,
    } satisfies FilterWithOptions;
  } catch (err) {
    console.log(err);
    throw new Error("Ошибка при получении фильтра.");
  }
}
