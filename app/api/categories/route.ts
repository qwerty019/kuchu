export const dynamic = "force-dynamic";

import { searchCategories } from "@/lib/db/category/data";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");
  const page = searchParams.get("page");
  const limit = searchParams.get("limit");

  if (!page || !limit) {
    return Response.json(
      { message: "Параметры запроса не найдены." },
      { status: 400 }
    );
  }

  try {
    const data = await searchCategories({
      page,
      limit,
      query: query || undefined,
    });

    return Response.json(data, { status: 200 });
  } catch (err) {
    console.log(err);
    return Response.json(
      { message: "Что-то пошло не так. Повторите еще." },
      { status: 500 }
    );
  }
}
