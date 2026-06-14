"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  footerContacts,
  footerLegalText,
  footerLinks1,
  footerLinks2,
  footerStreamlineHref,
} from "@/lib/footer-links";

export default function Footer() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <footer
      className={`hidden lg:block min-w-0 mt-auto space-y-6 p-4 ${
        isAdmin
          ? "lg:ml-[calc(240px+16px+16px)]"
          : "lg:ml-[var(--kuchu-main-ml)] lg:mr-[var(--kuchu-main-mr)] lg:w-[var(--kuchu-main-w)]"
      } ${
        isAdmin
          ? "mb-12"
          : "mb-[calc(3rem+4.25rem+env(safe-area-inset-bottom,0px))] lg:mb-12"
      } bg-background rounded-2xl`}
    >
      <section className='flex items-center gap-2 flex-wrap'>
        {footerContacts.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            target='_blank'
            className='bg-[#F2F2F2] shrink-0 rounded-full py-2 px-4 text-sm font-medium text-muted-foreground hover:text-primary'
          >
            {c.value}
          </Link>
        ))}
      </section>
      <section className='flex flex-col sm:flex-row gap-8 sm:gap-16 '>
        <section className='space-y-2 w-fit'>
          {footerLinks1.map(({ title, href }) => (
            <FooterLink key={href} href={href}>
              {title}
            </FooterLink>
          ))}
        </section>
        <section className='space-y-2'>
          {footerLinks2.map(({ title, href }) => (
            <FooterLink key={href} href={href}>
              {title}
            </FooterLink>
          ))}
        </section>
      </section>
      <p className='text-xs text-[#A6A7A6]'>{footerLegalText}</p>
      <a
        href={footerStreamlineHref}
        target='_blank'
        className='text-xs text-[#A6A7A6] hover:underline'
      >
        Бесплатные иллюстрации от Streamline
      </a>
    </footer>
  );
}

function FooterLink({
  children,
  href,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={`block w-fit min-w-[140px] ${
        pathname === href
          ? "text-primary"
          : "text-muted-foreground hover:text-primary"
      }`}
    >
      <p className='font-medium text-sm w-fit'>{children}</p>
    </Link>
  );
}
