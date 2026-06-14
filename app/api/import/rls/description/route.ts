export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";
import { parseRlsHtml } from "@/lib/rls";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const desc_id = searchParams.get("desc_id");

  if (!desc_id) {
    return Response.json({ message: "ID описания не указан" }, { status: 400 });
  }

  try {
    const data = await getDescription(Number(desc_id));

    if (typeof data === "object" && "message" in data) {
      return Response.json({ message: data.message }, { status: 400 });
    }

    const parsed = parseRlsHtml(data);

    return Response.json(parsed, { status: 200 });
  } catch (err) {
    console.log(err);
    return Response.json(
      { message: "Что-то пошло не так. Повторите еще." },
      { status: 500 }
    );
  }
}

async function getDescription(desc_id: number) {
  const user = process.env.RLS_USER;
  const password = process.env.RLS_PASSWORD;

  const token = Buffer.from(`${user}:${password}`).toString("base64");

  try {
    const response = await fetch(
      `https://rls-aurora.ru/api/library_solid_description?desc_id=${desc_id}&pics_on=1`,
      { headers: { Authorization: `Basic ${token}` } }
    );

    if (!response.ok) {
      if (response.status === 401) {
        return { message: "Неверный логин или пароль" };
      }

      if (response.status === 404) {
        return { message: "Описание не найдено" };
      }

      const data: { Message: string } = await response.json();

      throw new Error(data.Message || "Что-то пошло не так. Повторите еще.");
    }

    const data = await response.text();

    return data;
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      return { message: err.message };
    }

    return { message: "Что-то пошло не так. Повторите еще." };
  }
}
