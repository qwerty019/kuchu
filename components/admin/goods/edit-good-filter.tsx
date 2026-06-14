import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import DialogWrapper from "@/components/modal/modal-wrapper";
import { EditGoodFilterSchema } from "@/lib/db/goodFilter/schema";
import { editGoodFilter } from "@/lib/db/goodFilter/actions";
import { DeleteGoodFilter } from "./delete-good-filter";
import FormCombobox2 from "@/components/form/combobox2";

export function EditGoodFilter({
  open,
  setOpen,
  goodFilter,
  mutate,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mutate: () => void;
  goodFilter: { id: number; goodId: number; optionId: number };
}) {
  const [clicked, setClicked] = useState(false);

  const form = useForm<z.infer<typeof EditGoodFilterSchema>>({
    resolver: zodResolver(EditGoodFilterSchema),
  });

  const isDirty = form.formState.isDirty;

  async function onSubmit(values: z.infer<typeof EditGoodFilterSchema>) {
    if (!isDirty || clicked) return;

    setClicked(true);

    const action = await editGoodFilter(goodFilter.id, values);

    if (action?.message) {
      if (action?.errors) {
        Object.entries(action.errors).forEach(([key, value]) => {
          form.setError(key as keyof z.infer<typeof EditGoodFilterSchema>, {
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
    if (goodFilter) {
      form.reset({
        goodId: goodFilter.goodId,
        optionId: goodFilter.optionId,
      });
    }
  }, [form, goodFilter]);

  return (
    <DialogWrapper title='Изменить опцию фильтра' open={open} setOpen={setOpen}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-6 flex flex-col flex-1 overflow-hidden'
        >
          <div className='space-y-2'>
            <FormCombobox2
              form={form}
              name='optionId'
              placeholder='Опция фильтра'
              url='/api/search/filteroptions'
              valueAsNumber
            />
          </div>
          <div className='flex justify-between gap-2'>
            <DeleteGoodFilter
              id={goodFilter.id}
              setOpen={setOpen}
              mutate={mutate}
            />
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
