"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useState } from "react";
import type { CertOption } from "@/lib/db/certoption/schema";
import { EditCertOption } from "./cert-option-actions";

export default function CertOption({ option }: { option: CertOption }) {
  const [edit, setEdit] = useState(false);

  return (
    <>
      <Button
        className='rounded-full text-xs gap-2'
        variant='secondary'
        size='sm'
        onClick={() => setEdit(true)}
      >
        <div
          className={`rounded-full border text-white ${
            option.show ? "bg-[#A03968] border-[#A03968]" : "bg-background"
          } `}
        >
          <Check className={`h-4 w-4 ${option.show ? "" : "opacity-0"}`} />
        </div>
        <p>{option.nominal}</p>
      </Button>
      {edit && <EditCertOption open={edit} setOpen={setEdit} option={option} />}
    </>
  );
}
