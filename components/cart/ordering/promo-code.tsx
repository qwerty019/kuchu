"use client";

import { useState } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Loader2 } from "lucide-react";
import { Info } from "../definitions";
import { checkPromoCode } from "@/lib/db/promo/data";

export default function PromoCode({
  setInfo,
  info,
}: {
  setInfo: React.Dispatch<React.SetStateAction<Info>>;
  info: Info;
}) {
  const [clicked, setClicked] = useState(false);
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");

  const checkPromo = async () => {
    if (!value || clicked) return;

    setClicked(true);
    setMessage("");

    const code = await checkPromoCode(value);
    if ("message" in code) {
      setClicked(false);
      setInfo((prev) => ({ ...prev, useCard: false, promo: "", cert: "" }));
      setMessage(code.message);
      return;
    }

    setInfo((prev) => ({
      ...prev,
      promo: code.code,
      cert: "",
      useCard: false,
      ...(code.amount && { promoAmount: code.amount }),
      ...(code.percent && { promoPercent: code.percent }),
    }));

    setClicked(false);
    setMessage("");
  };

  return (
    <div className='space-y-1'>
      <div className='relative'>
        <Input
          className='w-full bg-[#F2F2F2] border-none text-xs font-medium rounded-full p-6'
          placeholder='Промокод'
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setMessage("");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") checkPromo();
          }}
        />
        {value && (
          <Button
            type='button'
            variant='outline'
            className='z-10 rounded-full absolute right-1.5 top-1/2 -translate-y-1/2 px-4 text-xs w-[101px]'
            onClick={() => checkPromo()}
          >
            {clicked ? (
              <Loader2 className='w-4 h-4 animate-spin' />
            ) : (
              "Применить"
            )}
          </Button>
        )}
        {!value && (
          <Button
            type='button'
            variant='outline'
            className='z-10 rounded-full absolute right-1.5 top-1/2 -translate-y-1/2 px-4 text-xs w-[101px]'
            onClick={() => {
              setInfo((prev) => ({ ...prev, cert: "", promo: "", type: null }));
            }}
          >
            Отменить
          </Button>
        )}
      </div>
      {message && <p className='text-xs text-destructive'>{message}</p>}
      {info.promo && (
        <p className='text-xs'>
          Промокод <strong>{info.promo}</strong> применен
        </p>
      )}
    </div>
  );
}
