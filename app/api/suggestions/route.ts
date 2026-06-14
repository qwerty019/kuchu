export const dynamic = "force-dynamic";

import { getSuggestionsByQuery } from "@/lib/db/suggestion/data";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");

  if (!query) {
    return Response.json(
      { message: "Поле поиска не может быть пустым." },
      { status: 400 }
    );
  }

  try {
    const suggestions = await getSuggestionsByQuery(query);

    return Response.json(suggestions, { status: 200 });
  } catch (err) {
    console.log(err);
    return Response.json(
      { message: "Что-то пошло не так. Повторите еще." },
      { status: 500 }
    );
  }
}
