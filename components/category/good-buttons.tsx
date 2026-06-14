import { Plus } from "lucide-react";

import { Good } from "@/lib/db/good/definitions";
import { useCartStore } from "@/providers/cart-store-provider";
import { useMainStore } from "@/providers/main-store-provider";
import { Button } from "../ui/button";
import { ChevronRight, Minus } from "lucide-react";
import Link from "next/link";
import { isWithinDateRange } from "@/lib/utils";

export default function GoodButtons({
  good,
  isShortText = false,
}: {
  good: Good;
  isShortText?: boolean;
}) {
  const { branch, method, onboarding, setOnboarding } = useMainStore(
    (state) => state
  );
  const { items, addCartItem, decreaseQnt } = useCartStore((state) => state);

  const osts = good.ost.filter((x) => x.branchId === Number(branch));
  const qnt = Math.floor(osts.reduce((acc, curr) => acc + curr.uQntOst, 0));

  // Example usage: 6 Feb 2026 00:00:00 to 7 Feb 2026 23:59:59 in +09:00 timezone
  const isDisabledFeb = isWithinDateRange({
    start: new Date(Date.UTC(2026, 1, 6, 0, 0, 0)), // Months are 0-indexed, so 1 is February
    end: new Date(Date.UTC(2026, 1, 7, 23, 59, 59)),
    timezoneOffset: 9,
  });

  if (isDisabledFeb) {
    return (
      <Button
        variant='secondary'
        className={`bg-[#F2F2F2] rounded-full text-[#A03968] py-1 leading-none h-8 ${isShortText ? "text-[10px] px-3" : "text-xs"
          }`}
        disabled
      >
        Недоступно
      </Button>
    );
  }

  const recipe = method === "delivery" && osts.some((x) => x.recipe);
  if (recipe) {
    return (
      <Button
        variant='secondary'
        className={`bg-[#F2F2F2] rounded-full text-[#A03968] py-1 leading-none h-8 ${isShortText ? "text-[10px] px-3" : "text-xs"
          }`}
        asChild
      >
        <Link href={`/product/${good.regId}`}>
          Рецептурный
          {!isShortText && <ChevronRight className='w-4 h-4 ml-1' />}
        </Link>
      </Button>
    );
  }

  if (qnt === 0) {
    const allCount = good.ost.reduce((acc, curr) => acc + curr.uQntOst, 0);

    if (allCount === 0) {
      return (
        <Button
          variant='secondary'
          className={`bg-[#F2F2F2] rounded-full text-[#A03968] py-1 leading-none h-8 ${isShortText ? "text-[10px] px-3" : "text-xs"
            }`}
          disabled
        >
          Нет в наличии
        </Button>
      );
    }

    return (
      <Button
        variant='secondary'
        className={`bg-[#F2F2F2] rounded-full text-[#A03968] py-1 leading-none h-8 ${isShortText ? "text-[10px] px-3" : "text-xs"
          }`}
        asChild
      >
        <Link href={`/product/${good.regId}`}>
          В др. аптеках
          {!isShortText && <ChevronRight className='w-4 h-4 ml-1' />}
        </Link>
      </Button>
    );
  }

  const cartItem = items.find((i) => i.id === good.id);
  const qnts = cartItem?.qnts?.reduce((acc, curr) => acc + curr.added, 0);

  const ost = osts.find((qnt, index) => {
    const cartQnt = cartItem?.qnts[index];
    if (cartQnt) return qnt.uQntOst > cartQnt.added;
    return qnt.uQntOst > 0;
  });
  const lastPrice = osts[osts.length - 1]?.priceRoznWNDS;
  const nextPrice = ost?.priceRoznWNDS || lastPrice || 0;

  const handleAdd = (good: Good) => {
    if (!good) return;
    if (qnt === 0) return;
    if (recipe) return;
    if (!branch) return;

    addCartItem(good, branch);
  };

  return (
    <div
      className={`w-fit flex items-center gap-1 text-[#A03968] rounded-full bg-[#F2F2F2] py-1 ${cartItem ? "pl-1" : "pl-3"
        } ${qnts === qnt ? "pr-3" : "pr-1"}`}
    >
      {cartItem && (
        <Button
          className='h-full p-1 bg-transparent hover:bg-transparent text-[#A03968]'
          onClick={() => decreaseQnt(good.id)}
        >
          <Minus className='w-4 h-4' />
        </Button>
      )}
      <p className='font-semibold text-sm'>{nextPrice} ₽</p>
      {qnts !== qnt && (
        <Button
          className='h-full p-1 bg-transparent hover:bg-transparent text-[#A03968]'
          onClick={() => {
            handleAdd(good);
            if (onboarding.cart !== "true" && onboarding.mounted) {
              setOnboarding((prev) => ({ ...prev, cart: "show" }));
            }
          }}
        >
          <Plus className='w-4 h-4' />
        </Button>
      )}
    </div>
  );
}
