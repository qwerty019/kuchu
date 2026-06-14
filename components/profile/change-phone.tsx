"use client";

import { User } from "@/lib/auth";
import { Button } from "../ui/button";
import { useState } from "react";
import { InputMask } from "@react-input/mask";
import { parsePhoneNumber } from "libphonenumber-js/mobile";
import { changePhone, createCall } from "./actions";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";
import { Loader2 } from "lucide-react";
import DialogWrapper from "../modal/modal-wrapper";

export default function ChangePhone({ user }: { user: User }) {
  const formatted = formatPhoneNumber(user.phone);
  const [value, setValue] = useState(formatted);
  const [message, setMessage] = useState("");
  const [clicked, setClicked] = useState(false);
  const [callId, setCallId] = useState("");
  const [code, setCode] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const submit = async (phone: string) => {
    if (!phone) return;
    if (phone === formatted) return;
    if (!formatted) return;

    setMessage("");

    let number = "";

    try {
      const parsed = parsePhoneNumber(phone, "RU");

      if (parsed.country !== "RU" || !parsed.isValid()) {
        setMessage("Некорректный номер телефона");
        return;
      }

      number = parsed.number;
    } catch (err) {
      setMessage("Некорректный номер телефона");
      return;
    }

    setClicked(true);

    const action = await createCall(number);
    if (typeof action === "string") {
      setClicked(false);
      setCallId(action);
      return;
    }

    setMessage(action.message);
    setClicked(false);
  };

  const submit2 = async (code: string) => {
    if (!code) return;
    if (code.length !== 4) return;
    if (!callId) return;

    setMessage("");
    setClicked(true);

    const action = await changePhone(code, callId);
    if (action?.message) {
      setMessage(action.message);
      setClicked(false);
      return;
    }

    router.refresh();

    setCallId("");
    setCode("");
    setClicked(false);
    setOpen(false);
  };

  if (!callId) {
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
            <p>Изменить номер телефона</p>
            <p className='text-muted-foreground'>{user.phone}</p>
          </Button>
        }
      >
        <section className='space-y-4'>
          <div className='space-y-1'>
            <InputMask
              mask='+7 (___) ___-__-__'
              replacement={{ _: /\d/ }}
              className='w-full rounded-full text-xs bg-[#F2F2F2] py-4 px-4 border-none'
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
              }}
              placeholder='+7 (___) ___-__-__'
            />
            {message && <p className='text-xs text-destructive'>{message}</p>}
          </div>
          <Button
            className='w-full text-xs rounded-full bg-[#A03968] hover:bg-[#A03968] text-white'
            disabled={clicked || value === formatted}
            onClick={() => submit(value)}
          >
            {clicked ? (
              <Loader2 className='w-4 h-4 animate-spin' />
            ) : (
              "Изменить"
            )}
          </Button>
        </section>
      </DialogWrapper>
    );
  }

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
          <p>Изменить номер телефона</p>
          <p className='text-muted-foreground'>{user.phone}</p>
        </Button>
      }
    >
      <section className='space-y-4'>
        <div className='space-y-1'>
          <InputMask
            mask='+7 (___) ___-__-__'
            replacement={{ _: /\d/ }}
            className='w-full rounded-full text-xs bg-[#F2F2F2] py-4 px-4 border-none'
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            disabled
            placeholder='+7 (___) ___-__-__'
          />
          <div className='space-y-1'>
            <Input
              className='w-full rounded-full text-xs bg-[#F2F2F2] py-4 px-4 border-none'
              placeholder='Код из звонка'
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            {message && <p className='text-xs text-destructive'>{message}</p>}
          </div>
        </div>
        <Button
          className='w-full text-xs rounded-full bg-[#A03968] hover:bg-[#A03968] text-white'
          disabled={clicked || code.length !== 4}
          onClick={() => submit2(code)}
        >
          {clicked ? <Loader2 className='w-4 h-4 animate-spin' /> : "Изменить"}
        </Button>
      </section>
    </DialogWrapper>
  );
}

function formatPhoneNumber(phone: string | null): string {
  if (!phone) return "";

  const phonePattern = /^\+7(\d{3})(\d{3})(\d{2})(\d{2})$/;
  const match = phone.match(phonePattern);

  if (match) {
    return `+7 (${match[1]}) ${match[2]}-${match[3]}-${match[4]}`;
  } else {
    throw new Error("Invalid phone number format");
  }
}
