"use client";

import {
  InputField,
  DynamicForm,
  TextareaField,
  ComboboxField,
  CheckboxField,
  MultiField,
} from "@/components/forms";
import { InputImageField } from "@/components/forms/fields/input-image-field";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { addStory, deleteStory, editStory } from "@/lib/db/story/actions";
import { fetchStory } from "@/lib/db/story/data";
import { AddStorySchema } from "@/lib/db/story/schema";
import { Option } from "@/lib/definitions";
import { PlusCircle, Trash2 } from "lucide-react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { z } from "zod";

export function AddStory({
  categories,
  branches,
}: {
  categories: Option[];
  branches: Option[];
}) {
  return (
    <DynamicForm
      formSchema={AddStorySchema}
      action={async (data) => {
        return await addStory(data);
      }}
      title='Добавить сториз'
      initialData={{
        title: "",
        img: "",
        position: null,
        show: false,
        completed: false,
        storybranches: [],
        slides: [
          {
            img: "",
            title: "",
            subtitle: null,
            text: "",
            categoryId: null,
            link: null,
            button: null,
          },
        ],
      }}
      trigger={
        <Button className='p-2 items-start h-auto relative w-[100px] aspect-[3/4] bg-accent rounded-xl hover:bg-accent/80'>
          <div className='bg-background p-2 text-xs rounded-full text-primary w-full'>
            Создать
          </div>
        </Button>
      }
      renderForm={({ form }) => (
        <FieldGroup className='gap-4'>
          <div className='flex flex-col gap-2'>
            <MultiField
              control={form.control}
              name='storybranches'
              placeholder='Выберите филиал'
              options={branches}
            />
            <InputField
              control={form.control}
              name='title'
              placeholder='Введите название'
            />
            <InputImageField
              control={form.control}
              name='img'
              placeholder='Добавьте фото 600х900'
              folder='story'
            />
            <InputField
              control={form.control}
              name='position'
              placeholder='Введите позицию'
            />
            <CheckboxField
              control={form.control}
              name='show'
              label='Показывать'
            />
          </div>
          <Slides form={form} categories={categories} />
        </FieldGroup>
      )}
    />
  );
}

export function EditStory({
  id,
  categories,
  branches,
  open,
  setOpen,
}: {
  id: number;
  categories: Option[];
  branches: Option[];
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <DynamicForm
      open={open}
      setOpen={setOpen}
      formSchema={AddStorySchema}
      action={async (data) => {
        return await editStory(id, data);
      }}
      title='Редактировать сториз'
      initialDataFetcher={async () => {
        const data = await fetchStory(id);
        return {
          title: data.title,
          img: data.img,
          position: data.position,
          show: data.show,
          completed: data.completed,
          storybranches: data.storybranches,
          slides: data.slides.map((slide) => ({
            img: slide.img,
            title: slide.title,
            subtitle: slide.subtitle,
            text: slide.text,
            categoryId: slide.categoryId,
            link: slide.link,
            button: slide.button,
          })),
        };
      }}
      buttonText='Редактировать'
      deleteAction={async () => {
        return await deleteStory(id);
      }}
      deleteConfirmDescription='Это действие нельзя отменить. Сториз и все связанные с ним данные будут удалены навсегда.'
      trigger={
        <Button
          className='rounded-full text-xs gap-2'
          variant='secondary'
          size='sm'
        >
          Добавить сториз
        </Button>
      }
      renderForm={({ form }) => (
        <FieldGroup className='gap-4'>
          <div className='flex flex-col gap-2'>
            <MultiField
              control={form.control}
              name='storybranches'
              placeholder='Выберите филиал'
              options={branches}
            />
            <InputField
              control={form.control}
              name='title'
              placeholder='Введите название'
            />
            <InputImageField
              control={form.control}
              name='img'
              placeholder='Добавьте фото 600х900'
              folder='story'
            />
            <InputField
              control={form.control}
              name='position'
              placeholder='Введите позицию'
            />
            <CheckboxField
              control={form.control}
              name='show'
              label='Показывать'
            />
          </div>
          <Slides form={form} categories={categories} />
        </FieldGroup>
      )}
    />
  );
}

function Slides({
  form,
  categories,
}: {
  form: UseFormReturn<z.infer<typeof AddStorySchema>>;
  categories: Option[];
}) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "slides",
  });

  return (
    <FieldGroup className='gap-2'>
      {fields.map((f, i) => (
        <div key={f.id} className='border rounded-xl p-3 space-y-3'>
          <div className='flex items-center justify-between gap-2'>
            <h3 className='text-base font-semibold'>Слайд {i + 1}</h3>
            {fields.length > 1 ? (
              <Button
                type='button'
                variant='outline'
                size='icon'
                className='rounded-full w-8 h-8'
                onClick={() => remove(i)}
              >
                <Trash2 className='w-3 h-3' />
              </Button>
            ) : null}
          </div>
          <div className='space-y-2'>
            <InputField
              control={form.control}
              name={`slides.${i}.title`}
              placeholder='Введите заголовок'
            />
            <TextareaField
              control={form.control}
              name={`slides.${i}.text`}
              placeholder='Введите текст'
            />
            <InputImageField
              control={form.control}
              name={`slides.${i}.img`}
              placeholder='Добавьте фото 600х900'
              folder='slide'
            />
            <ComboboxField
              control={form.control}
              name={`slides.${i}.categoryId`}
              placeholder='Выберите категорию'
              options={categories}
            />
            <InputField
              control={form.control}
              name={`slides.${i}.link`}
              placeholder='Введите ссылку'
            />
            <InputField
              control={form.control}
              name={`slides.${i}.button`}
              placeholder='Введите текст кнопки'
            />
          </div>
        </div>
      ))}
      <div className='w-full flex justify-center'>
        <Button
          type='button'
          variant='outline'
          size='sm'
          className='rounded-full text-xs gap-2'
          onClick={() =>
            append({
              img: "",
              title: "",
              subtitle: "",
              text: "",
              categoryId: null,
              link: null,
              button: null,
            })
          }
        >
          <PlusCircle className='w-3 h-3' />
          Добавить слайд
        </Button>
      </div>
    </FieldGroup>
  );
}
