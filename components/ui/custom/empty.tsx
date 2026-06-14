import { cn } from "@/lib/utils";

export default function Empty({
  message,
  className,
}: {
  message?: string;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "flex flex-col items-center justify-center w-full h-full gap-4",
        className
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className='w-full max-w-[120px]'
        src='/images/empty-search.png'
        alt='Ничего не найдено'
      />
      <p className='text-muted-foreground text-center text-sm'>
        {message || "Ничего не найдено"}
      </p>
    </section>
  );
}
