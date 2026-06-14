"use client";

import { Banknote, CreditCard, ShoppingBag } from "lucide-react";
import { Button } from "../../ui/button";
import { useMainStore } from "@/providers/main-store-provider";
import { useEffect } from "react";
import { Info } from "../definitions";
import { getHourAndMinuteInTimezone } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export default function Payment({
  setInfo,
  info,
}: {
  setInfo: React.Dispatch<React.SetStateAction<Info>>;
  info: Info;
}) {
  const { method } = useMainStore((state) => state);
  const { day } = getHourAndMinuteInTimezone(timezone, info.date);

  useEffect(() => {
    const time = info.time.split(":")[0];

    if (!isNaN(Number(time)) && (Number(time) >= 20 || Number(time) < 9)) {
      setInfo((prevInfo) => ({ ...prevInfo, payment: "card" }));
    }

    if (day === "Sat" || day === "Sun") {
      setInfo((prevInfo) => ({ ...prevInfo, payment: "card" }));
    }
  }, [info.date, method, setInfo, day, info.time]);

  return (
    <section className='flex flex-col flex-1 gap-4 bg-background rounded-2xl p-4'>
      <div className='space-y-2'>
        <p className='font-semibold text-lg'>Способ оплаты</p>
        <div className='space-y-2'>
          {payments
            .map((x) => {
              if (["none", "cash"].includes(x.value) && method === "delivery") {
                if (weekdays.includes(day)) {
                  return { ...x, disabled: true };
                }

                const time = info.time.split(":")[0];

                if (isNaN(Number(time))) return x;

                if (Number(time) >= 20 || Number(time) < 9) {
                  return { ...x, disabled: true };
                }

                return x;
              }

              return x;
            })
            .map((p, i) => (
              <Button
                key={i}
                variant='secondary'
                className={`rounded-full text-xs justify-between gap-2 font-normal w-full p-3 h-auto ${
                  info.payment === p.value
                    ? "bg-[#A03968] text-white hover:bg-[#A03968]"
                    : "bg-[#F2F2F2] text-primary"
                }`}
                disabled={p.disabled}
                onClick={() => setInfo({ ...info, payment: p.value })}
              >
                <div className='flex items-center gap-2'>
                  {p.icon}
                  <p>{p.text}</p>
                </div>
                {info.payment === p.value && <p>Выбрано</p>}
              </Button>
            ))}
        </div>
      </div>
      {info.payment === "cash" && method === "delivery" && (
        <div className='space-y-2'>
          <p className='font-semibold text-lg'>С какой купюры сдача?</p>
          <Input
            className='w-full rounded-full text-xs bg-[#F2F2F2] py-4 px-4 border-none'
            placeholder='Введите сумму'
            value={info.banknote}
            onChange={(e) => {
              setInfo((prev) => ({ ...prev, banknote: e.target.value }));
            }}
          />
        </div>
      )}
    </section>
  );
}

const payments = [
  {
    value: "card",
    text: "Картой на сайте",
    icon: <CreditCard className='w-4 h-4' />,
    disabled: false,
  },
  {
    value: "none",
    text: "Картой при получении",
    icon: <ShoppingBag className='w-4 h-4' />,
    disabled: false,
  },
  {
    value: "cash",
    text: "Наличными",
    icon: <Banknote className='w-4 h-4' />,
    disabled: false,
  },
];

const timezone = "Asia/Yakutsk";
const weekdays = ["Sat", "Sun"];
