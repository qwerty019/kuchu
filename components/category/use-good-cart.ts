"use client";

import { Good } from "@/lib/db/good/definitions";
import { useCartStore } from "@/providers/cart-store-provider";
import { useMainStore } from "@/providers/main-store-provider";
import { isWithinDateRange } from "@/lib/utils";

export type GoodCartStatus =
  | "disabled-feb"
  | "recipe"
  | "out-of-stock"
  | "other-branch"
  | "available";

export function useGoodCart(good: Good) {
  const { branch, method, onboarding, setOnboarding } = useMainStore(
    (state) => state,
  );
  const { items, addCartItem, decreaseQnt } = useCartStore((state) => state);

  const osts = good.ost.filter((x) => x.branchId === Number(branch));
  const qnt = Math.floor(osts.reduce((acc, curr) => acc + curr.uQntOst, 0));
  const allCount = good.ost.reduce((acc, curr) => acc + curr.uQntOst, 0);

  const isDisabledFeb = isWithinDateRange({
    start: new Date(Date.UTC(2026, 1, 6, 0, 0, 0)),
    end: new Date(Date.UTC(2026, 1, 7, 23, 59, 59)),
    timezoneOffset: 9,
  });

  const recipe = method === "delivery" && osts.some((x) => x.recipe);

  const cartItem = items.find((i) => i.id === good.id);
  const cartQty =
    cartItem?.qnts?.reduce((acc, curr) => acc + curr.added, 0) ?? 0;

  const ost = osts.find((_, index) => {
    const cartQnt = cartItem?.qnts?.[index];
    if (cartQnt) return osts[index].uQntOst > cartQnt.added;
    return osts[index].uQntOst > 0;
  });

  const lastPrice = osts[osts.length - 1]?.priceRoznWNDS ?? 0;
  const nextPrice = ost?.priceRoznWNDS || lastPrice || 0;

  let status: GoodCartStatus = "available";
  if (isDisabledFeb) status = "disabled-feb";
  else if (recipe) status = "recipe";
  else if (qnt === 0 && allCount === 0) status = "out-of-stock";
  else if (qnt === 0) status = "other-branch";

  const canModifyCart = status === "available";
  const canIncrease = cartQty < qnt;

  const handleAdd = () => {
    if (!canModifyCart || !branch) return;

    addCartItem(good, branch);

    if (onboarding.cart !== "true" && onboarding.mounted) {
      setOnboarding((prev) => ({ ...prev, cart: "show" }));
    }
  };

  const handleDecrease = () => {
    decreaseQnt(good.id);
  };

  return {
    status,
    nextPrice,
    cartItem,
    cartQty,
    qnt,
    canModifyCart,
    canIncrease,
    handleAdd,
    handleDecrease,
  };
}
