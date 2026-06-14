"use client";

import { DynamicForm, InputField } from "@/components/forms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  addExclusion,
  editExclusion,
  deleteExclusion,
} from "@/lib/db/searchExclusion/actions";
import {
  AddSearchExclusionSchema,
  EditSearchExclusionSchema,
  SearchExclusion,
} from "@/lib/db/searchExclusion/schema";
import { X } from "lucide-react";

export function AddExclution() {
  return (
    <DynamicForm
      formSchema={AddSearchExclusionSchema}
      action={async (data) => {
        return await addExclusion(data);
      }}
      title='Добавить исключение'
      buttonText='Добавить'
      trigger={
        <Button
          type='button'
          className='rounded-full text-xs'
          variant='secondary'
          size='sm'
        >
          Добавить исключение
        </Button>
      }
      initialData={{ query: "", list: [""] }}
      renderForm={({ form }) => {
        const list = form.watch("list");

        return (
          <div className='space-y-2'>
            <InputField
              control={form.control}
              name='query'
              placeholder='Запрос'
            />
            <div className='space-y-1'>
              {list.map((item, index) => (
                <div key={index} className='flex items-center gap-1'>
                  <div className='space-y-1 w-full'>
                    <Input
                      className='w-full rounded-full text-xs bg-[#F2F2F2] py-4 px-4 border-none'
                      value={item ?? ""}
                      placeholder='Исключение'
                      onChange={(e) => {
                        const value = e.target.value;
                        const updatedList = [...list];
                        updatedList[index] = value;
                        form.setValue("list", updatedList, {
                          shouldDirty: true,
                        });
                      }}
                    />
                    {form.formState.errors.list?.[index]?.message && (
                      <p className='text-xs text-destructive'>
                        {form.formState.errors.list?.[index]?.message}
                      </p>
                    )}
                  </div>
                  {list.length > 1 && (
                    <Button
                      type='button'
                      onClick={() =>
                        form.setValue(
                          "list",
                          list.filter((_, i) => i !== index),
                          { shouldDirty: true }
                        )
                      }
                      variant='outline'
                      size='icon'
                      className='text-xs h-10 w-10 shrink-0 rounded-full'
                    >
                      <X className='w-4 h-4' />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button
              type='button'
              onClick={() =>
                form.setValue("list", [...list, ""], { shouldDirty: true })
              }
              variant='outline'
              className='w-full text-xs rounded-full'
            >
              Добавить строку
            </Button>
          </div>
        );
      }}
    />
  );
}

export function EditExclution({
  exclution,
  open,
  setOpen,
}: {
  exclution: SearchExclusion;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <DynamicForm
      formSchema={EditSearchExclusionSchema}
      action={async (data) => {
        return await editExclusion(exclution.id, data);
      }}
      title='Редактировать исключение'
      open={open}
      setOpen={setOpen}
      buttonText='Редактировать'
      initialData={{ query: exclution.query, list: exclution.list }}
      deleteAction={async () => {
        return await deleteExclusion(exclution.id);
      }}
      deleteConfirmDescription='Это действие нельзя отменить. Исключение и все связанные с ним данные будут удалены навсегда.'
      renderForm={({ form }) => {
        const list = form.watch("list");

        return (
          <div className='space-y-2'>
            <InputField
              control={form.control}
              name='query'
              placeholder='Запрос'
            />
            <div className='space-y-1'>
              {list.map((item, index) => (
                <div key={index} className='flex items-center gap-1'>
                  <div className='space-y-1 w-full'>
                    <Input
                      className='w-full rounded-full text-xs bg-[#F2F2F2] py-4 px-4 border-none'
                      value={item ?? ""}
                      placeholder='Исключение'
                      onChange={(e) => {
                        const value = e.target.value;
                        const updatedList = [...list];
                        updatedList[index] = value;
                        form.setValue("list", updatedList, {
                          shouldDirty: true,
                        });
                      }}
                    />
                    {form.formState.errors.list?.[index]?.message && (
                      <p className='text-xs text-destructive'>
                        {form.formState.errors.list?.[index]?.message}
                      </p>
                    )}
                  </div>
                  {list.length > 1 && (
                    <Button
                      type='button'
                      onClick={() =>
                        form.setValue(
                          "list",
                          list.filter((_, i) => i !== index),
                          { shouldDirty: true }
                        )
                      }
                      variant='outline'
                      size='icon'
                      className='text-xs h-10 w-10 shrink-0 rounded-full'
                    >
                      <X className='w-4 h-4' />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button
              type='button'
              onClick={() =>
                form.setValue("list", [...list, ""], { shouldDirty: true })
              }
              variant='outline'
              className='w-full text-xs rounded-full'
            >
              Добавить строку
            </Button>
          </div>
        );
      }}
    />
  );
}
