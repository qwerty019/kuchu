"use client";

import { Good } from "@/lib/db/good/definitions";
import { Plus, Minus, ChevronRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useGoodCart } from "./use-good-cart";
import type { MouseEvent } from "react";

function stopLinkNavigation(event: MouseEvent) {
  event.preventDefault();
  event.stopPropagation();
}

export default function GoodCartStepper({
  good,
  compact = false,
  className,
}: {
  good: Good;
  compact?: boolean;
  className?: string;
}) {
  const {
    status,
    cartItem,
    cartQty,
    canIncrease,
    handleAdd,
    handleDecrease,
  } = useGoodCart(good);

  const pillClass = cn(
    "rounded-full bg-[#A03968] text-white shadow-sm",
    compact ? "h-7 text-[10px]" : "h-8 text-xs",
  );

  const iconClass = compact ? "h-3.5 w-3.5" : "h-4 w-4";

  if (status === "disabled-feb") {
    return (
      <div
        className={cn(
          "rounded-full bg-[#E8E8E8] px-2.5 py-1 text-[10px] font-medium text-muted-foreground",
          className,
        )}
      >
        Недоступно
      </div>
    );
  }

  if (status === "recipe") {
    return (
      <Button
        asChild
        size='sm'
        className={cn(pillClass, "px-2.5 hover:bg-[#A03968]/90", className)}
        onClick={stopLinkNavigation}
      >
        <Link href={`/product/${good.regId}`}>Рецепт</Link>
      </Button>
    );
  }

  if (status === "out-of-stock") {
    return (
      <div
        className={cn(
          "rounded-full bg-[#E8E8E8] px-2.5 py-1 text-[10px] font-medium text-muted-foreground",
          className,
        )}
      >
        Нет
      </div>
    );
  }

  if (status === "other-branch") {
    return (
      <Button
        asChild
        size='sm'
        className={cn(pillClass, "px-2.5 hover:bg-[#A03968]/90", className)}
        onClick={stopLinkNavigation}
      >
        <Link href={`/product/${good.regId}`} className='flex items-center gap-0.5'>
          {compact ? "Др." : "В др. аптеках"}
          {!compact && <ChevronRight className={iconClass} />}
        </Link>
      </Button>
    );
  }

  if (!cartItem) {
    return (
      <Button
        type='button'
        size='icon'
        aria-label='В корзину'
        className={cn(
          pillClass,
          compact ? "h-7 w-7" : "h-8 w-8",
          "hover:bg-[#A03968]/90",
          className,
        )}
        onClick={(event) => {
          stopLinkNavigation(event);
          handleAdd();
        }}
      >
        <ShoppingBag className={cn(iconClass, "text-white")} strokeWidth={2} />
      </Button>
    );
  }

  return (
    <div
      className={cn(
        pillClass,
        "flex items-center gap-0.5 pl-1 pr-1 font-semibold",
        className,
      )}
      onClick={stopLinkNavigation}
    >
      <Button
        type='button'
        size='icon'
        className={cn(
          "h-full w-7 shrink-0 bg-transparent p-0 text-white hover:bg-white/15 hover:text-white",
          compact && "w-6",
        )}
        onClick={(event) => {
          stopLinkNavigation(event);
          handleDecrease();
        }}
      >
        <Minus className={iconClass} />
      </Button>
      <span className={cn("min-w-[1.25rem] text-center tabular-nums", compact && "min-w-[1rem] text-[11px]")}>
        {cartQty}
      </span>
      {canIncrease && (
        <Button
          type='button'
          size='icon'
          className={cn(
            "h-full w-7 shrink-0 bg-transparent p-0 text-white hover:bg-white/15 hover:text-white",
            compact && "w-6",
          )}
          onClick={(event) => {
            stopLinkNavigation(event);
            handleAdd();
          }}
        >
          <Plus className={iconClass} />
        </Button>
      )}
    </div>
  );
}
