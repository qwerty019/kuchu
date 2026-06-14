"use client";

import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../ui/form";
import { checkCode, firstCall, setSession } from "./actions";
import { useMainStore } from "@/providers/main-store-provider";
import { useRouter, useSearchParams } from "next/navigation";
import {
  BottomText,
  Countdown,
  FormCheckbox,
  FormCode,
  FormDate,
  FormInput,
  FormPhone,
} from "./components";
import { cn } from "@/lib/utils";
import { formSchema } from "./schema";

export default function LoginForm({
  callbackUrl,
  className,
  registerBackHandler,
  onHeaderBackVisibleChange,
}: {
  callbackUrl?: string;
  className?: string;
  registerBackHandler?: (handler: () => boolean) => () => void;
  onHeaderBackVisibleChange?: (visible: boolean) => void;
}) {
  const [step, setStep] = useState(1);
  const [clicked, setClicked] = useState(false);
  const [message, setMessage] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();

  const route = callbackUrl ?? searchParams.get("callbackUrl");

  const { setAddresses, setDiscountCard } = useMainStore((state) => state);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: "",
      promo: true,
      share: true,
      isNew: false,
      callId: null,
      date: null,
      code: "",
      surname: null,
      name: null,
      dob: null,
      type: "call",
    },
  });

  const callId = form.watch("callId");
  const isNew = form.watch("isNew");
  const date = form.watch("date");
  const type = form.watch("type");
  const code = form.watch("code");

  const handleAuthBack = useCallback((): boolean => {
    if (isNew && step === 2) {
      return false;
    }
    if (callId) {
      form.setValue("callId", null);
      form.setValue("code", "");
      form.setValue("date", null);
      form.setValue("isNew", false);
      form.clearErrors();
      setStep(1);
      setMessage("");
      return true;
    }
    return false;
  }, [callId, form, isNew, step]);

  useEffect(() => {
    if (!registerBackHandler) return;
    return registerBackHandler(handleAuthBack);
  }, [handleAuthBack, registerBackHandler]);

  useEffect(() => {
    onHeaderBackVisibleChange?.(!(isNew && step === 2));
  }, [isNew, onHeaderBackVisibleChange, step]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (clicked) return;

    setClicked(true);
    setMessage("");

    if (!callId) {
      const action1 = await firstCall(values);
      if ("message" in action1) {
        setClicked(false);
        form.setError("phone", { message: action1.message });
        return;
      }
      form.setValue("callId", action1.callId);
      form.setValue("date", new Date(action1.date));
      form.setValue("isNew", action1.isNew);
      setClicked(false);
    } else {
      const action2 = await checkCode(values);
      if ("message" in action2) {
        setClicked(false);
        form.setError("code", { message: action2.message });
        if (action2?.name === "code") form.setValue("code", "");
        if (action2.message === "Код устарел. Повторите снова.") {
          form.setValue("date", new Date("2024-01-01"));
        }
        setMessage(action2.message || "");
        return;
      }

      if (action2.addresses) setAddresses(action2.addresses);
      if (action2.discountCard) setDiscountCard(action2.discountCard);

      await setSession(action2.userId);

      router.replace(route || "/profile");
      window.location.reload();
    }
  }

  const formClassName = cn(
    "flex h-full w-full flex-grow flex-col items-center justify-between gap-4",
    className
  );

  if (!callId) {
    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={formClassName}
        >
          <div></div>
          <div className='space-y-4'>
            <FormPhone form={form} />
            <div className='flex flex-col items-center justify-center gap-2'>
              <Button
                type='submit'
                className='w-full max-w-[200px] rounded-full bg-[#A03968] hover:bg-[#A03968]/80 p-6 text-xs'
                disabled={clicked}
              >
                {clicked ? (
                  <>
                    <Loader2 className='w-4 h-4 animate-spin mr-2' />
                    Подождите...
                  </>
                ) : (
                  "Получить код"
                )}
              </Button>
              <Label className='block text-center w-full text-xs text-muted-foreground mx-auto font-normal'>
                Вам позвонят, <br />
                последние 4 цифры номера, это ваш код
              </Label>
            </div>
          </div>
          <BottomText />
        </form>
      </Form>
    );
  }

  if (isNew) {
    if (step === 1) {
      return (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={formClassName}
          >
            <div></div>
            <div className='space-y-4'>
              <FormCode form={form} clicked={clicked} />
              <div className='flex flex-col items-center justify-center'>
                <Button
                  type='button'
                  className='mx-auto w-[200px] rounded-full bg-[#A03968] hover:bg-[#A03968]/80 p-6 text-xs'
                  onClick={() => setStep(2)}
                  disabled={code.length !== 4}
                >
                  Продолжить
                </Button>
              </div>
              {type === "call" && (
                <Label className='block text-center text-xs text-muted-foreground max-w-xs'>
                  Введите последние 4 цифры номера, которые вам позвонили
                </Label>
              )}
              {type === "sms" && (
                <Label className='block text-center text-xs text-muted-foreground max-w-xs'>
                  Введите 4 цифры кода, который вам пришел по SMS
                </Label>
              )}
              {date && <Countdown form={form} date={date} />}
            </div>
            <div className='space-y-2'>
              <FormCheckbox
                form={form}
                name='promo'
                label='Получать предложения об акциях и скидках'
              />
              <FormCheckbox
                form={form}
                name='share'
                label='Делиться данными с партнерами Kuchu'
              />
            </div>
          </form>
        </Form>
      );
    }

    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={formClassName}
        >
          <div></div>
          <div className='space-y-4'>
            <div className='space-y-4'>
              <FormInput form={form} name='surname' label='Фамилия' />
              <FormInput form={form} name='name' label='Имя' />
              <FormDate form={form} name='dob' label='Дата рождения' />
            </div>
            <div className='flex gap-1 flex-col items-center justify-center'>
              <Button
                type='submit'
                className='mx-auto w-[200px] rounded-full bg-[#A03968] hover:bg-[#A03968]/80 p-6 text-xs'
                disabled={clicked}
              >
                {clicked ? (
                  <>
                    <Loader2 className='w-4 h-4 animate-spin mr-2' />
                    Подождите...
                  </>
                ) : (
                  "Продолжить"
                )}
              </Button>
              {message && (
                <Label className='block text-center text-xs text-red-500 max-w-xs'>
                  {message}
                </Label>
              )}
            </div>
            <Label className='block text-center text-xs text-muted-foreground max-w-xs'>
              Введите фамилию, имя, дату рождения
            </Label>
          </div>
          <div></div>
        </form>
      </Form>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={formClassName}
      >
        <div></div>
        <div className='space-y-4'>
          <FormCode form={form} clicked={clicked} />
          <div className='flex flex-col items-center justify-center'>
            <Button
              type='submit'
              className='mx-auto w-[200px] rounded-full bg-[#A03968] hover:bg-[#A03968]/80 p-6 text-xs'
              disabled={clicked}
            >
              {clicked ? (
                <>
                  <Loader2 className='w-4 h-4 animate-spin mr-2' />
                  Подождите...
                </>
              ) : (
                "Продолжить"
              )}
            </Button>
          </div>
          {type === "call" && (
            <Label className='block text-center text-xs text-muted-foreground max-w-xs'>
              Вам звонят, введите последние 4 цифры номера
            </Label>
          )}
          {type === "sms" && (
            <Label className='block text-center text-xs text-muted-foreground max-w-xs'>
              Вам пришел SMS, введите 4 цифры кода
            </Label>
          )}
          {date && <Countdown form={form} date={date} />}
        </div>
        <div></div>
      </form>
    </Form>
  );
}
