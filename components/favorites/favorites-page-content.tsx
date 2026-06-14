"use client";

import { FavoriteItem } from "@/components/right-side/favorites-list";
import { useMainStore } from "@/providers/main-store-provider";

export default function FavoritesPageContent() {
  const favorites = useMainStore((s) => s.favorites);

  return (
    <section className='flex min-h-0 flex-1 flex-col gap-4'>
      <h1 className='text-xl font-bold text-[#A03968]'>Избранное</h1>
      <div className='min-h-0 flex-1 space-y-3 overflow-y-auto rounded-2xl bg-secondary/40 p-3'>
        {favorites.map((good) => (
          <FavoriteItem key={good.id} good={good} />
        ))}
        {favorites.length === 0 && (
          <p className='flex h-full min-h-[200px] items-center justify-center text-center text-sm text-muted-foreground'>
            Вы не добавили <br /> ни одного товара в избранное
          </p>
        )}
      </div>
    </section>
  );
}
