"use client";

import { navigateMobileFullPage } from "@/lib/mobile-full-page-nav";
import { cn } from "@/lib/utils";
import { ChevronLeft, X } from "lucide-react";

type MobileFullScreenShellProps = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  onClose?: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  contentClassName?: string;
};

export default function MobileFullScreenShell({
  title,
  subtitle,
  onBack,
  onClose,
  children,
  footer,
  contentClassName,
}: MobileFullScreenShellProps) {
  const handleHeaderAction = () => {
    if (onBack) {
      onBack();
      return;
    }
    if (onClose) {
      onClose();
      return;
    }
    navigateMobileFullPage("/");
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col bg-background lg:hidden",
        "pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)]"
      )}
    >
      <header className='relative flex shrink-0 items-center justify-center px-4 py-4'>
        <button
          type='button'
          onClick={handleHeaderAction}
          className='absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-accent'
          aria-label={onBack ? "Назад" : "Закрыть"}
        >
          {onBack ? (
            <ChevronLeft className='h-6 w-6' strokeWidth={1.5} />
          ) : (
            <X className='h-6 w-6' strokeWidth={1.5} />
          )}
        </button>
        {subtitle ? (
          <p className='max-w-[280px] text-center text-sm font-medium text-foreground'>
            {subtitle}
          </p>
        ) : (
          <h1 className='max-w-[280px] text-center text-2xl font-bold lowercase leading-tight tracking-tight text-foreground'>
            {title}
          </h1>
        )}
      </header>

      <div className='flex min-h-0 flex-1 flex-col overflow-hidden'>
        <div
          className={cn(
            "min-h-0 flex-1 overflow-y-auto scrollbar-hide",
            contentClassName
          )}
        >
          {children}
        </div>
        {footer ? (
          <div className='shrink-0 border-t border-border/60 bg-background px-4 py-4'>
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
