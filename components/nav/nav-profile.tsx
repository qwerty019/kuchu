"use client";

import { User } from "@/lib/auth";
import { HeartIcon, Svg1, UserIcon } from "../icons";
import { useMainStore } from "@/providers/main-store-provider";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { Good } from "@/lib/db/good/definitions";
import { DiscountCard } from "@/lib/definitions";

export default function NavProfile({
  user,
  initialDiscountCard,
  initialFavorites,
}: {
  user: User | null;
  initialDiscountCard: DiscountCard | null;
  initialFavorites: Good[];
}) {
  const {
    discountCard,
    setDiscountCard,
    favorites,
    showFavorites,
    setShowFavorites,
    setFavorites,
  } = useMainStore((state) => state);

  const syncedUserId = useRef<string | number | null>(null);

  useEffect(() => {
    if (!user?.id) {
      syncedUserId.current = null;
      setDiscountCard(null);
      setFavorites([]);
      return;
    }

    if (syncedUserId.current === user.id) return;

    syncedUserId.current = user.id;
    setDiscountCard(initialDiscountCard);
    setFavorites(initialFavorites);
  }, [
    user?.id,
    initialDiscountCard,
    initialFavorites,
    setDiscountCard,
    setFavorites,
  ]);

  return (
    <div className='flex items-center gap-2'>
      <Link href='/profile' className='flex items-center gap-2'>
        <UserIcon className='w-5 h-5 text-[#404040]' />
        <p className='text-sm font-medium'>
          {user?.name || user?.phone || "Войти"}
        </p>
        {discountCard && (
          <div className='flex gap-1 items-center py-1 px-2 rounded-full bg-[#865BBD]'>
            <Svg1 className='text-white w-2.5 h-2.5' />
            <p className='text-white text-sm font-medium leading-none'>
              {discountCard?.accumulation}
            </p>
          </div>
        )}
      </Link>
      {user && favorites.length > 0 && (
        <div
          onClick={() => setShowFavorites(!showFavorites)}
          className='flex gap-1 items-center py-1 px-2 rounded-full bg-[#F2F2F2] cursor-pointer'
        >
          <HeartIcon className='text-[#A03968] w-2.5 h-2.5' />
          <p className='text-[#A03968] text-sm font-medium leading-none'>
            {favorites.length}
          </p>
        </div>
      )}
    </div>
  );
}
