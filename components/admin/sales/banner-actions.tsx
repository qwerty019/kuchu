"use client";

import { DynamicForm } from "@/components/forms";
import { Button } from "@/components/ui/button";
import { addBanner, editBanner, deleteBanner } from "@/lib/db/banner/actions";
import { getBannerInEdit } from "@/lib/db/banner/data";
import { AddBannerSchema } from "@/lib/db/banner/schema";
import { Option } from "@/lib/definitions";

export function AddBanner({ branches }: { branches: Option[] }) {
  return (
    <DynamicForm
      formSchema={AddBannerSchema}
      action={async (data) => {
        return await addBanner({ body: data });
      }}
      title='Добавить промокод'
      initialData={{
        title: "",
        img: "",
        subtitle: null,
        position: null,
        show: false,
        bannerbranches: [],
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
          type: "multi",
          name: "bannerbranches",
          placeholder: "Выберите филиал",
          options: branches,
        },
        {
          type: "input",
          name: "title",
          placeholder: "Название",
          required: true,
        },
        {
          name: "subtitle",
          placeholder: "Подзаголовок",
          type: "input",
        },
        {
          name: "img",
          placeholder: "Изображение",
          type: "image",
          folder: 'banner'
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

export function EditBanner({
  id,
  open,
  setOpen,
  branches,
}: {
  id: number;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  branches: Option[];
}) {
  return (
    <DynamicForm
      formSchema={AddBannerSchema}
      action={async (data) => {
        return await editBanner({ id, body: data });
      }}
      title='Редактировать промокод'
      open={open}
      setOpen={setOpen}
      initialDataFetcher={async () => {
        const data = await getBannerInEdit({ id });
        return {
          title: data.title,
          img: data.img,
          subtitle: data.subtitle,
          position: data.position,
          show: data.show,
          bannerbranches: data.bannerbranches,
        };
      }}
      buttonText='Редактировать'
      deleteAction={async () => {
        return await deleteBanner({ id });
      }}
      deleteConfirmDescription='Это действие нельзя отменить. Баннер и все связанные с ним данные будут удалены навсегда.'
      sections={[
        {
          type: "multi",
          name: "bannerbranches",
          placeholder: "Выберите филиал",
          options: branches,
        },
        {
          type: "input",
          name: "title",
          placeholder: "Название",
          required: true,
        },
        {
          name: "subtitle",
          placeholder: "Подзаголовок",
          type: "input",
        },
        {
          name: "img",
          placeholder: "Изображение",
          type: "image",
          folder: 'banner'
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
