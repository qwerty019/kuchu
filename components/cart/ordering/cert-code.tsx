"use client";

import { useState } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Loader2 } from "lucide-react";
import CertDialog from "./cert-dialog";
import { Info } from "../definitions";
import { checkCertCode } from "@/lib/db/cert/actions";

export default function CertCode({
  setInfo,
  info,
}: {
  setInfo: React.Dispatch<React.SetStateAction<Info>>;
  info: Info;
}) {
  const [clicked, setClicked] = useState(false);
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");
  const [data, setData] = useState<{ id: number; email: string } | null>(null);
  const [open, setOpen] = useState(false);

  const checkCert = async () => {
    if (!value || clicked) return;

    setClicked(true);
    setMessage("");

    const action = await checkCertCode(value);
    if ("message" in action) {
      setClicked(false);
      setInfo((prev) => ({ ...prev, useCard: false, cert: "", promo: "" }));
      setMessage(action.message);
      return;
    }

    setClicked(false);

    setData(action);
    setOpen(true);
  };

  return (
    <div className='space-y-1'>
      <div className='relative'>
        <Input
          className='w-full bg-[#F2F2F2] border-none text-xs font-medium rounded-full p-6'
          placeholder='Сертификат'
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setMessage("");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") checkCert();
          }}
        />
        {value && (
          <Button
            type='button'
            variant='outline'
            className='z-10 rounded-full absolute right-1.5 top-1/2 -translate-y-1/2 px-4 text-xs w-[101px]'
            onClick={() => checkCert()}
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
      {info.cert && (
        <p className='text-xs'>
          Сертификат <strong>{info.cert}</strong> применен
        </p>
      )}
      {open && data && (
        <CertDialog
          data={data}
          open={open}
          setOpen={setOpen}
          setInfo={setInfo}
        />
      )}
    </div>
  );
}
