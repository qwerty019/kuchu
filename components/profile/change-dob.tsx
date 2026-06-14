"use client";

import { User } from "@/lib/auth";
import { Button } from "../ui/button";
import { useEffect, useMemo, useState } from "react";
import { changeDob } from "./actions";
import { useRouter } from "next/navigation";
import { CalendarIcon, Loader2 } from "lucide-react";
import DialogWrapper from "../modal/modal-wrapper";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";

export default function ChangeDob({ user }: { user: User }) {
  const [value, setValue] = useState<Date | undefined>(undefined);
  const [message, setMessage] = useState("");
  const [clicked, setClicked] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setValue(user.dob ? new Date(user.dob) : undefined);
  }, [user.dob]);

  const fourteenYearsAgo = useMemo(() => {
    const today = new Date();
    const fourteenYearsAgo = new Date(today);
    fourteenYearsAgo.setFullYear(today.getFullYear() - 14);
    return fourteenYearsAgo;
  }, []);

  const submit = async (date: Date | undefined) => {
    if (clicked) return;

    setMessage("");
    setClicked(true);

    const dateValue = formatDateToYYYYMMDD(date);

    const action = await changeDob(dateValue);
    if (action?.message) {
      setMessage(action.message);
      setClicked(false);
      return;
    }

    router.refresh();

    setClicked(false);
    setOpen(false);
  };

  return (
    <DialogWrapper
      title='Изменить номер'
      open={open}
      setOpen={setOpen}
      trigger={
        <Button
          variant='secondary'
          className='flex-col items-start bg-[#F2F2F2] rounded-2xl w-full p-3 h-auto'
          onClick={() => setOpen(true)}
        >
          <p>Изменить день рождения</p>
          <p className='text-muted-foreground'>
            {value ? format(value, "PPP", { locale: ru }) : "Не указан"}
          </p>
        </Button>
      }
    >
      <section className='space-y-4'>
        <div className='space-y-1'>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type='button'
                variant='secondary'
                className={cn(
                  "w-full pl-3 text-left font-normal rounded-xl",
                  !value && "text-muted-foreground"
                )}
              >
                {value ? (
                  format(value, "PPP", { locale: ru })
                ) : (
                  <span>День рождения</span>
                )}
                <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0' align='start'>
              <Calendar
                locale={ru}
                mode='single'
                selected={value}
                onSelect={(date) => {
                  setValue(date);
                }}
                defaultMonth={fourteenYearsAgo}
                disabled={(date) => {
                  const today = new Date();
                  const fourteenYearsAgo = new Date(today);
                  fourteenYearsAgo.setFullYear(today.getFullYear() - 14);
                  return date > fourteenYearsAgo;
                }}
                captionLayout='dropdown'
                formatters={{
                  formatMonthDropdown: (date) =>
                    date.toLocaleString("ru", { month: "short" }),
                  formatYearDropdown: (date) =>
                    date.toLocaleString("ru", { year: "numeric" }),
                }}
              />
            </PopoverContent>
          </Popover>
          {message && <p className='text-xs text-destructive'>{message}</p>}
        </div>
        <Button
          className='w-full text-xs rounded-full bg-[#A03968] hover:bg-[#A03968] text-white'
          disabled={clicked}
          onClick={() => submit(value)}
        >
          {clicked ? <Loader2 className='w-4 h-4 animate-spin' /> : "Изменить"}
        </Button>
      </section>
    </DialogWrapper>
  );
}

// Format date as YYYY-MM-DD directly from the Date object
const formatDateToYYYYMMDD = (date: Date | undefined): string | null => {
  if (!date) return null;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};
