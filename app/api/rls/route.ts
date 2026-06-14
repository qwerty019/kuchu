export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";

const token = Buffer.from(
  `${process.env.RLS_GARM_USER}:${process.env.RLS_GARM_PASSWORD}`
).toString("base64");

export type Data = {
  prep_full: string;
  packing_full: string;
  firms: string;
  desc_id: number | null;
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pos = searchParams.get("pos");
  const firm = searchParams.get("firm");

  try {
    const response = await fetch(
      `https://rls-aurora.ru/api/inventory_complete?pos=${pos}&firm=${firm}`,
      { headers: { Authorization: `Basic ${token}` } }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return Response.json({ message: "Товар не найден" }, { status: 404 });
      }

      return Response.json(
        { message: "Что-то пошло не так. Повторите еще." },
        { status: 500 }
      );
    }

    const data: Data[] = await response.json();

    const filteredData = data.filter((item) => item.desc_id !== null);

    if (filteredData.length === 0) {
      return Response.json(
        { message: "Товары с описаниями не найдены." },
        { status: 404 }
      );
    }

    return Response.json(filteredData, { status: 200 });
  } catch (err) {
    console.log(err);
    return Response.json(
      { message: "Что-то пошло не так. Повторите еще." },
      { status: 500 }
    );
  }
}
