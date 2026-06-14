"use client";

import { useState, useEffect } from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { useCookieConsent } from "@/providers/cookie-consent-provider";
import Link from "next/link";

interface CookieConsentProps {
  className?: string;
}

export function CookieConsent({ className }: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { hasConsented, giveConsent } = useCookieConsent();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Show the consent banner if the user hasn't consented yet
    if (mounted && hasConsented === false) {
      // Small delay to ensure the component mounts properly before animation
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [hasConsented, mounted]);

  const handleAccept = () => {
    giveConsent();
    setIsVisible(false);
  };

  // Only render on client
  if (!mounted || !isVisible) return null;

  return (
    <div
      className={cn(
        "fixed left-4 max-w-xs bg-background border rounded-lg shadow-lg p-3 z-10 transition-all duration-300 opacity-100 scale-100",
        "data-[state=closed]:opacity-0 data-[state=closed]:scale-95 space-y-2",
        "bottom-[72px] lg:bottom-4",
        className
      )}
      data-state={isVisible ? "open" : "closed"}
    >
      <p className='text-xs text-gray-700 dark:text-gray-300'>
        Мы используем файлы cookie для улучшения вашего опыта на нашем сайте.
        Используя наш сайт, вы соглашаетесь с использованием{" "}
        <Link
          href='/info/cookie'
          target='_blank'
          className='underline text-[#A03968] hover:text-[#A03968]/80'
        >
          cookie
        </Link>
        .
      </p>
      <div className='flex justify-end'>
        <Button
          onClick={handleAccept}
          size='sm'
          className='rounded-full h-8 text-xs bg-[#A03968] hover:bg-[#A03968]/80'
        >
          Принять
        </Button>
      </div>
    </div>
  );
}
