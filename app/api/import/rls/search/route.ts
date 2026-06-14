export const dynamic = "force-dynamic";

import { Inventory } from "@/lib/rls";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ean = searchParams.get("ean");
  const drug = searchParams.get("drug");
  const fabr = searchParams.get("fabr");

  if (!ean && !drug) {
    return Response.json(
      { message: "Штрихкод или название товара не указаны" },
      { status: 400 }
    );
  }

  const result = [];

  try {
    if (ean) {
      const eans = ean.split(",").map((ean) => ean.trim());

      for (const ean of eans) {
        const inventory = await getInventory({ pos: ean });
        if ("message" in inventory) {
          result.push({ query: ean, message: inventory.message });
        } else {
          result.push({ query: ean, inventories: inventory });
        }
      }
    }

    if (drug) {
      const inventory = await getInventory({
        pos: drug,
        fabr: fabr ?? undefined,
      });

      if ("message" in inventory) {
        result.push({ query: drug, message: inventory.message });
      } else {
        result.push({ query: drug, inventories: inventory });
      }
    }

    return Response.json(result, { status: 200 });
  } catch (err) {
    console.log(err);
    return Response.json(
      { message: "Что-то пошло не так. Повторите еще." },
      { status: 500 }
    );
  }
}

async function getInventory({
  pos,
  fabr,
}: {
  pos: string;
  fabr?: string;
}): Promise<{ message: string } | Inventory[]> {
  const user = process.env.RLS_GARM_USER;
  const password = process.env.RLS_GARM_PASSWORD;

  const token = Buffer.from(`${user}:${password}`).toString("base64");

  try {
    const response = await fetch(
      `https://rls-aurora.ru/api/inventory_complete?pos=${pos}${fabr ? `&firm=${fabr}` : ""}`,
      { headers: { Authorization: `Basic ${token}` } }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return { message: "Товар не найден" };
      }

      const data: { Message: string } = await response.json();

      throw new Error(data.Message || "Что-то пошло не так. Повторите еще.");
    }

    const data = await response.json();

    return data;
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      return { message: err.message };
    }

    return { message: "Что-то пошло не так. Повторите еще." };
  }
}
