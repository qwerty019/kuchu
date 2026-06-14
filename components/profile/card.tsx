"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
import { LogoSvg, Svg1, Svg2 } from "../icons";
import EnrollForCard from "./enroll-for-card";
import { Button } from "../ui/button";
import { useMainStore } from "@/providers/main-store-provider";
import { DiscountCard } from "@/lib/definitions";
import { User } from "@/lib/auth";
import { useIsDesktop } from "@/hooks/use-is-desktop";

const Aurora = dynamic(() => import("@/components/Aurora"), { ssr: false });

const AURORA_COLOR_STOPS = ["#a348d5", "#890d66", "#5227FF"];

function usePrefersReducedMotion() {
  const query = "(prefers-reduced-motion: reduce)";
  return useSyncExternalStore(
    (onChange) => {
      const mql = matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => matchMedia(query).matches,
    () => false
  );
}

export default function Card({ user }: { user: User }) {
  const { discountCard } = useMainStore((state) => state);
  const isDesktop = useIsDesktop();
  const prefersReducedMotion = usePrefersReducedMotion();
  const showAurora = !isDesktop && !prefersReducedMotion;

  const content = (
    <>
      <div className='flex justify-between gap-2'>
        <LogoSvg />
        <div className='border rounded-full py-3 px-4 flex items-center gap-1'>
          <Svg1 className='text-[#FFFCED]' />
          <p className='text-white text-[10px]'>
            {discountCard ? discountCard?.accumulation : "Карта не найдена"}
          </p>
        </div>
      </div>
      <Svg2 className='ml-auto' />
      <div className='flex justify-between items-center gap-1'>
        <p className='text-white text-[10px]'>
          1% начисляем бонусами <br />
          До 30% — ваша скидка на заказ
        </p>
        <EnrollButton user={user} card={discountCard} />
      </div>
    </>
  );

  if (isDesktop) {
    return (
      <div className='flex flex-col justify-between w-full aspect-video rounded-2xl bg-[#865BBD] p-4 gap-3'>
        {content}
      </div>
    );
  }

  return (
    <div
      className={`relative flex w-full aspect-video flex-col justify-between overflow-hidden rounded-2xl ${
        showAurora ? "bg-black" : "bg-[#865BBD]"
      }`}
    >
      {showAurora && (
        <>
          <div className='pointer-events-none absolute inset-0'>
            <Aurora
              colorStops={AURORA_COLOR_STOPS}
              blend={0.5}
              amplitude={1.0}
              speed={1}
            />
          </div>
          <div
            className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black from-[30%] via-black/70 via-[55%] to-transparent'
            aria-hidden
          />
        </>
      )}
      <div className='relative z-10 flex h-full flex-col justify-between p-4 gap-3'>
        {content}
      </div>
    </div>
  );
}

const EnrollButton = ({
  user,
  card,
}: {
  user: User;
  card: DiscountCard | null;
}) => {
  if (card) {
    return (
      <Button className='bg-white text-[#865BBD] hover:bg-white rounded-full px-4 text-[10px] cursor-auto'>
        {card.barcode}
      </Button>
    );
  }

  if (user?.applied) {
    return (
      <Button
        disabled
        className='bg-white text-[#865BBD] hover:bg-slate-50 rounded-full text-[10px]'
      >
        Заявка отправлена
      </Button>
    );
  }

  return <EnrollForCard />;
};
