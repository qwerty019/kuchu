export const dynamic = "force-dynamic";

import { fetchBranches } from "@/lib/db/branch/data";
import { Good, Ost } from "@/lib/definitions";
import { getGoods, getOstByDate } from "@/lib/farmbazis/data";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// update osts and goods every 10 minutes
export async function GET() {
  try {
    const start = getCurrentTime();
    const goodCount: UpdateCount = {
      deleted: 0,
      created: 0,
      updated: 0,
      skipped: 0,
    };
    const ostCount: UpdateCount = {
      deleted: 0,
      created: 0,
      updated: 0,
      skipped: 0,
    };

    const data = await getData();

    if ("message" in data) {
      return Response.json(data, { status: 500 });
    }

    const { branches, osts, fbGoods } = data;

    const goods = await getDbGoods();

    // create goods that isn't in db
    await handleNotFoundsInDb(
      fbGoods,
      goods,
      osts,
      branches,
      goodCount,
      ostCount
    );

    const transactions = handleUpdateOsts(
      goods,
      fbGoods,
      osts,
      branches,
      goodCount,
      ostCount
    );

    await executeUpdates(transactions);

    const message = {
      start,
      end: getCurrentTime(),
      goods: fbGoods.length,
      osts: osts.length,
      goodCount,
      ostCount,
    };

    return Response.json(message, { status: 200 });
  } catch (err) {
    console.log(err);
    return Response.json(
      { message: "Что-то пошло не так. Повторите еще." },
      { status: 500 }
    );
  }
}

async function handleNotFoundsInDb(
  fbGoods: Good[],
  goods: DbGood[],
  osts: Ost[],
  branches: Branch[],
  goodCount: UpdateCount,
  ostCount: UpdateCount
) {
  const notFounds = fbGoods.filter(
    (fg) => !goods.some((g) => g.regId === fg.regId)
  );

  if (notFounds.length === 0) return;

  for (const g of notFounds) {
    const ost = osts.filter((o) => o.regId === g.regId);

    if (ost.length === 0) continue;

    const good = await prisma.good.create({
      data: {
        regId: g.regId,
        drugId: g.drugId,
        formId: g.formId,
        fabrId: g.fabrId,
        mnnId: g.mnnId,
        drug: g.drug,
        form: g.form,
        fabr: g.fabr,
        mnn: g.mnn,
        flag: g.flag,
        ean: g.ean,
        isVital: g.isVital,
        isService: g.isService,
        rSum: g.rSum,
        fullName: g.drug + " " + g.form,
      },
    });

    goodCount.created++;

    const transactions = [];

    for (const o of ost) {
      const branch = branches.find((b) => b.fbId === o.branchId);

      if (!branch) continue;

      const oc = prisma.ost.create({
        data: {
          goodId: good.id,
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

      ostCount.created++;
    }

    await prisma.$transaction(transactions);
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

function handleUpdateOsts(
  goods: DbGood[],
  fbGoods: Good[],
  osts: Ost[],
  branches: Branch[],
  goodCount: UpdateCount,
  ostCount: UpdateCount
) {
  const transactions = [];

  for (const g of goods) {
    // check if good exists in fbGoods
    const fbGood = fbGoods.find((fg) => fg.regId === g.regId);

    if (!fbGood) {
      // delete all osts for good that not exists in fbGoods
      const od = prisma.ost.deleteMany({
        where: { goodId: g.id },
      });

      transactions.push(od);

      goodCount.deleted++;

      continue;
    }

    // get osts for good
    const ost = osts.filter((o) => o.regId === g.regId);

    // if no osts for good, continue
    // because if no osts, then no good in fbGoods
    if (ost.length === 0) continue;

    // update osts
    for (const o of ost) {
      const branch = branches.find((b) => b.fbId === o.branchId);

      if (!branch) continue;

      // find existing ost for good
      const found = g.ost.find((og) => og.naklDataId === o.naklDataId);

      if (found) {
        // check if ost has changed
        const uQntOst = found.uQntOst === o.uQntOst;
        const fixPriceValue = found.fixPriceValue === o.fixPriceValue;
        const priceRoznWNDS = found.priceRoznWNDS === o.priceRoznWNDS;
        const nds = found.nds === o.nds;
        const uQntRez = found.uQntRez === o.uQntRez;

        // if ost has not changed, do nothing
        if (uQntOst && fixPriceValue && priceRoznWNDS && nds && uQntRez) {
          ostCount.skipped++;
          continue;
        }

        // update ost
        const ou = prisma.ost.update({
          where: { id: found.id },
          data: {
            uQntOst: o.uQntOst,
            fixPriceValue: o.fixPriceValue,
            priceRoznWNDS: o.priceRoznWNDS,
            nds: o.nds,
            uQntRez: o.uQntRez,
          },
        });

        transactions.push(ou);

        ostCount.updated++;

        continue;
      }

      // create ost if not exists
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

      ostCount.created++;
    }

    // delete osts that not exists in osts
    const shouldDelete = g.ost.filter(
      (og) => !ost.some((o) => o.naklDataId === og.naklDataId)
    );

    if (shouldDelete.length > 0) {
      const ids = shouldDelete.map((o) => o.id);

      const od = prisma.ost.deleteMany({
        where: { id: { in: ids } },
      });

      transactions.push(od);

      ostCount.deleted += shouldDelete.length;
    }
  }

  return transactions;
}

async function getDbGoods() {
  const goods = await prisma.good.findMany({
    select: {
      id: true,
      regId: true,
      ost: {
        select: {
          id: true,
          naklDataId: true,
          uQntOst: true,
          fixPriceValue: true,
          priceRoznWNDS: true,
          nds: true,
          uQntRez: true,
        },
      },
    },
  });

  return goods;
}

async function executeUpdates(transactions: Transaction[]) {
  console.log("start", getCurrentTime());

  let count = 0;

  const size = 100;

  for (let i = 0; i < transactions.length; i += size) {
    try {
      const slice = transactions.slice(i, i + size);
      await prisma.$transaction(slice);
      count += slice.length;
      console.log(count, transactions.length, getCurrentTime());
    } catch (error) {
      console.error(`Error in transaction batch ${i}-${i + size}:`, error);
      throw error; // Re-throw to be caught by the main try-catch
    }
  }

  console.log("finish", getCurrentTime());
}

function getCurrentTime() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
}

type DbGood = {
  ost: {
    id: number;
    uQntOst: number;
    naklDataId: number;
    priceRoznWNDS: number;
    fixPriceValue: number;
    uQntRez: number;
    nds: number;
  }[];
  id: number;
  regId: number;
};

type Branch = {
  address: string | null;
  city: {
    id: number;
    title: string;
  };
  id: number;
  title: string;
  fbId: number | null;
  main: boolean;
};

type Transaction = Prisma.PrismaPromise<any>;

interface UpdateCount {
  deleted: number;
  created: number;
  updated: number;
  skipped: number;
}
