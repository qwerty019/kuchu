"use client";

import { cn } from "@/lib/utils";
import { usePathname, useSearchParams } from "next/navigation";

/** Фон области над нижней навигацией на мобилке */
export default function MobileContentShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isSearchHub =
    pathname === "/search" && !searchParams.get("query")?.toString();

  return (
    <div
      className={cn(
        "relative flex w-full min-h-0 flex-1 flex-col max-lg:mb-0 lg:mb-4 max-lg:pb-[calc(0.5rem+4.25rem+env(safe-area-inset-bottom,0px))]",
        isSearchHub ? "max-lg:bg-[#F3F2F2]" : "max-lg:bg-background",
      )}
    >
      {children}
    </div>
  );
}
