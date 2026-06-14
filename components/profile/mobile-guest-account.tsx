"use client";

import LoginForm from "@/components/login/login-form";
import { Button } from "@/components/ui/button";
import { navigateMobileFullPage } from "@/lib/mobile-full-page-nav";
import { cn } from "@/lib/utils";
import { ChevronLeft, X } from "lucide-react";
import Link from "next/link";
import { Suspense, useCallback, useRef, useState } from "react";
import Loading from "@/components/search/loading";

type Step = "welcome" | "login";

export default function MobileGuestAccount({
  callbackUrl = "/profile",
}: {
  callbackUrl?: string;
}) {
  const [step, setStep] = useState<Step>("welcome");
  const [showHeaderBack, setShowHeaderBack] = useState(true);
  const loginBackRef = useRef<(() => boolean) | null>(null);

  const close = () => {
    navigateMobileFullPage("/");
  };

  const handleBack = useCallback(() => {
    if (step === "login" && loginBackRef.current?.()) {
      return;
    }
    if (step === "login") {
      setStep("welcome");
    }
  }, [step]);

  const registerLoginBackHandler = useCallback((handler: () => boolean) => {
    loginBackRef.current = handler;
    return () => {
      if (loginBackRef.current === handler) {
        loginBackRef.current = null;
      }
    };
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col bg-background lg:hidden",
        "pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)]"
      )}
    >
      <header className='relative flex shrink-0 items-center justify-center px-4 pb-5 pt-20'>
        {step === "login" && showHeaderBack && (
          <button
            type='button'
            onClick={handleBack}
            className='absolute left-4 top-6 flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-accent'
            aria-label='Назад'
          >
            <ChevronLeft className='h-6 w-6' strokeWidth={1.5} />
          </button>
        )}
        <button
          type='button'
          onClick={close}
          className='absolute right-4 top-6 flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-accent'
          aria-label='Закрыть'
        >
          <X className='h-6 w-6' strokeWidth={1.5} />
        </button>
        {step === "welcome" && (
          <h1 className='max-w-[280px] text-center text-2xl font-bold lowercase leading-tight tracking-tight text-foreground'>
            войти в личный кабинет
          </h1>
        )}
        {step === "login" && (
          <p className='text-center text-sm font-medium text-foreground'>
            Вход по номеру телефона
          </p>
        )}
      </header>

      {step === "welcome" ? (
        <div className='flex min-h-0 flex-1 flex-col px-6 pb-8'>
          <div className='min-h-0 flex-[2]' aria-hidden />

          <div className='flex shrink-0 flex-col items-center'>
            <Button
              type='button'
              variant='outline'
              className='h-14 w-full max-w-[320px] rounded-xl border-2 border-[#A03968] bg-background text-xs font-semibold tracking-[0.12em] text-[#A03968] hover:bg-[#A03968]/5 hover:text-[#A03968]'
              onClick={() => {
                setShowHeaderBack(true);
                setStep("login");
              }}
            >
              ПО НОМЕРУ ТЕЛЕФОНА
            </Button>
          </div>

          <div className='flex min-h-0 flex-1 flex-col justify-end pt-10'>
          <p className='mx-auto max-w-[300px] text-center text-xs leading-relaxed text-muted-foreground'>
            При входе и регистрации вы соглашаетесь с{" "}
            <Link
              href='/info/privacy_policy'
              className='text-[#A03968] underline underline-offset-2'
            >
              политикой обработки персональных данных
            </Link>
            .
          </p>
          </div>
        </div>
      ) : (
        <div className='flex min-h-0 flex-1 flex-col px-4 pb-6'>
          <Suspense fallback={<Loading />}>
            <LoginForm
              callbackUrl={callbackUrl}
              className='flex-1'
              registerBackHandler={registerLoginBackHandler}
              onHeaderBackVisibleChange={setShowHeaderBack}
            />
          </Suspense>
        </div>
      )}
    </div>
  );
}
