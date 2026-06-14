"use client";

import { DynamicForm } from "@/components/forms";
import { Button } from "@/components/ui/button";
import {
  addFilterOption,
  editFilterOption,
  deleteFilterOption,
} from "@/lib/db/filterOption/actions";
import {
  AddFilterOptionSchema,
  EditFilterOptionSchema,
  FilterOption,
} from "@/lib/db/filterOption/schema";

export function AddOption({ filterId }: { filterId: number }) {
  return (
    <DynamicForm
      formSchema={AddFilterOptionSchema}
      action={async (data) => {
        return await addFilterOption(data);
      }}
      title='Добавить опцию'
      initialData={{ value: "", filterId }}
      trigger={
        <Button
          className='rounded-full text-xs gap-2'
          variant='secondary'
          size='sm'
        >
          Добавить опцию
        </Button>
      }
      sections={[
        {
          type: "input",
          name: "value",
          placeholder: "Значение",
          required: true,
        },
      ]}
    />
  );
}

export function EditFilterOption({
  option,
  open,
  setOpen,
}: {
  option: FilterOption;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <DynamicForm
      open={open}
      setOpen={setOpen}
      formSchema={EditFilterOptionSchema}
      action={async (data) => {
        return await editFilterOption(option.id, data);
      }}
      title='Редактировать опцию'
      initialData={{ value: option.value }}
      buttonText='Редактировать'
      deleteAction={async () => {
        return await deleteFilterOption(option.id);
      }}
      deleteConfirmDescription='Это действие нельзя отменить. Опция и все связанные с ним данные будут удалены навсегда.'
      sections={[
        {
          type: "input",
          name: "value",
          placeholder: "Значение",
          required: true,
        },
      ]}
    />
  );
}
