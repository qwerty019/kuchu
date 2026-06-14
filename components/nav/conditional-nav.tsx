"use client";

import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

/** Витрина: без шапки на мобилке. Десктоп: sticky-обёртка на всю ширину (как раньше у Nav). */
export default function ConditionalNav({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <div
      className={cn(
        "sticky top-0 z-20 w-full shrink-0",
        !isAdmin && "max-lg:hidden"
      )}
    >
      {children}
    </div>
  );
}
