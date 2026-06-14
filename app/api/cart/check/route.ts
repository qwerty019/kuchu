export const dynamic = "force-dynamic";

import { db } from "@/db";
import { good, ost } from "@/db/schema";
import { Good } from "@/lib/db/good/definitions";
import { CartItemState } from "@/stores/cart-store";
import { asc, eq, inArray } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const {
    items,
    method,
    branch,
  }: { items: CartItemState[]; method: string; branch: string } = body;

  try {
    // Fetch goods data with related stock information
    const goods = await fetchGoodsWithStock(items);
    const cartItems: CartItemState[] = [];

    for (const item of items) {
      const good = goods.find((g) => g.id === item.id);
      if (!good || good.isDeleted) {
        cartItems.push(createUnavailableItem(item, "Товар удален"));
        continue;
      }

      // Get stock for current branch
      const branchStock = good.ost.filter((o) => o.branchId === Number(branch));
      const totalQnt = Math.floor(
        branchStock.reduce((acc, curr) => acc + curr.uQntOst, 0)
      );

      if (branchStock.length === 0) {
        const comment =
          method === "delivery"
            ? "Товара нет в наличии при данном способе получения"
            : "Товара нет в наличии при данном способе получения";
        cartItems.push(createUnavailableItem(item, comment));
        continue;
      }

      // Create base cart item
      const updatedItem = createBaseCartItem(item);

      // Handle quantity adjustment if requested quantity exceeds available stock
      if (item.qnt > totalQnt) {
        updateItemWithStockLimits(updatedItem, totalQnt, branchStock);
        cartItems.push(updatedItem);
        continue;
      }

      // Allocate quantities across available stock
      allocateQuantities(updatedItem, item.qnt, branchStock);

      // Check recipe restrictions for delivery
      if (branchStock.some((o) => o.recipe) && method === "delivery") {
        markItemAsPickupOnly(updatedItem);
      }

      cartItems.push(updatedItem);
    }

    return Response.json(cartItems, { status: 200 });
  } catch (err) {
    console.log(err);
    return Response.json(
      { message: "Что-то пошло не так. Повторите еще." },
      { status: 500 }
    );
  }
}

// Helper functions
async function fetchGoodsWithStock(items: CartItemState[]) {
  const goods = await db.query.good.findMany({
    where: inArray(
      good.id,
      items.map((i) => i.id)
    ),
    columns: {
      id: true,
      isDeleted: true,
      regId: true,
      drug: true,
      form: true,
      img: true,
      title: true,
      subtitle: true,
    },
    with: {
      osts: {
        where: eq(ost.isDeleted, false),
        orderBy: asc(ost.priceRoznWNDS),
        columns: {
          branchId: true,
          uQntOst: true,
          priceRoznWNDS: true,
          fixPriceValue: true,
          recipe: true,
          naklDataId: true,
        },
      },
    },
  });

  return goods.map(({ osts, ...rest }) => ({
    ...rest,
    ost: osts,
  }));
}

function createBaseCartItem(item: CartItemState): CartItemState {
  return {
    id: item.id,
    regId: item.regId,
    drug: item.drug,
    form: item.form,
    title: item.title,
    subtitle: item.subtitle,
    img: item.img || "",
    qnt: item.qnt,
    disabled: false,
    comment: "",
    updated: false,
    qnts: [],
  };
}

function createUnavailableItem(
  item: CartItemState,
  comment: string
): CartItemState {
  return {
    ...createBaseCartItem(item),
    disabled: true,
    comment,
    updated: true,
  };
}

function updateItemWithStockLimits(
  item: CartItemState,
  totalQnt: number,
  stock: Good["ost"]
) {
  item.qnt = totalQnt;
  item.comment = "Количество товара обновлено";
  item.updated = true;
  item.qnts = stock.map((ost) => ({
    branchId: ost.branchId,
    price: ost.priceRoznWNDS,
    qnt: ost.uQntOst,
    added: ost.uQntOst,
    fixPrice: ost.fixPriceValue,
    naklDataId: ost.naklDataId,
  }));
}

function allocateQuantities(
  item: CartItemState,
  requestedQnt: number,
  stock: Good["ost"]
) {
  let remainingQnt = requestedQnt;
  item.qnts = stock.map((ost) => {
    const availableToAdd = Math.min(ost.uQntOst, remainingQnt);
    remainingQnt -= availableToAdd;
    return {
      branchId: ost.branchId,
      price: ost.priceRoznWNDS,
      qnt: ost.uQntOst,
      fixPrice: ost.fixPriceValue,
      naklDataId: ost.naklDataId,
      added: availableToAdd,
    };
  });
}

function markItemAsPickupOnly(item: CartItemState) {
  item.disabled = true;
  item.comment = "Это рецептурный товар, он не доставляется";
  item.updated = true;
}
