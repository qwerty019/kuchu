"use client";

import Link from "next/link";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Label } from "../ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { InputMask } from "@react-input/mask";
import { Input } from "../ui/input";
import { useEffect, useMemo, useState } from "react";
import { newCall, sendSmsCode } from "./actions";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { ru } from "date-fns/locale";

export function BottomText() {
  return (
    <p className='text-muted-foreground text-xs leading-none'>
      Продолжая авторизацию, вы соглашаетесь с{" "}
      <Link href='/docs/privacy.pdf' target='_blank' className='text-primary'>
        политикой конфиденциальности
      </Link>
      ,{" "}
      <Link href='/docs/terms.pdf' target='_blank' className='text-primary'>
        условиями сервиса
      </Link>{" "}
      и{" "}
      <Link href='/docs/payment.pdf' target='_blank' className='text-primary'>
        условиями продажи товаров
      </Link>
    </p>
  );
}

export function FormCheckbox({
  form,
  name,
  label,
}: {
  form: any;
  name: string;
  label: string;
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className='flex flex-row items-center gap-2 space-y-0'>
          <FormControl>
            <Checkbox
              className='bg-accent data-[state=checked]:bg-[#A03968] border-none w-5 h-5 rounded-full'
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <FormLabel className='text-xs font-normal leading-none'>
            {label}
          </FormLabel>
        </FormItem>
      )}
    />
  );
}

export function FormCode({
  form,
  clicked,
  className,
}: {
  form: any;
  clicked: boolean;
  className?: string;
}) {
  return (
    <FormField
      control={form.control}
      name='code'
      render={({ field }) => (
        <FormItem className={cn("space-y-4", className)}>
          <FormControl>
            <InputOTP
              maxLength={4}
              className='w-full max-w-[200px] mx-auto [&:input]:rounded-xl'
              {...field}
              autoFocus
              disabled={clicked}
            >
              <InputOTPGroup className='w-full max-w-[172px] gap-2 mx-auto'>
                <InputOTPSlot
                  className='w-full h-12 bg-accent first:rounded-xl border-none rounded-xl text-2xl font-semibold'
                  index={0}
                />
                <InputOTPSlot
                  className='w-full h-12 bg-accent first:rounded-xl border-none rounded-xl text-2xl font-semibold'
                  index={1}
                />
                <InputOTPSlot
                  className='w-full h-12 bg-accent first:rounded-xl border-none rounded-xl text-2xl font-semibold'
                  index={2}
                />
                <InputOTPSlot
                  className='w-full h-12 bg-accent last:rounded-xl border-none rounded-xl text-2xl font-semibold'
                  index={3}
                />
              </InputOTPGroup>
            </InputOTP>
          </FormControl>
          <FormMessage className='text-xs block text-center' />
        </FormItem>
      )}
    />
  );
}

export function FormPhone({ form }: { form: any }) {
  return (
    <FormField
      control={form.control}
      name='phone'
      render={({ field }) => (
        <FormItem>
          <FormLabel className='block text-center text-xs text-muted-foreground'>
            Телефон
          </FormLabel>
          <FormControl>
            <InputMask
              mask='+7 (___) ___-__-__'
              replacement={{ _: /\d/ }}
              className='w-full p-0 border-none h-auto text-2xl font-semibold focus-visible:ring-0 mx-auto text-center focus:outline-none'
              value={field.value}
              onChange={(e) => {
                field.onChange(e.target.value);
              }}
              placeholder='+7 (___) ___-__-__'
            />
          </FormControl>
          <FormMessage className='text-center text-xs' />
        </FormItem>
      )}
    />
  );
}

export function FormInput({
  form,
  name,
  label,
}: {
  form: any;
  name: string;
  label: string;
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Input
              {...field}
              placeholder={label}
              value={field.value ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                field.onChange(value || null, { shouldDirty: true });
              }}
              className='bg-accent border-none rounded-xl'
            />
          </FormControl>
          <FormMessage className='text-xs' />
        </FormItem>
      )}
    />
  );
}

export function FormDate({
  form,
  name,
  label,
}: {
  form: any;
  name: string;
  label: string;
}) {
  const [value, setValue] = useState<Date | undefined>(undefined);

  const fourteenYearsAgo = useMemo(() => {
    const today = new Date();
    const fourteenYearsAgo = new Date(today);
    fourteenYearsAgo.setFullYear(today.getFullYear() - 14);
    return fourteenYearsAgo;
  }, []);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className='flex flex-col'>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  type='button'
                  variant='secondary'
                  className={cn(
                    "w-full pl-3 text-left font-normal rounded-xl",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(field.value, "PPP", { locale: ru })
                  ) : (
                    <span>{label}</span>
                  )}
                  <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0' align='start'>
              <Calendar
                locale={ru}
                mode='single'
                selected={value}
                onSelect={(date) => {
                  setValue(date);
                  const dateString = formatDateToYYYYMMDD(date);
                  field.onChange(dateString, { shouldDirty: true });
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
          <FormMessage className='text-xs' />
        </FormItem>
      )}
    />
  );
}

const formatDateToYYYYMMDD = (date: Date | undefined): string | null => {
  if (!date) return null;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const DURATION = 1 * 60;

interface CountdownProps {
  date: Date | string;
  form: any;
}

export function Countdown({ date, form }: CountdownProps) {
  const [clicked, setClicked] = useState(false);
  const [clicked2, setClicked2] = useState(false);
  const [timeLeft, setTimeLeft] = useState(DURATION);

  useEffect(() => {
    if (!date) return;

    const startTime =
      date instanceof Date ? date.getTime() : new Date(date).getTime();

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const endTime = startTime + DURATION * 1000;
      const difference = Math.max(Math.floor((endTime - now) / 1000), 0);

      setTimeLeft(difference);
    };

    // Initial calculation
    calculateTimeLeft();

    const intervalId = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(intervalId);
  }, [date]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  async function getNewCode() {
    if (clicked || clicked2) return;

    const phone = form.watch("phone");
    if (!phone) return;

    setClicked(true);

    const action = await newCall(phone);
    if ("message" in action) {
      form.setError("code", { message: action.message });
    } else {
      form.setValue("callId", action.callId);
      form.setValue("date", new Date(action.date));
      form.setError("code", { message: "" });
      form.setValue("type", "call");
      form.setValue("code", "");
    }

    setClicked(false);
  }

  async function getSmsCode() {
    if (clicked || clicked2) return;

    const phone = form.watch("phone");
    if (!phone) return;

    setClicked2(true);

    const action = await sendSmsCode(phone);
    if ("message" in action) {
      form.setError("code", { message: action.message });
    } else {
      form.setValue("callId", action.callId);
      form.setValue("date", new Date(action.date));
      form.setError("code", { message: "" });
      form.setValue("type", "sms");
      form.setValue("code", "");
    }

    setClicked2(false);
  }

  if (!date) return null;

  return (
    <div className='flex flex-col items-center justify-center gap-4'>
      {timeLeft !== 0 && (
        <Label className='block text-center text-xs text-muted-foreground'>
          {`Получить новый можно через ${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`}
        </Label>
      )}
      <div className='flex flex-col items-center justify-center gap-2'>
        {timeLeft === 0 && (
          <>
            <Button
              type='button'
              variant='outline'
              className='mx-auto w-full max-w-[200px] rounded-full p-3 text-xs'
              onClick={() => getSmsCode()}
              disabled={clicked || clicked2}
            >
              {clicked2 ? (
                <Loader2 className='w-4 h-4 animate-spin' />
              ) : (
                "Получить код по SMS"
              )}
            </Button>
            <Button
              type='button'
              variant='outline'
              className='mx-auto w-full max-w-[200px] rounded-full p-3 text-xs'
              onClick={() => getNewCode()}
              disabled={clicked || clicked2}
            >
              {clicked ? (
                <Loader2 className='w-4 h-4 animate-spin' />
              ) : (
                "Получить код через звонок"
              )}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
