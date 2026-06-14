export const dynamic = "force-dynamic";

import { db } from "@/db";
import { updateCard } from "@/lib/db/discountcard/actions";
import { updateDiscountCard } from "@/lib/farmbazis/actions";
import { and, count, eq, gte, lte } from "drizzle-orm";
import { NextRequest } from "next/server";
import { order, user as userTable } from "@/db/schema";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const userId = searchParams.get("userId");
  const id = searchParams.get("id");
  const barcode = searchParams.get("barcode");
  const rate = searchParams.get("rate");
  const rightSum = searchParams.get("rightSum");

  if (!id || !barcode || !rate || !rightSum || !userId) {
    return Response.json(
      { message: "Параметры запроса не найдены." },
      { status: 400 }
    );
  }

  try {
    const client = await getUser(userId);
    if ("message" in client) {
      return Response.json({ message: client.message }, { status: 500 });
    }

    const count = await getOrders(userId);
    if (typeof count === "object" && "message" in count) {
      return Response.json({ message: count.message }, { status: 500 });
    }

    const isBirthday = client?.dob ? isUserBirthday(client.dob) : false;

    let acc = (Number(rightSum) * Number(rate)) / 100;
    if (isBirthday && count === 0) acc += 150;
    if (Number(rightSum) > 5000) acc += 100;

    const fbCard = await updateDiscountCard(barcode, 1, acc);
    if ("message" in fbCard) {
      return Response.json({ message: fbCard.message }, { status: 500 });
    }

    const action = await updateCard(Number(id), Number(acc), 1);
    if ("message" in action) {
      return Response.json({ message: action.message }, { status: 500 });
    }

    return Response.json({ success: true }, { status: 200 });
  } catch (err) {
    console.log(err);
    return Response.json(
      { message: "Что-то пошло не так. Повторите еще." },
      { status: 500 }
    );
  }
}

async function getUser(id: string | number) {
  try {
    const user = await db.query.user.findFirst({
      where: eq(userTable.id, Number(id)),
      columns: { id: true, dob: true },
    });

    if (!user) {
      return { message: "Пользователь не найден." };
    }

    return user;
  } catch (error) {
    console.log(error);
    return { message: "Что-то пошло не так. Повторите еще." };
  }
}

async function getOrders(id: string | number) {
  const date = new Date().toISOString().split("T")[0];

  try {
    const result = await db
      .select({ count: count(order.id) })
      .from(order)
      .where(
        and(
          eq(order.isDeleted, false),
          eq(order.userId, Number(id)),
          gte(order.createdAt, new Date(date)),
          lte(order.createdAt, new Date(date))
        )
      );

    return result[0].count;
  } catch (error) {
    console.log(error);
    return { message: "Что-то пошло не так. Повторите еще." };
  }
}

function isUserBirthday(dob: Date | string) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "numeric",
    timeZone: "Asia/Yakutsk",
  });

  const now = formatter.formatToParts(new Date());
  const birth = formatter.formatToParts(
    new Date(typeof dob === "string" ? dob : dob.toISOString().split("T")[0])
  );

  const day1 = now.find((part) => part.type === "day");
  const month1 = now.find((part) => part.type === "month");

  const day2 = birth.find((part) => part.type === "day");
  const month2 = birth.find((part) => part.type === "month");

  if (day1?.value === day2?.value && month1?.value === month2?.value) {
    return true;
  }

  return false;
}
