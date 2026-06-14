"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { FormInput } from "@/components/form/input";
import { toast } from "sonner";
import DialogWrapper from "@/components/modal/modal-wrapper";
import { useRouter } from "next/navigation";
import { addCert } from "./actions";

const formSchema = z.object({
  email: z
    .string()
    .email({ message: "Введите эл. почту" })
    .trim()
    .toLowerCase()
    .min(1)
    .max(255),
  expDate: z.string().trim().min(1).max(255),
  nominal: z.number().int().positive(),
});

export function AddCert({
  open,
  nominal,
  setOpen,
}: {
  open: boolean;
  nominal: number;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [clicked, setClicked] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      nominal,
      expDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        .toISOString()
        .split("T")[0],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (clicked) return;

    setClicked(true);

    const action = await addCert(values);
    if (action?.errors) {
      Object.entries(action.errors).forEach(([key, value]) => {
        form.setError(key as any, { message: value[0] });
      });
      setClicked(false);
      return;
    }

    if ("message" in action) {
      toast.error(action.message);
      setClicked(false);
      return;
    }

    router.push(`/payment?token=${action.token}&certId=${action.certId}`);
  }

  return (
    <DialogWrapper title='Купить сертификат' open={open} setOpen={setOpen}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <div className='space-y-2'>
            <FormInput form={form} name='email' placeholder='Почта' />
          </div>
          <div className='flex justify-end'>
            <Button
              type='submit'
              disabled={clicked}
              className='rounded-full bg-[#A03968] hover:bg-[#A03968] p-4 text-xs'
            >
              {clicked ? (
                <Loader2 className='w-4 h-4 animate-spin' />
              ) : (
                "Купить"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </DialogWrapper>
  );
}
