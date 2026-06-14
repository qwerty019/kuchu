export const dynamic = "force-dynamic";

import { db } from "@/db";
import { branch, good, ost, sale } from "@/db/schema";
import { Good } from "@/lib/db/good/definitions";
import { getDops } from "@/lib/farmbazis/data";
import { and, asc, eq, gte, inArray, notInArray } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const regIds = searchParams.get("regIds");
  let branchId = searchParams.get("branchId");

  if (!regIds || regIds.split(",").length === 0) {
    return Response.json(
      { message: "Параметры запроса не найдены." },
      { status: 400 },
    );
  }

  try {
    if (!branchId) {
      const mainBranch = await db.query.branch.findFirst({
        where: and(eq(branch.isDeleted, false), eq(branch.main, true)),
        columns: { id: true },
      });

      if (mainBranch) {
        branchId = mainBranch.id.toString();
      }
    }

    if (!branchId) {
      return Response.json(
        { message: "Главный филиал не найден." },
        { status: 400 },
      );
    }

    const selectedSale = await db.query.sale.findFirst({
      where: and(eq(sale.isDeleted, false), eq(sale.selected, true)),
      columns: { id: true },
      with: {
        saleGoods: {
          columns: { goodId: true },
        },
      },
    });

    if (selectedSale) {
      const goods = await db.query.good.findMany({
        where: and(
          eq(good.isDeleted, false),
          eq(good.isHidden, false),
          inArray(
            good.id,
            selectedSale.saleGoods.map((x) => x.goodId),
          ),
        ),
        columns: {
          id: true,
          drugId: true,
          regId: true,
          drug: true,
          form: true,
          img: true,
          title: true,
          subtitle: true,
        },
        with: {
          osts: {
            where: and(
              eq(ost.isDeleted, false),
              gte(ost.uQntOst, 1),
              eq(ost.branchId, Number(branchId)),
            ),
            orderBy: [asc(ost.priceRoznWNDS)],
            columns: {
              branchId: true,
              uQntOst: true,
              recipe: true,
              priceRoznWNDS: true,
              fixPriceValue: true,
              naklDataId: true,
            },
          },
        },
      });

      const filtered = goods
        .filter((x) => x.osts.length > 0)
        .map((g) => ({ ...g, ost: g.osts })) satisfies Good[];

      // If filtered has 9 or more items, randomly pick 9
      let filteredToSend = filtered;

      if (filtered.length >= 9) {
        // shuffle filtered array and take the first 9
        filteredToSend = filtered
          .map((value) => ({ value, sort: Math.random() }))
          .sort((a, b) => a.sort - b.sort)
          .slice(0, 9)
          .map(({ value }) => value);
      }

      return Response.json(filteredToSend, { status: 200 });
    }

    const arr = await db.query.good.findMany({
      where: inArray(good.regId, regIds.split(",").map(Number)),
      columns: { drugId: true },
    });

    const goodDrugIds = Array.from(new Set(arr.map((x) => x.drugId)));

    const result: { drugId: number; drug: string }[] = [];

    for (const drugId of goodDrugIds) {
      //const dops = await getDops({ drugId });
      let dops: Awaited<ReturnType<typeof getDops>> = [];
      try {
        dops = await getDops({ drugId });
      } catch {
        continue;
      }

      if (dops.length === 0) continue;

      for (const dop of dops) {
        const found = result.find((x) => x.drugId === dop.slaveDrugId);
        if (!found) {
          result.push({
            drugId: dop.slaveDrugId,
            drug: dop.slaveDrug,
          });
        }
      }
    }

    const drugIds = result.map((x) => x.drugId);

    const goods = await db.query.good.findMany({
      where: and(
        eq(good.isDeleted, false),
        eq(good.isHidden, false),
        inArray(good.drugId, drugIds),
        notInArray(good.regId, regIds.split(",").map(Number)),
      ),
      columns: {
        id: true,
        drugId: true,
        regId: true,
        drug: true,
        form: true,
        img: true,
        title: true,
        subtitle: true,
      },
      with: {
        osts: {
          where: and(
            eq(ost.isDeleted, false),
            gte(ost.uQntOst, 1),
            eq(ost.branchId, Number(branchId)),
          ),
          orderBy: [asc(ost.priceRoznWNDS)],
          columns: {
            branchId: true,
            uQntOst: true,
            recipe: true,
            priceRoznWNDS: true,
            fixPriceValue: true,
            naklDataId: true,
          },
        },
      },
    });

    const filtered = goods.filter((x) => x.osts.length > 0);
    const filteredDrugIds = Array.from(new Set(filtered.map((x) => x.drugId)));

    const recs: Good[] = [];

    for (const drugId of filteredDrugIds) {
      const found = filtered.find((x) => x.drugId === drugId);
      if (found) {
        const { osts, ...rest } = found;
        recs.push({ ...rest, ost: osts });
      }
    }

    return Response.json(recs, { status: 200 });
  } catch (err) {
    console.log(err);
    return Response.json(
      { message: "Что-то пошло не так. Повторите еще." },
      { status: 500 },
    );
  }
}
