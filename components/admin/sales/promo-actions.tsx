"use client";

import { DynamicForm } from "@/components/forms";
import { Button } from "@/components/ui/button";
import { deletePromo, addPromo, editPromo } from "@/lib/db/promo/actions";
import { getPromoInEdit } from "@/lib/db/promo/data";
import { AddPromoSchema } from "@/lib/db/promo/schema";

export function AddPromo() {
  return (
    <DynamicForm
      formSchema={AddPromoSchema}
      action={async (data) => {
        return await addPromo(data);
      }}
      title='Добавить промокод'
      initialData={{
        code: "",
        amount: null,
        percent: null,
        forFirstOrder: false,
        completed: false,
      }}
      trigger={
        <Button className='p-2 items-start h-auto relative w-[100px] aspect-[3/4] bg-accent rounded-xl hover:bg-accent/80'>
          <div className='bg-background p-2 text-xs rounded-full text-primary w-full'>
            Создать
          </div>
        </Button>
      }
      sections={[
        {
          type: "input",
          name: "code",
          placeholder: "Код",
          required: true,
        },
        {
          name: "amount",
          placeholder: "Сумма",
          type: "input",
        },
        {
          name: "percent",
          placeholder: "Процент",
          type: "input",
        },
        {
          name: "forFirstOrder",
          label: "Только для первого заказа",
          type: "checkbox",
        },
      ]}
    />
  );
}

export function EditPromo({
  id,
  open,
  setOpen,
}: {
  id: number;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <DynamicForm
      formSchema={AddPromoSchema}
      action={async (data) => {
        return await editPromo(id, data);
      }}
      title='Редактировать промокод'
      open={open}
      setOpen={setOpen}
      initialDataFetcher={async () => {
        const data = await getPromoInEdit({ id });
        return {
          code: data.code,
          amount: data.amount,
          percent: data.percent,
          forFirstOrder: data.forFirstOrder,
          completed: data.completed,
        };
      }}
      buttonText='Редактировать'
      deleteAction={async () => {
        return await deletePromo(id);
      }}
      deleteConfirmDescription='Это действие нельзя отменить. Промокод и все связанные с ним данные будут удалены навсегда.'
      sections={[
        {
          type: "input",
          name: "code",
          placeholder: "Код",
          required: true,
        },
        {
          name: "amount",
          placeholder: "Сумма",
          type: "input",
        },
        {
          name: "percent",
          placeholder: "Процент",
          type: "input",
        },
        {
          name: "forFirstOrder",
          label: "Только для первого заказа",
          type: "checkbox",
        },
        {
          name: "completed",
          label: "Завершен",
          type: "checkbox",
        },
      ]}
    />
  );
}
