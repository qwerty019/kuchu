export const dynamic = "force-dynamic";

import { db } from "@/db";
import { category } from "@/db/schema";
import { and, asc, eq, ilike } from "drizzle-orm";
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
      const found = await db.query.category.findFirst({
        where: eq(category.id, Number(id)),
        columns: {
          id: true,
          title: true,
          position: true,
          url: true,
        },
        with: {
          parent: {
            columns: {
              id: true,
              title: true,
            },
          },
        },
      });

      if (found) {
        results.push({
          value: found.id.toString(),
          label: found.title,
          desc: found.parent?.title,
        });
      }
    }

    const conditions = [eq(category.isDeleted, false)];

    if (query) {
      conditions.push(ilike(category.title, `%${query}%`));
    }

    const categories = await db.query.category.findMany({
      where: and(...conditions),
      orderBy: [asc(category.title)],
      limit: Number(limit),
      offset: (Number(page) - 1) * Number(limit),
      columns: {
        id: true,
        title: true,
        position: true,
        url: true,
      },
      with: {
        parent: {
          columns: {
            id: true,
            title: true,
          },
        },
      },
    });

    for (const c of categories) {
      const found = results.find((r) => r.value === c.id.toString());

      if (found) continue;

      results.push({
        value: c.id.toString(),
        label: c.title,
        desc: c.parent?.title,
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
