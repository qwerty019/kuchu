"use client";

import MobileFullScreenShell from "@/components/layout/mobile-full-screen-shell";
import { User } from "@/lib/auth";
import { useMainStore } from "@/providers/main-store-provider";
import Chosen from "@/components/right-side/chosen";
import { Orders } from "@/components/orders/orders";
import ItemsList from "./content/items-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useCartStore } from "@/providers/cart-store-provider";
import { useState } from "react";
import { Choose } from "@/components/right-side/modal/choose";

function PreviewPayFooter() {
  const { method, addresses, zones } = useMainStore((state) => state);
  const { items } = useCartStore((state) => state);

  const address = addresses?.find((a) => a.selected);
  const zone = zones?.find((z) => z.id === address?.zoneId);
  const threshold = zone?.threshold || 0;

  const sum =
    items
      .filter((x) => !x.disabled)
      .reduce((t, ci) => {
        const item = ci.qnts?.reduce((ip, qi) => ip + qi.price * qi.added, 0);
        return t + item;
      }, 0) || 0;
  const rightSum = parseFloat(sum?.toFixed(2));
  const untilThreshold = parseFloat((threshold - rightSum).toFixed(2));

  const btnDisabled =
    items.length === 0 ||
    items.some((x) => x.disabled) ||
    (method === "delivery" && untilThreshold > 0);

  return (
    <div className='space-y-1'>
      <div className='text-center'>
        <p className='text-muted-foreground text-xs'>Итого</p>
        <p className='text-2xl font-semibold'>{rightSum} ₽</p>
      </div>
      {btnDisabled ? (
        <>
          <Button
            className='mx-auto h-14 w-full max-w-[320px] rounded-xl bg-[#A03968] hover:bg-[#A03968]/80'
            disabled
          >
            {items.length === 0
              ? "Продолжить"
              : items.some((x) => x.disabled)
                ? "Удалите недоступные товары"
                : method === "delivery" && untilThreshold > 0
                  ? `Доберите еще ${untilThreshold}₽`
                  : "Перейти к оплате"}
          </Button>
          <Button
            className='w-full rounded-full bg-[#F2F2F2] hover:bg-[#F2F2F2]/80 text-[#404040]'
            asChild
          >
            <Link href='/cart'>Рекомендации</Link>
          </Button>
        </>
      ) : (
        <>
          <Button
            className='mx-auto h-14 w-full max-w-[320px] rounded-xl bg-[#A03968] hover:bg-[#A03968]/80'
            asChild
          >
            <Link href='/cart'>Продолжить</Link>
          </Button>
          <Button
            className='w-full rounded-full bg-[#F2F2F2] hover:bg-[#F2F2F2]/80 text-[#404040]'
            asChild
          >
            <Link href='/cart'>Рекомендации</Link>
          </Button>
        </>
      )}
    </div>
  );
}

export default function CartMobilePreview({
  user,
  open,
  onClose,
}: {
  user: User | null;
  open: boolean;
  onClose: () => void;
}) {
  const [chooseOpen, setChooseOpen] = useState(false);

  return (
    <>
      {open ? (
        <MobileFullScreenShell
          title='корзина'
          onClose={onClose}
          contentClassName='px-4 pb-4'
          footer={<PreviewPayFooter />}
        >
          <section className='flex flex-col gap-4'>
            <Chosen setOpen={setChooseOpen} />
            <Orders user={user} />
            <div className='rounded-2xl bg-background p-4'>
              <ItemsList />
            </div>
          </section>
        </MobileFullScreenShell>
      ) : null}
      <Choose open={chooseOpen} setOpen={setChooseOpen} user={user} />
    </>
  );
}
