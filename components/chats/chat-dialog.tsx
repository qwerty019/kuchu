"use client";

import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { ChevronUp, X } from "lucide-react";
import { useState } from "react";
import { Input } from "../ui/input";

export default function ChatDialog() {
  const [open, setOpen] = useState(false);

  return (
    <DialogWrapper
      title='Консультант'
      open={open}
      setOpen={setOpen}
      trigger={<Button>Консультант</Button>}
      className='h-full max-h-[800px]'
    >
      <div className='relative bg-white rounded-2xl p-4 text-primary flex flex-col gap-4 flex-1 flex-grow'>
        <div className='flex-1 flex flex-col justify-center items-center gap-8'>
          <div className='flex flex-col gap-2 items-center justify-center text-[#8638E5]'>
            <Stars className='w-6 h-6' />
            <h4 className='text-base font-semibold'>Здравствуйте, Сардаана!</h4>
          </div>
          <div className='space-y-1 max-w-sm mx-auto'>
            {texts.map((text, index) => (
              <div
                key={index}
                className='space-y-1 bg-[#F2F2F2] rounded-2xl p-4 text-sm'
              >
                <h5 className='font-semibold'>{text.title}</h5>
                <p className='leading-none'>{text.text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className='relative'>
          <Input
            placeholder='Cпрашивайте о чем угодно в рамках аптеки'
            className='rounded-2xl bg-[#F2F2F2] border-none h-12'
          />
          <Button
            type='button'
            size='icon'
            className='bg-white hover:bg-white/80 text-[#404040] w-8 h-8 absolute right-2 top-1/2 -translate-y-1/2 rounded-full'
          >
            <ChevronUp className='w-4 h-4' />
          </Button>
        </div>
      </div>
    </DialogWrapper>
  );
}

const texts = [
  {
    title: "Рекомендации",
    text: "Просто напишите какие у вас симптомы и спросите какие препараты могут подойти",
  },
  {
    title: "Вопросы по доставке",
    text: "Ответим на любые вопросы связанные с этой аптекой. Например о компании, о условиях доставки",
  },
  {
    title: "Обратная связь",
    text: "Если у вас возникли трудности в поцессе оформления заказа, пожалуйста напишите нам, чтобы мы это исправили",
  },
  {
    title: "Связь с аптекой",
    text: "Если что то срочное, можете сразу свзяаться по Whatsapp напрямую с аптекой",
  },
];

function DialogWrapper({
  title,
  open,
  setOpen,
  trigger,
  children,
  className,
}: {
  title: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
  trigger?: React.ReactNode;
  className?: string;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className={cn(
          "[&_.close-dialog]:hidden max-w-xl sm:rounded-2xl bg-[#865BBD] flex flex-col",
          className
        )}
      >
        <DialogHeader className='flex flex-row space-y-0 items-center justify-between gap-2 h-8'>
          <div>
            <div className='flex items-center gap-2 text-white'>
              <Stars className='w-5 h-5' />
              <DialogTitle>{title}</DialogTitle>
            </div>
            <DialogDescription className='hidden'>
              Подзаголовок
            </DialogDescription>
          </div>
          <DialogClose asChild>
            <Button
              type='button'
              variant='secondary'
              className='close-button p-0 w-8 h-8 flex items-center justify-center bg-[#F2F2F2] rounded-full shrink-0'
            >
              <X className='w-4 h-4' />
            </Button>
          </DialogClose>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

function Stars({ className }: { className?: string }) {
  return (
    <svg
      viewBox='0 0 25 25'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M7.14286 5.35714C7.79012 5.35714 8.34476 5.82003 8.46054 6.45685L8.9111 8.93492C9.07741 9.84961 9.79324 10.5655 10.7079 10.7318L13.186 11.1823C13.8228 11.2981 14.2857 11.8527 14.2857 12.5C14.2857 13.1473 13.8228 13.7019 13.186 13.8177L10.7079 14.2682C9.79324 14.4345 9.07741 15.1504 8.9111 16.0651L8.46054 18.5432C8.34476 19.18 7.79012 19.6429 7.14286 19.6429C6.4956 19.6429 5.94096 19.18 5.82517 18.5431L5.37462 16.0651C5.20831 15.1504 4.49247 14.4345 3.57777 14.2682L1.09971 13.8177C0.462889 13.7019 0 13.1473 0 12.5C0 11.8527 0.462889 11.2981 1.09971 11.1823L3.57778 10.7318C4.49247 10.5655 5.20831 9.84961 5.37462 8.93492L5.82517 6.45685C5.94096 5.82003 6.4956 5.35714 7.14286 5.35714Z'
        fill='currentColor'
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M19.6429 0C20.2408 0 20.7663 0.396398 20.9306 0.971356L21.2784 2.18857C21.4903 2.9301 22.0699 3.50974 22.8114 3.72161L24.0286 4.06939C24.6036 4.23366 25 4.75918 25 5.35714C25 5.95511 24.6036 6.48062 24.0286 6.6449L22.8114 6.99267C22.0699 7.20454 21.4903 7.78418 21.2784 8.52572L20.9306 9.74293C20.7663 10.3179 20.2408 10.7143 19.6429 10.7143C19.0449 10.7143 18.5194 10.3179 18.3551 9.74293L18.0073 8.52572C17.7955 7.78418 17.2158 7.20454 16.4743 6.99267L15.2571 6.6449C14.6821 6.48062 14.2857 5.95511 14.2857 5.35714C14.2857 4.75918 14.6821 4.23366 15.2571 4.06939L16.4743 3.72161C17.2158 3.50974 17.7955 2.93011 18.0073 2.18857L18.3551 0.971356C18.5194 0.396398 19.0449 0 19.6429 0Z'
        fill='currentColor'
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M16.0714 17.8571C16.686 17.8571 17.2217 18.2754 17.3707 18.8716C17.5256 19.4909 18.0091 19.9744 18.6284 20.1293C19.2246 20.2783 19.6429 20.814 19.6429 21.4286C19.6429 22.0431 19.2246 22.5788 18.6284 22.7279C18.0091 22.8827 17.5256 23.3662 17.3707 23.9855C17.2217 24.5817 16.686 25 16.0714 25C15.4569 25 14.9212 24.5817 14.7721 23.9855C14.6173 23.3662 14.1338 22.8827 13.5145 22.7279C12.9183 22.5788 12.5 22.0431 12.5 21.4286C12.5 20.814 12.9183 20.2783 13.5145 20.1293C14.1338 19.9744 14.6173 19.4909 14.7721 18.8716C14.9212 18.2754 15.4569 17.8571 16.0714 17.8571Z'
        fill='currentColor'
      />
    </svg>
  );
}
