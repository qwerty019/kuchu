"use client";

import { Good as GoodType } from "@/lib/db/good/definitions";
import { useCartStore } from "@/providers/cart-store-provider";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Heart, ImageOff } from "lucide-react";
import Link from "next/link";
import GoodButtons from "./good-buttons";
import { cn, getSubtitle, getTitle } from "@/lib/utils";
import { addUserGood } from "@/lib/db/userGood/actions";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useState } from "react";
import NoUser from "./no-user";
import { useMainStore } from "@/providers/main-store-provider";
import { useGoodCart } from "./use-good-cart";
import GoodCartStepper from "./good-cart-stepper";

export default function Good({
  good,
  className,
  imgClassName,
  similar,
}: {
  good: GoodType;
  className?: string;
  imgClassName?: string;
  similar?: boolean;
}) {
  const [clicked, setClicked] = useState(false);
  const [open, setOpen] = useState(false);

  const { items } = useCartStore((state) => state);
  const { setFavorites, favorites } = useMainStore((state) => state);

  const cartItem = items.find((i) => i.id === good.id);

  const handleAdd = async (goodId: number) => {
    if (clicked) return;

    setClicked(true);

    const action = await addUserGood(goodId);

    setClicked(false);

    if (!action) {
      const newFavorites = favorites.filter((g) => g.id !== goodId);
      setFavorites(newFavorites);
      toast.success("Товар удален из избранного.");
      return;
    }

    if ("message" in action) {
      if (action.message === "Пользователь не найден.") {
        setOpen(true);
      } else {
        toast.error(action.message);
      }
      return;
    }

    const newFavorites = [...favorites.filter((g) => g.id !== goodId), good];
    setFavorites(newFavorites);
    toast.success("Товар добавлен в избранное.");
  };

  const isFavorite = favorites.find((g) => g.id === good.id);
  const { nextPrice, status } = useGoodCart(good);

  return (
    <div className='space-y-1.5'>
      {/* Desktop (как было) */}
      <div className='hidden lg:block'>
        <div className='relative'>
          <Link
            href={`/product/${good.regId}`}
            className={cn("w-full block relative", imgClassName)}
            replace={similar}
          >
            <Avatar
              className={cn(
                "w-full h-auto aspect-square rounded-2xl border",
                imgClassName,
              )}
            >
              <AvatarImage
                src={good.img || undefined}
                alt={good.drug}
                className='aspect-square object-contain rounded-2xl p-[15%]'
              />
              <AvatarFallback className='bg-[#F2F2F2] rounded-2xl text-muted-foreground'>
                <ImageOff className='w-8 h-8' />
              </AvatarFallback>
            </Avatar>
            {cartItem && (
              <div className='w-full aspect-square absolute top-0 left-0 bg-[#865BBD]/40 rounded-2xl flex items-center justify-center'>
                <p className='text-white font-semibold text-4xl'>
                  {cartItem.qnt}
                </p>
              </div>
            )}
          </Link>
          <Button
            onClick={() => handleAdd(good.id)}
            size='icon'
            className='absolute top-2 right-2 p-0 h-6 w-6 bg-transparent hover:bg-transparent'
            disabled={clicked}
          >
            <Heart
              className={`h-6 w-6 hover:text-[#A03968]/50 ${
                clicked
                  ? "text-[#A03968]/50 animate-pulse"
                  : isFavorite
                    ? "text-[#A03968]"
                    : "text-gray-400"
              }`}
            />
          </Button>
        </div>
        <Link
          href={`/product/${good.regId}`}
          className={cn(
            "block text-sm font-semibold h-[60px] overflow-hidden",
            similar && "h-[48px] overflow-hidden",
            className,
          )}
          replace={similar}
        >
          <p className='break-words'>{getTitle(good)}</p>
          <p className='text-muted-foreground break-words'>
            {getSubtitle(good)}
          </p>
        </Link>
        <GoodButtons good={good} isShortText={similar} />
      </div>

      {/* Mobile */}
      <div className='lg:hidden space-y-2'>
        <div className='relative'>
          <Link
            href={`/product/${good.regId}`}
            className={cn("w-full block relative", imgClassName)}
            replace={similar}
          >
            <Avatar
              className={cn(
                "w-full h-auto aspect-square overflow-hidden rounded-2xl border border-[#E5E5E5] bg-[#F2F2F2]",
                imgClassName,
              )}
            >
              <AvatarImage
                src={good.img || undefined}
                alt={good.drug}
                className='h-full w-full rounded-2xl object-cover'
              />
              <AvatarFallback className='h-full w-full rounded-2xl bg-[#F2F2F2] text-muted-foreground'>
                <ImageOff className='w-8 h-8' />
              </AvatarFallback>
            </Avatar>
          </Link>

          <div className='absolute bottom-2 right-2 z-10'>
            <GoodCartStepper good={good} compact={false} />
          </div>

          <Button
            onClick={() => handleAdd(good.id)}
            size='icon'
            className='absolute top-2 right-2 z-20 p-0 h-6 w-6 bg-transparent hover:bg-transparent'
            disabled={clicked}
          >
            <Heart
              className={`h-6 w-6 hover:text-[#A03968]/50 ${
                clicked
                  ? "text-[#A03968]/50 animate-pulse"
                  : isFavorite
                    ? "text-[#A03968]"
                    : "text-gray-400"
              }`}
            />
          </Button>
        </div>

        <Link
          href={`/product/${good.regId}`}
          className={cn("block", className)}
          replace={similar}
        >
          <p className='text-xs text-muted-foreground break-words'>
            {getSubtitle(good, similar)}
          </p>
          <p className='mt-1 text-base font-semibold text-black leading-tight break-words'>
            {getTitle(good, similar)}
          </p>
        </Link>

        <p className='text-base font-semibold text-black'>
          {status === "out-of-stock" ? "Нет в наличии" : `${nextPrice} ₽`}
        </p>
      </div>

      <NoUser open={open} setOpen={setOpen} />
    </div>
  );
}
