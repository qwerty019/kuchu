"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  footerContacts,
  footerInfoLinks,
  footerLegalText,
  searchListDividerClass,
} from "@/lib/footer-links";
import { cn } from "@/lib/utils";

export default function SearchMobileFooter() {
  const pathname = usePathname();

  return (
    <footer className='-mx-4 mt-2 bg-[#F3F2F2] px-4 pb-6 pt-2 lg:hidden'>
      {footerInfoLinks.map(({ title, href }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            searchListDividerClass,
            "block py-4 text-sm font-normal leading-tight transition-colors",
            pathname === href
              ? "text-[#A03968]"
              : "text-foreground hover:text-[#A03968]",
          )}
        >
          {title}
        </Link>
      ))}

      <section className={cn(searchListDividerClass, "space-y-3 py-4")}>
        <div className='flex flex-wrap gap-2'>
          {footerContacts.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              target='_blank'
              rel='noopener noreferrer'
              className='rounded-full bg-background px-4 py-2 text-sm font-medium text-muted-foreground hover:text-[#A03968]'
            >
              {c.value}
            </Link>
          ))}
        </div>
        <p className='text-xs leading-relaxed text-[#A6A7A6]'>{footerLegalText}</p>
      </section>
    </footer>
  );
}
