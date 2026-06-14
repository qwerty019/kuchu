export const dynamic = "force-dynamic";

import { updateCard } from "@/lib/db/discountcard/actions";
import { updateDiscountCard } from "@/lib/farmbazis/actions";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const id = searchParams.get("id");
  const barcode = searchParams.get("barcode");
  const distract = searchParams.get("distract");

  if (!id || !barcode || !distract) {
    return Response.json(
      { message: "Параметры запроса не найдены." },
      { status: 400 }
    );
  }

  try {
    const fbCard = await updateDiscountCard(barcode, 2, Number(distract));
    if ("message" in fbCard) {
      return Response.json({ message: fbCard.message }, { status: 500 });
    }

    const action = await updateCard(Number(id), Number(distract));
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
