"use client";

import { DynamicForm } from "@/components/forms";
import { Button } from "@/components/ui/button";
import { addFilter, editFilter, deleteFilter } from "@/lib/db/filter/actions";
import {
  AddFilterSchema,
  EditFilterSchema,
  Filter,
} from "@/lib/db/filter/schema";

export function AddFilter() {
  return (
    <DynamicForm
      formSchema={AddFilterSchema}
      action={async (data) => {
        return await addFilter(data);
      }}
      title='Добавить фильтр'
      initialData={{ title: "", type: "" }}
      trigger={
        <Button
          className='rounded-full text-xs gap-2'
          variant='secondary'
          size='sm'
        >
          Добавить фильтр
        </Button>
      }
      sections={[
        {
          type: "input",
          name: "title",
          placeholder: "Название",
          required: true,
        },
        {
          type: "input",
          name: "type",
          placeholder: "Тип",
          required: true,
        },
      ]}
    />
  );
}

export function EditFilter({
  filter,
  open,
  setOpen,
}: {
  filter: Filter;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <DynamicForm
      open={open}
      setOpen={setOpen}
      formSchema={EditFilterSchema}
      action={async (data) => {
        return await editFilter(filter.id, data);
      }}
      title='Редактировать фильтр'
      initialData={{ title: filter.title, type: filter.type }}
      buttonText='Редактировать'
      deleteAction={async () => {
        return await deleteFilter(filter.id);
      }}
      deleteConfirmDescription='Это действие нельзя отменить. Фильтр и все связанные с ним данные будут удалены навсегда.'
      sections={[
        {
          type: "input",
          name: "title",
          placeholder: "Название",
          required: true,
        },
        {
          type: "input",
          name: "type",
          placeholder: "Тип",
          required: true,
        },
      ]}
    />
  );
}
