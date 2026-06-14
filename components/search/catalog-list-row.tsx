"use client";

import { cn } from "@/lib/utils";
import { searchListDividerClass } from "@/lib/footer-links";
import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";

type CatalogListRowProps = {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  showChevron?: boolean;
  endIcon?: LucideIcon;
  className?: string;
  labelClassName?: string;
  active?: boolean;
};

export function CatalogListRow({
  href,
  onClick,
  children,
  showChevron = false,
  endIcon: EndIcon,
  className,
  labelClassName,
  active = false,
}: CatalogListRowProps) {
  const rowClass = cn(
    searchListDividerClass,
    "flex w-full items-center justify-between gap-3 py-4 text-left transition-colors",
    active ? "text-[#A03968]" : "text-foreground",
    className,
  );

  const TrailingIcon = EndIcon ?? (showChevron ? ChevronRight : null);

  const content = (
    <>
      <span
        className={cn(
          "min-w-0 flex-1 text-base font-semibold leading-tight",
          labelClassName,
        )}
      >
        {children}
      </span>
      {TrailingIcon && (
        <TrailingIcon
          className={cn(
            "h-5 w-5 shrink-0 text-muted-foreground",
            active && "text-[#A03968]",
          )}
          aria-hidden
        />
      )}
    </>
  );

  if (href) {
    if (href.startsWith("http")) {
      return (
        <a
          href={href}
          target='_blank'
          rel='noopener noreferrer'
          className={rowClass}
          onClick={onClick}
        >
          {content}
        </a>
      );
    }

    return (
      <Link href={href} className={rowClass} onClick={onClick}>
        {content}
      </Link>
    );
  }

  return (
    <button type='button' className={rowClass} onClick={onClick}>
      {content}
    </button>
  );
}

export function CatalogListSubRow({
  href,
  children,
  active = false,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        searchListDividerClass,
        "block py-3 pl-12 pr-4 text-sm font-medium transition-colors",
        active ? "text-[#A03968]" : "text-muted-foreground hover:text-primary",
      )}
    >
      {children}
    </Link>
  );
}
