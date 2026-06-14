export const dynamic = "force-dynamic";

import { db } from "@/db";
import { filterOption } from "@/db/schema";
import { asc, eq, ilike } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");
  const page = searchParams.get("page");
  const limit = searchParams.get("limit");
  const id = searchParams.get("id");

  if (!page || !limit) {
    return Response.json(
      { message: "Параметры запроса не найдены." },
      { status: 400 }
    );
  }

  const results = [];

  try {
    if (id) {
      const option = await db.query.filterOption.findFirst({
        where: eq(filterOption.id, Number(id)),
        columns: { id: true, value: true },
        with: {
          filter: {
            columns: {
              title: true,
            },
          },
        },
      });

      if (option) {
        results.push({
          value: option.id.toString(),
          label: option.value,
          desc: option.filter.title,
        });
      }
    }

    const options = await db.query.filterOption.findMany({
      where: query ? ilike(filterOption.value, `%${query}%`) : undefined,
      orderBy: [asc(filterOption.value)],
      limit: Number(limit),
      offset: (Number(page) - 1) * Number(limit),
      columns: { id: true, value: true },
      with: {
        filter: {
          columns: {
            title: true,
          },
        },
      },
    });

    for (const o of options) {
      const found = results.find((r) => r.value === o.id.toString());

      if (found) continue;

      results.push({
        value: o.id.toString(),
        label: o.value,
        desc: o.filter.title,
      });
    }

    return Response.json(results, { status: 200 });
  } catch (err) {
    console.log(err);
    return Response.json(
      { message: "Что-то пошло не так. Повторите еще." },
      { status: 500 }
    );
  }
}
