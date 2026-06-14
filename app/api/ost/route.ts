export const dynamic = "force-dynamic";

import { db } from "@/db";
import { good } from "@/db/schema";
import { updateOsts } from "@/lib/db/ost/actions";
import { inArray } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const items = searchParams.get("items");
  const branchId = searchParams.get("branchId");
  const fbId = searchParams.get("fbId");

  if (!items || !branchId || !fbId) {
    return Response.json(
      { message: "Параметры запроса не найдены." },
      { status: 400 }
    );
  }

  try {
    const arr = items.split(",").map(Number);

    if (!arr.length) {
      return Response.json({ message: "Не найдены товары." }, { status: 400 });
    }

    const itemsArr = await db.query.good.findMany({
      where: inArray(good.id, arr),
      columns: { id: true, regId: true },
    });

    const branch = { id: Number(branchId), fbId: Number(fbId) };

    await updateOsts(branch, itemsArr);

    return Response.json({ success: true }, { status: 200 });
  } catch (err) {
    console.log(err);
    return Response.json(
      { message: "Что-то пошло не так. Повторите еще." },
      { status: 500 }
    );
  }
}
