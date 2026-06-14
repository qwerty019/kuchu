"use client";

import { DynamicForm } from "@/components/forms";
import { Button } from "@/components/ui/button";
import {
  addCollection,
  deleteCollection,
  editCollection,
} from "@/lib/db/collection/actions";
import { AddCollectionSchema, Collection } from "@/lib/db/collection/schema";
import { Edit2, Pencil } from "lucide-react";

export function AddCollection() {
  return (
    <DynamicForm
      formSchema={AddCollectionSchema}
      action={async (data) => {
        return await addCollection(data);
      }}
      title='Добавить подборку'
      initialData={{ title: "", show: false, position: null }}
      trigger={
        <Button
          className='rounded-full text-xs gap-2'
          variant='secondary'
          size='sm'
        >
          Добавить подборку
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
          name: "position",
          placeholder: "Позиция",
          type: "input",
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

export function EditCollection({
  collection: { id, title, show, position },
}: {
  collection: Collection;
}) {
  return (
    <DynamicForm
      formSchema={AddCollectionSchema}
      action={async (data) => {
        return await editCollection(id, data);
      }}
      title='Редактировать город'
      initialData={{ title, show, position }}
      buttonText='Редактировать'
      trigger={
        <Button
          className='rounded-xl h-8 w-8 shrink-0'
          variant='outline'
          size='icon'
        >
          <Pencil className='w-4 h-4' />
        </Button>
      }
      deleteAction={async () => {
        return await deleteCollection(id);
      }}
      deleteConfirmDescription='Это действие нельзя отменить. Подборка и все связанные с ним данные будут удалены навсегда.'
      sections={[
        {
          type: "input",
          name: "title",
          placeholder: "Название",
          required: true,
        },
        {
          name: "position",
          placeholder: "Позиция",
          type: "input",
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
