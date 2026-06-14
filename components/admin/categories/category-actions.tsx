"use client";

import { DynamicForm } from "@/components/forms";
import { Button } from "@/components/ui/button";
import {
  addCategory,
  deleteCategory,
  editCategory,
} from "@/lib/db/category/actions";
import { getCategoryInEdit } from "@/lib/db/category/data";
import {
  AddCategorySchema,
  EditCategorySchema,
} from "@/lib/db/category/schema";
import { Option } from "@/lib/definitions";

export function AddCategory({
  parentId,
  categories,
}: {
  parentId: number | null;
  categories: Option[];
}) {
  return (
    <DynamicForm
      formSchema={AddCategorySchema}
      action={async (data) => {
        return await addCategory(data);
      }}
      title='Добавить категорию'
      initialData={{ title: "", parentId }}
      trigger={
        <Button
          className='rounded-full text-xs gap-2'
          variant='secondary'
          size='sm'
        >
          Добавить категорию
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
          name: "parentId",
          placeholder: "Родитель",
          type: "combobox",
          options: categories,
          nullable: true,
          required: true,
        },
      ]}
    />
  );
}

export function EditCategory({
  id,
  open,
  setOpen,
  categories,
}: {
  id: number;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  categories: Option[];
}) {
  return (
    <DynamicForm
      open={open}
      setOpen={setOpen}
      formSchema={EditCategorySchema}
      action={async (data) => {
        return await editCategory(id, data);
      }}
      title='Редактировать категорию'
      initialDataFetcher={async () => {
        const data = await getCategoryInEdit({ id });
        return {
          title: data.title,
          parentId: data.parentId,
          url: data.url,
        };
      }}
      buttonText='Редактировать'
      deleteAction={async () => {
        return await deleteCategory(id);
      }}
      deleteConfirmDescription='Это действие нельзя отменить. Категория и все связанные с ней данные будут удалены навсегда.'
      sections={[
        {
          type: "input",
          name: "title",
          placeholder: "Название",
          required: true,
        },
        {
          name: "url",
          placeholder: "Изображение",
          type: "image",
          folder: "category"
        },
        {
          name: "parentId",
          placeholder: "Родитель",
          type: "combobox",
          options: categories,
          nullable: true,
          required: true,
        },
      ]}
    />
  );
}
