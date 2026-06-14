"use client";

import { DynamicForm } from "@/components/forms";
import { Button } from "@/components/ui/button";
import { addText, deleteText, editText } from "@/lib/db/navtext/actions";
import { AddNavTextSchema } from "@/lib/db/navtext/schema";

export function AddNavText() {
  return (
    <DynamicForm
      formSchema={AddNavTextSchema}
      action={async (data) => {
        return await addText(data);
      }}
      title='Добавить текст'
      initialData={{ text: "", show: true }}
      trigger={
        <Button
          className='rounded-full text-xs gap-2'
          variant='secondary'
          size='sm'
        >
          Добавить текст
        </Button>
      }
      sections={[
        {
          type: "input",
          name: "text",
          placeholder: "Текст",
          required: true,
        },
        {
          name: "show",
          label: "Показывать",
          type: "checkbox",
        },
      ]}
    />
  );
}

export function EditNavText({
  navText: { id, text, show },
  open,
  setOpen,
}: {
  navText: { id: number; text: string; show: boolean };
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <DynamicForm
      formSchema={AddNavTextSchema}
      action={async (data) => {
        return await editText(id, data);
      }}
      title='Редактировать текст'
      initialData={{ text, show }}
      buttonText='Редактировать'
      open={open}
      setOpen={setOpen}
      deleteAction={async () => {
        return await deleteText(id);
      }}
      deleteConfirmDescription='Это действие нельзя отменить. Текст и все связанные с ним данные будут удалены навсегда.'
      sections={[
        {
          type: "input",
          name: "text",
          placeholder: "Текст",
          required: true,
        },
        {
          name: "show",
          label: "Показывать",
          type: "checkbox",
        },
      ]}
    />
  );
}
