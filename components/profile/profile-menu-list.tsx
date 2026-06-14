"use client";

import { CatalogListRow } from "@/components/search/catalog-list-row";
import { logout } from "@/components/profile/actions";
import { searchListDividerClass } from "@/lib/footer-links";
import { User } from "@/lib/auth";
import { cn } from "@/lib/utils";
import {
  CloudUpload,
  Heart,
  Loader2,
  LogOut,
  MapPin,
  MessageCircle,
  Settings,
  ShoppingBag,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";

const profileRowClass = "py-5";
const profileLabelClass = "text-sm font-semibold";

const menuLinks: { title: string; href: string; icon: LucideIcon }[] = [
  { title: "Заказы", href: "/profile/orders", icon: ShoppingBag },
  { title: "Адреса", href: "/profile/addresses", icon: MapPin },
  { title: "Настройки", href: "/profile/settings", icon: Settings },
  { title: "Избранное", href: "/favorites", icon: Heart },
];

const contactHref =
  "https://wa.me/79245902200?text=Здравствуйте!%0aУ%20меня%20вопрос";

function MenuRowLabel({
  icon: Icon,
  title,
}: {
  icon: LucideIcon;
  title: string;
}) {
  return (
    <span className='flex min-w-0 flex-1 items-center gap-3'>
      <Icon className='h-5 w-5 shrink-0 text-muted-foreground' aria-hidden />
      {title}
    </span>
  );
}

export function ProfileLogoutFooter() {
  const [clicked, setClicked] = useState(false);

  return (
    <div className='mt-auto w-full pt-8 lg:hidden'>
      <button
        type='button'
        disabled={clicked}
        onClick={async () => {
          if (clicked) return;
          setClicked(true);
          await logout();
          window.location.reload();
        }}
        className={cn(
          searchListDividerClass,
          "flex w-full items-center justify-between gap-3 py-10 text-left text-sm font-semibold text-foreground transition-colors hover:text-[#A03968]",
        )}
      >
        <span className='flex min-w-0 flex-1 items-center gap-3'>
          {clicked && (
            <Loader2 className='h-5 w-5 shrink-0 animate-spin' aria-hidden />
          )}
          Выйти
        </span>
        {!clicked && (
          <LogOut className='h-5 w-5 shrink-0 text-muted-foreground' aria-hidden />
        )}
      </button>
    </div>
  );
}

export default function ProfileMenuList({ user }: { user: User }) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/favorites") return pathname === "/favorites";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <nav className='w-full lg:hidden' aria-label='Меню профиля'>
      {menuLinks.map(({ title, href, icon }) => (
        <CatalogListRow
          key={href}
          href={href}
          showChevron
          active={isActive(href)}
          className={profileRowClass}
          labelClassName={profileLabelClass}
        >
          <MenuRowLabel icon={icon} title={title} />
        </CatalogListRow>
      ))}

      {user.roles?.includes("admin") && (
        <CatalogListRow
          href='/admin/cities'
          showChevron
          active={pathname.startsWith("/admin")}
          className={profileRowClass}
          labelClassName={profileLabelClass}
        >
          <MenuRowLabel icon={CloudUpload} title='Администрирование' />
        </CatalogListRow>
      )}

      <CatalogListRow
        href={contactHref}
        showChevron
        className={profileRowClass}
        labelClassName={profileLabelClass}
      >
        <MenuRowLabel icon={MessageCircle} title='Связаться с нами' />
      </CatalogListRow>
    </nav>
  );
}
