"use client";

import { useIsDesktop } from "@/hooks/use-is-desktop";
import { User } from "@/lib/auth";
import { Good } from "@/lib/db/good/definitions";
import { useMainStore } from "@/providers/main-store-provider";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import FavoritesPageContent from "./favorites-page-content";

type FavoritesPageViewProps = {
  user: User;
  initialFavorites: Good[];
};

/**
 * Мобилка: полноценная страница в main-page.
 * Десктоп: без изменений — панель избранного справа на главной.
 */
export default function FavoritesPageView({
  user,
  initialFavorites,
}: FavoritesPageViewProps) {
  const isDesktop = useIsDesktop();
  const router = useRouter();
  const setShowFavorites = useMainStore((s) => s.setShowFavorites);
  const setFavorites = useMainStore((s) => s.setFavorites);
  const syncedUserId = useRef<string | number | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    if (syncedUserId.current === user.id) return;

    syncedUserId.current = user.id;
    setFavorites(initialFavorites);
  }, [user?.id, initialFavorites, setFavorites]);

  useEffect(() => {
    if (isDesktop) {
      setShowFavorites(true);
      router.replace("/");
    }
  }, [isDesktop, router, setShowFavorites]);

  if (isDesktop) return null;

  return (
    <main className='relative main-page'>
      <FavoritesPageContent />
    </main>
  );
}
