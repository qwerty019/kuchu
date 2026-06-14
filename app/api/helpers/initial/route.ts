export const dynamic = "force-dynamic";

import { fetchBranches } from "@/lib/db/branch/data";
import { Ost } from "@/lib/definitions";
import { getGoods, getOstByDate } from "@/lib/farmbazis/data";
import prisma from "@/lib/prisma";

// when re-fetch data from scratch
export async function GET() {
  try {
    const data = await getData();

    if ("message" in data) {
      return Response.json(data, { status: 500 });
    }

    const { branches, osts, fbGoods } = data;

    const goods = await prisma.good.findMany({
      where: { isDeleted: false },
      select: {
        id: true,
        regId: true,
        ost: {
          select: {
            id: true,
            uQntOst: true,
            fixPriceValue: true,
            priceRoznWNDS: true,
            nds: true,
            uQntRez: true,
          },
        },
      },
    });

    const transactions = [];

    for (const g of goods) {
      const fbGood = fbGoods.find((fg) => fg.regId === g.regId);

      if (!fbGood) {
        const od = prisma.ost.deleteMany({
          where: { goodId: g.id },
        });

        transactions.push(od);

        continue;
      }

      const ost = osts.filter((o) => o.regId === g.regId);

      if (ost.length === 0) continue;

      const ode = prisma.ost.deleteMany({
        where: { goodId: g.id },
      });

      transactions.push(ode);

      for (const o of ost) {
        const branch = branches.find((b) => b.fbId === o.branchId);

        if (!branch) continue;
        if (o.brakLS) continue;

        const oc = prisma.ost.create({
          data: {
            goodId: g.id,
            branchId: branch.id,
            naklDataId: o.naklDataId,
            uQntOst: o.uQntOst,
            priceRoznWNDS: o.priceRoznWNDS,
            fixPriceValue: o.fixPriceValue,
            jv: o.jv,
            brakLS: o.brakLS,
            isAptekaRu: o.isAptekaRu,
            isPersonalOrder: o.isPersonalOrder,
            recipe: o.recipe,
            uQntRez: o.uQntRez,
            nds: o.nds,
            srokG: o.srokG,
          },
        });

        transactions.push(oc);
      }
    }

    console.log("start", getCurrentTime());

    let count = 0;

    for (let i = 0; i < transactions.length; i += 100) {
      const slice = transactions.slice(i, i + 100);

      await prisma.$transaction(slice);

      count += slice.length;
      console.log(count, transactions.length, getCurrentTime());
    }

    console.log("finish", getCurrentTime());

    return Response.json(goods, { status: 200 });
  } catch (err) {
    console.log(err);
    return Response.json(
      { message: "Что-то пошло не так. Повторите еще." },
      { status: 500 }
    );
  }
}

async function getData() {
  // get branches with fbId
  const branches = await fetchBranches();

  const osts: Ost[] = [];

  const regIds = [];

  for (const b of branches) {
    if (!b.fbId) continue;

    // get osts by branch fbId
    const ost = await getOstByDate(b.fbId.toString());

    if ("message" in ost) {
      return { message: "Ошибка при получении остатков." };
    }

    osts.push(...ost);

    regIds.push(...ost.map((o) => o.regId));
  }

  const uniqueRegIds = Array.from(new Set(regIds));

  const fbGoods = [];

  const size = 600;

  // get goods by regIds divided by size
  for (let i = 0; i < uniqueRegIds.length; i += size) {
    const ids = uniqueRegIds.slice(i, i + size).join(",");
    const goods = await getGoods(ids);

    if ("message" in goods) {
      return { message: "Ошибка при получении товаров." };
    }

    fbGoods.push(...goods.items);
  }

  return { branches, osts, fbGoods };
}

function getCurrentTime() {
  const now = new Date();
  return `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
}
