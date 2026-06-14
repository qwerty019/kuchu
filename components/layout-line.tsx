"use client";

import { usePathname } from "next/navigation";

export default function LayoutLine() {
  const pathname = usePathname();

  const isAdmin = pathname.includes("/admin");

  if (isAdmin) {
    return (
      <>
        <div className='fixed z-20 top-[56px] lg:top-[80px] left-0 right-0 bg-[#F3F2F2] lg:mr-4 lg:ml-[calc(240px+32px)]'>
          <div className='w-full bg-background rounded-t-2xl h-4'></div>
        </div>
        <div className='hidden lg:block z-20 w-full fixed top-[64px]'>
          <div className='w-full bg-[#F3F2F2] h-4' />
        </div>
      </>
    );
  }

  return (
    <>
      <div className='max-lg:hidden fixed z-20 top-[56px] left-0 right-0 bg-[#F3F2F2] lg:top-[80px] lg:right-[var(--kuchu-main-mr)] lg:left-[var(--kuchu-main-ml)]'>
        <div className='h-4 w-full rounded-t-2xl bg-background'></div>
      </div>
      <div className='fixed z-20 top-[64px] right-[var(--kuchu-main-mr)] left-[var(--kuchu-main-ml)] hidden lg:block'>
        <div className='h-4 w-full bg-[#F3F2F2]' />
      </div>
    </>
  );
}
