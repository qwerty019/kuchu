import Image from "next/image";
import Link from "next/link";
import NavText from "./nav-text/nav-text";
import NavProfile from "./nav-profile";
import { LogoMobile } from "../icons";
import { Button } from "../ui/button";
import { User } from "@/lib/auth";
import { getDiscountCard } from "@/lib/db/discountcard/data";
import { getUserGoods } from "@/lib/db/userGood/data";

export default async function Nav({ user }: { user: User | null }) {
  const [initialDiscountCard, initialFavorites] = user
    ? await Promise.all([
        getDiscountCard(user.id),
        getUserGoods({ user }),
      ])
    : [null, [] as Awaited<ReturnType<typeof getUserGoods>>];

  return (
    <div className='nav flex h-14 w-full items-center gap-4 bg-[#F3F2F2] px-4 lg:grid lg:h-16 lg:grid-cols-[var(--kuchu-sidebar-w)_minmax(0,1fr)_var(--kuchu-cart-w)] lg:items-center lg:gap-4 lg:rounded-b-2xl'>
      <div className='h-full hidden shrink-0 lg:flex items-center justify-center bg-background rounded-b-2xl'>
        <Link href='/' className='cursor-pointer'>
          <Image src='/images/logo.svg' alt='logo' width={131} height={30} />
        </Link>
      </div>
      <div className='h-full hidden min-w-0 lg:flex items-center justify-center rounded-b-2xl bg-background'>
        <NavText />
      </div>
      <div className='hidden h-full shrink-0 lg:flex items-center justify-center rounded-b-2xl bg-background'>
        <NavProfile
          user={user}
          initialDiscountCard={initialDiscountCard}
          initialFavorites={initialFavorites}
        />
      </div>
      {/* Только /admin на мобилке: на витрине шапка скрыта через ConditionalNav */}
      <div className='flex items-center gap-2 lg:hidden w-full'>
        <Button
          size='icon'
          className='bg-white h-10 w-10 p-0 rounded-full hover:bg-white/80 shrink-0'
          asChild
        >
          <Link href='/' className='cursor-pointer'>
            <LogoMobile className='w-5 h-5' />
          </Link>
        </Button>
        <div className='flex-1 min-w-0 flex justify-center px-1'>
          <NavText />
        </div>
        <div className='w-10 shrink-0' aria-hidden />
      </div>
    </div>
  );
}
