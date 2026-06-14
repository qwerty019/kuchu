"use client";

import { DynamicForm } from "@/components/forms";
import { Button } from "@/components/ui/button";
import {
  addCertOption,
  deleteCertOption,
  editCertOption,
} from "@/lib/db/certoption/actions";
import { AddCertOptionSchema } from "@/lib/db/certoption/schema";
import { Edit2 } from "lucide-react";

export function AddCertOption() {
  return (
    <DynamicForm
      formSchema={AddCertOptionSchema}
      action={async (data) => {
        return await addCertOption(data);
      }}
      title='Добавить сертификат'
      initialData={{ nominal: 0, show: false }}
      trigger={
        <Button
          className='rounded-full text-xs gap-2'
          variant='secondary'
          size='sm'
        >
          Добавить сертификат
        </Button>
      }
      sections={[
        {
          type: "input",
          name: "nominal",
          placeholder: "Номинал",
          required: true,
        },
        {
          name: "show",
          label: "Показывать",
          type: "checkbox",
          required: false,
        },
      ]}
    />
  );
}

export function EditCertOption({
  option: { id, nominal, show },
  open,
  setOpen,
}: {
  option: { id: number; nominal: number; show: boolean };
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <DynamicForm
      formSchema={AddCertOptionSchema}
      action={async (data) => {
        return await editCertOption(id, data);
      }}
      title='Редактировать сертификат'
      initialData={{ nominal, show }}
      buttonText='Редактировать'
      deleteAction={async () => {
        return await deleteCertOption(id);
      }}
      open={open}
      setOpen={setOpen}
      deleteConfirmDescription='Это действие нельзя отменить. Сертификат и все связанные с ним данные будут удалены навсегда.'
      sections={[
        {
          type: "input",
          name: "nominal",
          placeholder: "Номинал",
          required: true,
        },
        {
          name: "show",
          label: "Показывать",
          type: "checkbox",
          required: false,
        },
      ]}
    />
  );
}
