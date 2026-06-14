export const dynamic = "force-dynamic";

import { validateRequest } from "@/lib/auth";
import { getGoodWithContents, getGoodWithFilters } from "@/lib/db/good/data";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type");

  const { user } = await validateRequest();

  if (!user) {
    return Response.json({ message: "Not authorized" }, { status: 401 });
  }

  if (!user.roles?.includes("admin")) {
    return Response.json({ message: "Not authorized" }, { status: 403 });
  }

  try {
    if (type === "contents") {
      const good = await getGoodWithContents(Number(id));

      return Response.json(good, { status: 200 });
    }

    if (type === "filters") {
      const good = await getGoodWithFilters(Number(id));

      return Response.json(good, { status: 200 });
    }

    return Response.json(null, { status: 200 });
  } catch (err) {
    console.log(err);
    return Response.json(
      { message: "Что-то пошло не так. Повторите еще." },
      { status: 500 }
    );
  }
}
