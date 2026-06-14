"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, type MouseEvent } from "react";
import { Heart, Home, Search, ShoppingCart, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { isMobileViewport, navigateMobileFullPage } from "@/lib/mobile-full-page-nav";
import { useMainStore } from "@/providers/main-store-provider";
import { useCartStore } from "@/providers/cart-store-provider";

const navH = "h-[3.25rem]";

export default function MobileBottomNav({
  isAuthenticated = true,
}: {
  isAuthenticated?: boolean;
}) {
  const pathname = usePathname();
  const setShowFavorites = useMainStore((s) => s.setShowFavorites);
  const setMobileCartOpen = useMainStore((s) => s.setMobileCartOpen);

  const cartCount = useCartStore((s) =>
    s.items.reduce((acc, i) => acc + (i.qnt || 0), 0)
  );

  useEffect(() => {
    setMobileCartOpen(false);
  }, [pathname, setMobileCartOpen]);

  if (pathname.startsWith("/admin")) return null;

  if (
    !isAuthenticated &&
    (pathname === "/profile" || pathname === "/favorites")
  ) {
    return null;
  }

  const homeActive = pathname === "/";
  const searchActive = pathname.startsWith("/search");
  const profileActive = pathname === "/profile";
  const favoritesActive = pathname === "/favorites";
  const cartActive = pathname === "/cart";

  const itemClass = cn(
    "flex flex-1 flex-col items-center justify-center gap-0.5 min-w-0 rounded-2xl py-1 transition-colors",
    navH
  );

  const iconWrap = (active: boolean) =>
    cn(
      "flex items-center justify-center rounded-full px-3 py-1",
      active && "bg-[#E8E0F7]"
    );

  const labelClass = (active: boolean) =>
    cn(
      "text-[10px] font-medium leading-none truncate max-w-full px-0.5",
      active ? "text-[#A03968]" : "text-muted-foreground"
    );

  const iconClass = (active: boolean) =>
    cn("h-5 w-5", active ? "text-[#A03968]" : "text-muted-foreground");

  const navigateTab = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    setMobileCartOpen(false);
    setShowFavorites(false);
    if (!isMobileViewport()) return;
    e.preventDefault();
    navigateMobileFullPage(href);
  };

  return (
    <nav
      className='fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t border-border/60 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85 pb-[env(safe-area-inset-bottom,0px)]'
      aria-label='Основная навигация'
    >
      <div className='flex items-stretch justify-between px-1 pt-1'>
        <Link
          href='/'
          className={itemClass}
          prefetch={true}
          onClick={(e) => navigateTab(e, "/")}
        >
          <span className={iconWrap(homeActive)}>
            <Home className={iconClass(homeActive)} aria-hidden />
          </span>
          <span className={labelClass(homeActive)}>Главная</span>
        </Link>

        <Link
          href='/search'
          className={itemClass}
          prefetch={true}
          onClick={(e) => navigateTab(e, "/search")}
        >
          <span className={iconWrap(searchActive)}>
            <Search className={iconClass(searchActive)} aria-hidden />
          </span>
          <span className={labelClass(searchActive)}>Поиск</span>
        </Link>

        <Link
          href='/profile'
          className={itemClass}
          prefetch={true}
          onClick={(e) => navigateTab(e, "/profile")}
        >
          <span className={iconWrap(profileActive)}>
            <User className={iconClass(profileActive)} aria-hidden />
          </span>
          <span className={labelClass(profileActive)}>Профиль</span>
        </Link>

        <Link
          href='/favorites'
          className={itemClass}
          prefetch={true}
          onClick={(e) => navigateTab(e, "/favorites")}
        >
          <span className={iconWrap(favoritesActive)}>
            <Heart
              className={cn(
                iconClass(favoritesActive),
                favoritesActive && "fill-current"
              )}
              aria-hidden
            />
          </span>
          <span className={labelClass(favoritesActive)}>Избранное</span>
        </Link>

        <Link
          href='/cart'
          className={itemClass}
          prefetch={true}
          onClick={(e) => navigateTab(e, "/cart")}
        >
          <span className={cn(iconWrap(cartActive), "relative")}>
            <ShoppingCart className={iconClass(cartActive)} aria-hidden />
            {cartCount > 0 && (
              <span className='absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#A03968] px-1 text-[9px] font-semibold text-white'>
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </span>
          <span className={labelClass(cartActive)}>Корзина</span>
        </Link>
      </div>
    </nav>
  );
}
