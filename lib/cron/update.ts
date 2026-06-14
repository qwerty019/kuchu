"use server";

import { Good, Ost } from "./definitions";
import { getGoods, getOstByDate } from "./farmbazis";
import {
  createGood,
  createOst,
  deleteOsts,
  deleteOstsByIds,
  fetchBranches,
  getDbGoods,
  updateOst,
} from "./db";

export async function handleUpdate() {
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
    return { message: data.message };
  }

  const { branches, osts, fbGoods } = data;

  const goods = await getDbGoods();

  if ("message" in goods) {
    return { message: goods.message };
  }

  // create goods that isn't in db
  await handleNotFoundsInDb(
    fbGoods,
    goods,
    osts,
    branches,
    goodCount,
    ostCount
  );

  await handleUpdateOsts(goods, fbGoods, osts, branches, goodCount, ostCount);

  const message = {
    start,
    end: getCurrentTime(),
    goods: fbGoods.length,
    osts: osts.length,
    goodCount,
    ostCount,
  };

  return message;
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

    const createdGood = await createGood(g);

    if ("message" in createdGood) {
      return { message: createdGood.message };
    }

    goodCount.created++;

    for (const o of ost) {
      const branch = branches.find((b) => b.fbId === o.branchId);

      if (!branch) continue;
      if (o.brakLS) continue;

      const createdOst = await createOst(createdGood.id, branch.id, o);

      if ("message" in createdOst) {
        return { message: createdOst.message };
      }

      ostCount.created++;
    }
  }
}

async function getData() {
  // get branches with fbId
  const branches = await fetchBranches();

  if ("message" in branches) {
    return { message: "Ошибка при получении филиалов." };
  }

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

    fbGoods.push(...goods);
  }

  return { branches, osts, fbGoods };
}

async function handleUpdateOsts(
  goods: DbGood[],
  fbGoods: Good[],
  osts: Ost[],
  branches: Branch[],
  goodCount: UpdateCount,
  ostCount: UpdateCount
) {
  // Create lookup maps for faster access
  const fbGoodsMap = new Map(fbGoods.map((fg) => [fg.regId, fg]));
  const branchesMap = new Map(branches.map((b) => [b.fbId, b]));

  // Group osts by regId for faster lookups
  const ostsByRegId = new Map<number, Ost[]>();
  for (const o of osts) {
    if (!ostsByRegId.has(o.regId)) {
      ostsByRegId.set(o.regId, []);
    }
    ostsByRegId.get(o.regId)!.push(o);
  }

  // Batch deletes instead of one at a time
  const goodsToDelete: number[] = [];
  const ostsToDelete: number[] = [];
  const ostsToUpdate: { id: number; ost: Ost }[] = [];
  const ostsToCreate: { goodId: number; branchId: number; ost: Ost }[] = [];

  for (const g of goods) {
    // check if good exists in fbGoods
    const fbGood = fbGoodsMap.get(g.regId);

    if (!fbGood) {
      goodsToDelete.push(g.id);
      goodCount.deleted++;
      continue;
    }

    // get osts for good
    const ost = ostsByRegId.get(g.regId) || [];

    // if no osts for good, continue
    if (ost.length === 0) continue;

    // Create naklDataId lookup map for current good's osts
    const ostNaklDataMap = new Map(ost.map((o) => [o.naklDataId, o]));

    // Check which osts need to be deleted (exist in DB but not in fetched data)
    for (const og of g.ost) {
      if (!ostNaklDataMap.has(og.naklDataId)) {
        ostsToDelete.push(og.id);
      }
    }

    // Create a map of existing osts by naklDataId for fast lookup
    const existingOstsMap = new Map(g.ost.map((og) => [og.naklDataId, og]));

    // Update or create osts
    for (const o of ost) {
      const branch = branchesMap.get(o.branchId);
      if (!branch) continue;

      const found = existingOstsMap.get(o.naklDataId);

      if (found) {
        if (o.brakLS) {
          ostsToDelete.push(found.id);
          continue;
        }

        // check if ost has changed
        if (
          found.uQntOst === o.uQntOst &&
          found.fixPriceValue === o.fixPriceValue &&
          found.priceRoznWNDS === o.priceRoznWNDS &&
          found.nds === o.nds &&
          found.uQntRez === o.uQntRez
        ) {
          ostCount.skipped++;
          continue;
        }

        ostsToUpdate.push({ id: found.id, ost: o });
        ostCount.updated++;
      } else {
        // create ost if not exists
        ostsToCreate.push({ goodId: g.id, branchId: branch.id, ost: o });
        ostCount.created++;
      }
    }
  }

  // Process batches in parallel
  const deleteGoodsPromise =
    goodsToDelete.length > 0
      ? batchDeleteOsts(goodsToDelete)
      : Promise.resolve();

  const deleteOstsPromise =
    ostsToDelete.length > 0
      ? batchDeleteOstsByIds(ostsToDelete)
      : Promise.resolve();

  const updateOstsPromise =
    ostsToUpdate.length > 0 ? batchUpdateOsts(ostsToUpdate) : Promise.resolve();

  const createOstsPromise =
    ostsToCreate.length > 0 ? batchCreateOsts(ostsToCreate) : Promise.resolve();

  const [
    deleteGoodsResult,
    deleteOstsResult,
    updateOstsResult,
    createOstsResult,
  ] = await Promise.all([
    deleteGoodsPromise,
    deleteOstsPromise,
    updateOstsPromise,
    createOstsPromise,
  ]);

  // Check for errors
  if (
    deleteGoodsResult &&
    typeof deleteGoodsResult === "object" &&
    "message" in deleteGoodsResult
  ) {
    return { message: deleteGoodsResult.message };
  }

  if (
    deleteOstsResult &&
    typeof deleteOstsResult === "object" &&
    "message" in deleteOstsResult
  ) {
    return { message: deleteOstsResult.message };
  }

  if (
    updateOstsResult &&
    typeof updateOstsResult === "object" &&
    "message" in updateOstsResult
  ) {
    return { message: updateOstsResult.message };
  }

  if (
    createOstsResult &&
    typeof createOstsResult === "object" &&
    "message" in createOstsResult
  ) {
    return { message: createOstsResult.message };
  }

  ostCount.deleted += ostsToDelete.length;
}

// New helper functions for batch operations
async function batchDeleteOsts(goodIds: number[]) {
  try {
    // Process in chunks if needed for very large datasets
    const CHUNK_SIZE = 100;
    for (let i = 0; i < goodIds.length; i += CHUNK_SIZE) {
      const chunk = goodIds.slice(i, i + CHUNK_SIZE);
      await Promise.all(chunk.map((id) => deleteOsts(id)));
    }
  } catch (error) {
    return { message: "Error batch deleting osts" };
  }
}

async function batchDeleteOstsByIds(ids: number[]) {
  try {
    // Process in chunks
    const CHUNK_SIZE = 500;
    for (let i = 0; i < ids.length; i += CHUNK_SIZE) {
      const chunk = ids.slice(i, i + CHUNK_SIZE);
      await deleteOstsByIds(chunk);
    }
  } catch (error) {
    return { message: "Error batch deleting osts by ids" };
  }
}

async function batchUpdateOsts(updates: { id: number; ost: Ost }[]) {
  try {
    // Process in chunks
    const CHUNK_SIZE = 100;
    for (let i = 0; i < updates.length; i += CHUNK_SIZE) {
      const chunk = updates.slice(i, i + CHUNK_SIZE);
      await Promise.all(chunk.map(({ id, ost }) => updateOst(id, ost)));
    }
  } catch (error) {
    return { message: "Error batch updating osts" };
  }
}

async function batchCreateOsts(
  creates: { goodId: number; branchId: number; ost: Ost }[]
) {
  try {
    // Process in chunks
    const CHUNK_SIZE = 100;
    for (let i = 0; i < creates.length; i += CHUNK_SIZE) {
      const chunk = creates.slice(i, i + CHUNK_SIZE);
      await Promise.all(
        chunk.map(({ goodId, branchId, ost }) =>
          createOst(goodId, branchId, ost)
        )
      );
    }
  } catch (error) {
    return { message: "Error batch creating osts" };
  }
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
    brakLS: boolean;
  }[];
  id: number;
  regId: number;
};

type Branch = {
  id: number;
  fbId: number | null;
};

interface UpdateCount {
  deleted: number;
  created: number;
  updated: number;
  skipped: number;
}
