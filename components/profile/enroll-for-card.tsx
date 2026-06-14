import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "../ui/form";
import { FormInput } from "../form/input";
import { applyForCard } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import DialogWrapper from "../modal/modal-wrapper";

const formSchema = z.object({
  surname: z.string().min(1, { message: "Введите фамилию" }),
  name: z.string().min(1, { message: "Введите имя" }),
  patronymic: z.string().min(1, { message: "Введите отчество" }),
  dob: z.string().min(1, { message: "Выберите дату рождения" }),
});

export default function EnrollForCard() {
  const [clicked, setClicked] = useState(false);
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      surname: "",
      name: "",
      patronymic: "",
      dob: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setClicked(true);

    const action = await applyForCard(values);
    if (action?.message) {
      toast.error(action.message);
    } else {
      router.refresh();
      setOpen(false);
    }

    setClicked(false);
  }

  return (
    <DialogWrapper
      open={open}
      setOpen={setOpen}
      title='Завести карту'
      trigger={
        <Button className='bg-white text-[#865BBD] hover:bg-slate-50 rounded-full text-xs'>
          Завести карту
        </Button>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <div className='flex flex-col gap-2'>
            <FormInput form={form} name='surname' placeholder='Фамилия' />
            <FormInput form={form} name='name' placeholder='Имя' />
            <FormInput form={form} name='patronymic' placeholder='Отчество' />
            <div className='space-y-1'>
              <FormInput
                form={form}
                type='date'
                name='dob'
                placeholder='Дата рождения'
              />
              <p className='text-xs text-muted-foreground'>
                Выберите вашу дату рождения
              </p>
            </div>
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
              disabled={clicked}
              className='rounded-full bg-[#A03968] hover:bg-[#A03968] p-4 text-xs'
            >
              {clicked ? (
                <Loader2 className='w-4 h-4 animate-spin' />
              ) : (
                "Создать"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </DialogWrapper>
  );
}
