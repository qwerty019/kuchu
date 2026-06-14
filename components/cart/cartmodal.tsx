"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { ChevronLeft, X } from "lucide-react";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import MobileFullScreenShell from "@/components/layout/mobile-full-screen-shell";
import { User } from "@/lib/auth";
import { useEffect, useState } from "react";
import { cn, createTimeSlots, getHourAndMinuteInTimezone } from "@/lib/utils";
import { Info } from "./definitions";
import { useMainStore } from "@/providers/main-store-provider";
import ItemsList from "./content/items-list";
import Ordering from "./content/ordering";
import { MainButton, MainButtonMobile, PriceInfo } from "./content/pay-button";

const timezone = "Asia/Yakutsk";

export default function CartModal({ user }: { user: User | null }) {
  const pathname = usePathname();
  const [step, setStep] = useState<number>(0);
  const [slots, setSlots] = useState<
    { label: string; value: string; desc: string | undefined }[]
  >([]);

  const isDesktop = useIsDesktop();
  const { method } = useMainStore((state) => state);

  const [info, setInfo] = useState<Info>({
    time: "",
    date: "today",
    useCard: false,
    payment: "card",
    comment: "",
    value: method,
    contact: "",
    promo: "",
    cert: "",
    type: null,
    banknote: "",
    interval: "asap",
  });

  useEffect(() => {
    const { hour, minute } = getHourAndMinuteInTimezone(timezone);

    const createdSlots = createTimeSlots(hour, minute);

    setSlots(createdSlots);
    setInfo((prev) => ({
      ...prev,
      time: createdSlots[0].value,
      date: createdSlots[0].desc === "Завтра" ? "tomorrow" : "today",
      interval: "asap",
    }));
  }, []);

  if (pathname !== "/cart") {
    return null;
  }

  if (isDesktop) {
    return (
      <DialogWrapper step={step} setStep={setStep}>
        <section className='bg-[#F3F2F2] flex gap-4 h-full'>
          <Ordering
            step={step}
            info={info}
            setInfo={setInfo}
            user={user}
            slots={slots}
          />
          <div className='bg-[#A03968] p-4 flex flex-col h-full rounded-2xl w-full md:w-[300px]'>
            <p className='font-semibold text-lg text-white'>Ваш заказ</p>
            <div className='bg-background p-4 rounded-2xl flex flex-col overflow-hidden flex-1 my-4'>
              <div className='flex flex-col overflow-auto flex-1'>
                <ItemsList className='max-h-[460px]' />
                <PriceInfo info={info} />
              </div>
            </div>
            <MainButton info={info} step={step} setStep={setStep} />
          </div>
        </section>
      </DialogWrapper>
    );
  }

  const title = getCartMobileTitle(step);

  return (
    <MobileCartWrapper
      step={step}
      setStep={setStep}
      title={title}
      footer={
        <>
          <PriceInfo info={info} />
          <MainButtonMobile info={info} step={step} setStep={setStep} />
        </>
      }
    >
      <section className='flex flex-col gap-4 bg-[#F3F2F2] pb-4'>
        <div className='flex flex-col justify-between gap-4 rounded-2xl bg-background p-4'>
          <p className='text-lg font-semibold'>Ваш заказ</p>
          <ItemsList />
        </div>
        <Ordering
          step={step}
          info={info}
          setInfo={setInfo}
          user={user}
          slots={slots}
          isMobile
        />
      </section>
    </MobileCartWrapper>
  );
}

function getCartMobileTitle(step: number) {
  if (step === 0) return "корзина";
  return "оформление заказа";
}

function getMobileCartBackStep(step: number) {
  return step === 2 ? 0 : step - 1;
}

function MobileCartWrapper({
  children,
  step,
  setStep,
  title,
  footer,
}: {
  children: React.ReactNode;
  step: number;
  setStep: (num: number) => void;
  title: string;
  footer: React.ReactNode;
}) {
  const router = useRouter();

  function onDismiss() {
    if (window.history.length <= 2) {
      router.push("/");
    } else {
      router.back();
    }
  }

  return (
    <MobileFullScreenShell
      title={title}
      onBack={
        step !== 0 ? () => setStep(getMobileCartBackStep(step)) : undefined
      }
      onClose={onDismiss}
      contentClassName='px-4'
      footer={<div className='flex flex-col gap-4'>{footer}</div>}
    >
      {children}
    </MobileFullScreenShell>
  );
}

function DialogWrapper({
  children,
  step,
  setStep,
  className,
}: {
  children: React.ReactNode;
  step: number;
  setStep: (num: number) => void;
  className?: string;
}) {
  const router = useRouter();

  function onDismiss() {
    if (window.history.length <= 2) {
      router.push("/");
    } else {
      router.back();
    }
  }

  return (
    <Dialog
      open={true}
      onOpenChange={(open) => {
        if (!open) onDismiss();
      }}
    >
      <DialogContent
        className={cn(
          `sm:max-w-3xl w-full bg-[#F3F2F2] [&_.close-dialog]:hidden rounded-2xl sm:rounded-2xl h-[748px] flex flex-col`,
          className
        )}
      >
        <div className='flex items-center justify-between gap-2 w-full h-fit'>
          <div>
            <DialogTitle className='font-semibold text-base'>
              Время для здоровья – сейчас
            </DialogTitle>
            <DialogDescription className='text-xs text-muted-foreground hidden'>
              Подзаголовок
            </DialogDescription>
          </div>
          {step !== 0 && (
            <Button
              type='button'
              variant='secondary'
              className='bg-white absolute right-[60px] top-[24px] p-2 flex items-center justify-center rounded-full h-auto'
              onClick={() => setStep(step - 1)}
            >
              <ChevronLeft className='w-4 h-4' />
            </Button>
          )}
          <Button
            type='button'
            variant='secondary'
            className='p-2 flex bg-white items-center justify-center rounded-full h-auto'
            onClick={onDismiss}
          >
            <X className='w-4 h-4' />
          </Button>
        </div>
        {children}
      </DialogContent>
    </Dialog>
  );
}
