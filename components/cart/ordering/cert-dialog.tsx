import { useState } from "react";
import DialogWrapper from "../../modal/modal-wrapper";
import { InputOTPSlot } from "../../ui/input-otp";
import { InputOTP, InputOTPGroup } from "../../ui/input-otp";
import { Info } from "../definitions";
import { validateCertCode } from "@/lib/db/cert/actions";

export default function CertDialog({
  open,
  setOpen,
  data,
  setInfo,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setInfo: React.Dispatch<React.SetStateAction<Info>>;
  data: { id: number; email: string };
}) {
  const [code, setCode] = useState<string>("");
  const [clicked, setClicked] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const onSubmit = async (code: string) => {
    setClicked(true);
    setMessage("");

    const action = await validateCertCode(data.id, code);
    if ("message" in action) {
      setMessage(action.message);
      setInfo((prev) => ({ ...prev, useCard: false, cert: "", promo: "" }));
      setCode("");
      setClicked(false);
      return;
    }

    setInfo((prev) => ({
      ...prev,
      promo: "",
      cert: action.number,
      useCard: false,
    }));

    setOpen(false);
    setClicked(false);
  };

  return (
    <DialogWrapper
      title='Подтверждение сертификата'
      open={open}
      setOpen={setOpen}
    >
      <p className='text-xs text-center'>
        Пожалуйста, проверьте вашу электронную почту и введите полученный код в
        поле ниже для подтверждения сертификата.
      </p>
      <InputOTP
        maxLength={4}
        className='w-full max-w-[200px] mx-auto [&:input]:rounded-xl'
        autoFocus
        disabled={clicked}
        value={code}
        onChange={(val: any) => {
          setCode(val);
          if (val?.length === 4) {
            onSubmit(val);
          }
        }}
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
      {message && <p className='text-center text-xs text-red-500'>{message}</p>}
      {clicked && (
        <p className='text-center text-xs text-muted-foreground'>
          Подождите...
        </p>
      )}
      <p className='text-center text-xs text-muted-foreground'>
        Если вы не получили код, проверьте папку &quot;Спам&quot; или попробуйте
        запросить новый код.
      </p>
    </DialogWrapper>
  );
}
