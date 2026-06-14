import Link from "next/link";
import { Button } from "../ui/button";

export default function ThanksCert() {
  return (
    <section className='flex flex-col flex-1 gap-4 rounded-lg bg-background p-0'>
      <div className='flex flex-col items-center justify-center gap-2 text-center max-w-xs mx-auto'>
        <p className='font-semibold text-base leading-none'>
          Сертификат был отправлен вам на вашу эл. почту
        </p>
        <p className='text-muted-foreground text-xs'>
          Проверьте вашу эл. почту, который вы указали при покупке сертификата
        </p>
      </div>
      <div className='w-full h-full space-y-4'>
        <div className='w-full h-full overflow-hidden rounded-xl flex items-center justify-center'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src='/images/thank-you.png'
            alt='thank-you'
            className='w-2/3 object-cover mx-auto'
          />
        </div>
      </div>
      <Button className='w-full rounded-full bg-[#A03968] p-6 text-xs' asChild>
        <Link href='/'>Вернуться в аптеку</Link>
      </Button>
    </section>
  );
}
