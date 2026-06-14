"use client";

import { Button } from "../ui/button";
import Link from "next/link";
import { CloudUpload, MapPin, Settings, ShoppingBag } from "lucide-react";
import LogoutButton from "./logout-button";
import NameBlock from "./name-block";
import Card from "./card";
import { User } from "@/lib/auth";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { cn } from "@/lib/utils";
import { HeartIcon } from "../icons";
import ProfileMenuList, { ProfileLogoutFooter } from "./profile-menu-list";

export default function Profile({ user }: { user: User | null }) {
  const isDesktop = useIsDesktop();

  if (!user) return null;

  return (
    <section
      className={cn(
        "flex w-full flex-col",
        isDesktop
          ? "h-full items-center justify-between gap-4"
          : "min-h-0 flex-1 pb-2 pt-4",
      )}
    >
      <section className='flex w-full flex-col items-center gap-4'>
        <div className='flex flex-col items-center gap-1'>
          <NameBlock user={user} />
          <p className='text-xs text-muted-foreground'>{user?.phone}</p>
        </div>
        <div className='w-full space-y-2'>
          <Card user={user} />

          {isDesktop ? (
            <>
              <div className='w-full flex gap-2'>
                {buttons.map(({ title, link, icon: Icon }) => (
                  <Link
                    key={title}
                    href={link}
                    className='flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-xl bg-secondary'
                  >
                    <Icon className='h-5 w-5' />
                    <p className='text-xs'>{title}</p>
                  </Link>
                ))}
              </div>
              {user?.roles?.includes("admin") && (
                <Button
                  className='w-full rounded-full bg-[#A03968] text-xs text-white hover:bg-[#A03968]'
                  asChild
                >
                  <Link href='/admin/cities' className='gap-2'>
                    <CloudUpload className='h-4 w-4' />
                    <p>Администрирование</p>
                  </Link>
                </Button>
              )}
            </>
          ) : (
            <ProfileMenuList user={user} />
          )}
        </div>
      </section>

      {!isDesktop && <ProfileLogoutFooter />}

      {isDesktop && (
        <div className='flex flex-col items-center justify-center gap-2'>
          <Button
            variant='secondary'
            asChild
            className='h-auto rounded-full py-3 text-xs'
          >
            <a
              href={`https://wa.me/79245902200?text=Здравствуйте!%0aУ%20меня%20вопрос`}
              target='_blank'
              rel='noopener noreferrer'
            >
              Связаться с нами
            </a>
          </Button>
          <LogoutButton />
        </div>
      )}
    </section>
  );
}

const buttons = [
  { title: "Заказы", link: "/profile/orders", icon: ShoppingBag },
  { title: "Адреса", link: "/profile/addresses", icon: MapPin },
  { title: "Настройки", link: "/profile/settings", icon: Settings },
];
