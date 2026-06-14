import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import DialogWrapper from "@/components/modal/modal-wrapper";
import { Content, EditContentSchema } from "@/lib/db/content/schema";
import { editContent } from "@/lib/db/content/actions";
import FormTextArea from "@/components/form/textarea";
import FormCombobox from "@/components/form/combobox";
import { DeleteContent } from "./delete-content";

export function EditContent({
  open,
  setOpen,
  content,
  mutate,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mutate: () => void;
  content: Content;
}) {
  const [clicked, setClicked] = useState(false);

  const form = useForm<z.infer<typeof EditContentSchema>>({
    resolver: zodResolver(EditContentSchema),
  });

  const isDirty = form.formState.isDirty;

  async function onSubmit(values: z.infer<typeof EditContentSchema>) {
    if (!isDirty || clicked) return;

    setClicked(true);

    const action = await editContent(content.id, values);

    if (action?.message) {
      if (action?.errors) {
        Object.entries(action.errors).forEach(([key, value]) => {
          form.setError(key as keyof z.infer<typeof EditContentSchema>, {
            message: value[0],
          });
        });
      }

      toast.error(action.message);
      setClicked(false);
      return;
    }

    mutate();

    form.reset();
    setClicked(false);
    setOpen(false);
  }

  useEffect(() => {
    if (content) {
      form.reset({
        title: content.title,
        content: content.content,
      });
    }
  }, [form, content]);

  return (
    <DialogWrapper title='Добавить описание' open={open} setOpen={setOpen}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-6 flex flex-col flex-1 overflow-hidden'
        >
          <div className='space-y-2'>
            <FormCombobox
              form={form}
              name='title'
              placeholder='Название'
              items={titles.map((t) => ({ label: t, value: t }))}
            />
            <FormTextArea form={form} name='content' placeholder='Описание' />
          </div>
          <div className='flex justify-between gap-2'>
            <DeleteContent id={content.id} setOpen={setOpen} mutate={mutate} />
            <Button
              type='submit'
              disabled={!isDirty || clicked}
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

export const titles = [
  "Действие на организм",
  "Способ применения и дозы",
  "Срок годности",
  "Условия хранения",
  "Латинское название",
  "Действующее вещество",
  "Состав",
  "Описание лекарственной формы",
  "Фармакокинетика",
  "Фармакодинамика",
  "Показания",
  "Противопоказания",
  "Применение при беременности и кормлении грудью",
  "Побочные действия",
  "Взаимодействие",
  "Передозировка",
  "Особые указания",
  "Форма выпуска",
  "Условия отпуска из аптек",
  "Производитель",
  "Фармакологическая группа",
  "Нозологическая классификация (МКБ-10)",
  "Комментарий",
  "Меры предосторожности",
  "Характеристика",
  "Фармакологическое действие",
  "АТХ",
  "Свойства компонентов",
  "Рекомендуется",
  "Состав и форма выпуска",
  "Фармакологические свойства",
  "Инструкция для пациента",
  "Лекарственная форма",
  "Описание",
  "Действие",
  "Показания к применению",
  "Применение у детей",
  "Влияние на способность к вождению автотранспорта и управлению механизмами",
  "Производитель и организация, принимающие претензии потребителей",
];
