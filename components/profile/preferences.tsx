"use client";

import { Button } from "../ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import DialogWrapper from "../modal/modal-wrapper";
import { Form } from "../ui/form";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormCheckbox from "../form/checkbox";
import { changePreferences } from "./actions";

const formSchema = z.object({
  share: z.boolean(),
  promo: z.boolean(),
});

export default function Preferences({
  data,
  setData,
}: {
  data: { promo: boolean; share: boolean };
  setData: React.Dispatch<
    React.SetStateAction<{ promo: boolean; share: boolean }>
  >;
}) {
  const [clicked, setClicked] = useState(false);
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      share: data.share,
      promo: data.promo,
    },
  });

  const isDirty = form.formState.isDirty;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setClicked(true);

    const action = await changePreferences(values);
    if (action?.message) {
      toast.error(action.message);
      setClicked(false);
      return;
    }

    setOpen(false);
    setData(values);
    setClicked(false);
  }

  return (
    <DialogWrapper
      title='Персональные настройки'
      open={open}
      setOpen={setOpen}
      trigger={
        <Button
          variant='secondary'
          className='flex-col items-start bg-[#F2F2F2] rounded-2xl w-full p-3 h-auto'
          onClick={() => setOpen(true)}
        >
          <p>Персональные настройки</p>
          <p className='text-muted-foreground'>Акции и скидки</p>
        </Button>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <div className='flex flex-col gap-2'>
            <FormCheckbox
              form={form}
              name='promo'
              label='Получать предложения об акциях и скидках'
            />
            {/* <FormCheckbox
              form={form}
              name='share'
              label='Делиться данными с партнерами Kuchu'
            /> */}
          </div>
          <div className='flex justify-end gap-1'>
            <Button
              type='button'
              variant='outline'
              onClick={() => setOpen(false)}
              className='p-4 rounded-full text-xs'
            >
              Отмена
            </Button>
            <Button
              type='submit'
              disabled={clicked || !isDirty}
              className='rounded-full bg-[#A03968] hover:bg-[#A03968] p-4 text-xs'
            >
              {clicked ? (
                <Loader2 className='w-4 h-4 animate-spin' />
              ) : (
                "Изменить"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </DialogWrapper>
  );
}
