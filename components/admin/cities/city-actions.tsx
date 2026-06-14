"use client";

import { DynamicForm } from "@/components/forms";
import { Button } from "@/components/ui/button";
import { createCity, deleteCity, editCity } from "@/lib/db/city/actions";
import { AddCitySchema, EditCitySchema } from "@/lib/db/city/schema";
import { Edit2 } from "lucide-react";

export function AddCity() {
  return (
    <DynamicForm
      formSchema={AddCitySchema}
      action={async (data) => {
        return await createCity(data);
      }}
      title='Добавить город'
      initialData={{ title: "", route: "" }}
      trigger={
        <Button
          className='rounded-full text-xs gap-2'
          variant='secondary'
          size='sm'
        >
          Добавить город
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
          name: "route",
          placeholder: "Ссылка",
          type: "input",
          required: true,
        },
      ]}
    />
  );
}

export function EditCity({
  city: { id, title, route },
}: {
  city: { id: number; title: string; route: string };
}) {
  return (
    <DynamicForm
      formSchema={EditCitySchema}
      action={async (data) => {
        return await editCity(id, data);
      }}
      title='Редактировать город'
      initialData={{ title, route }}
      buttonText='Редактировать'
      trigger={
        <Button
          className='rounded-full text-xs gap-2'
          variant='secondary'
          size='sm'
        >
          <Edit2 className='w-3 h-3' />
          <p>Редактировать</p>
        </Button>
      }
      deleteAction={async () => {
        return await deleteCity(id);
      }}
      deleteConfirmDescription='Это действие нельзя отменить. Город и все связанные с ним данные будут удалены навсегда.'
      sections={[
        {
          type: "input",
          name: "title",
          placeholder: "Название",
          required: true,
        },
        {
          name: "route",
          placeholder: "Ссылка",
          type: "input",
          required: true,
        },
      ]}
    />
  );
}
