"use client";

import { DynamicForm } from "@/components/forms";
import { deleteZone, editZone } from "@/lib/db/deliveryzone/actions";
import {
  DeliveryZoneInCity,
  EditZoneSchema,
} from "@/lib/db/deliveryzone/schema";

export function EditZone({
  id,
  zone,
  open,
  setOpen,
}: {
  id: number;
  zone: DeliveryZoneInCity;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <DynamicForm
      formSchema={EditZoneSchema}
      action={async (data) => {
        return await editZone(id, data);
      }}
      open={open}
      setOpen={setOpen}
      title='Редактировать зону'
      initialData={{
        title: zone.title,
        price: zone.price,
        threshold: zone.threshold,
        freeDelivery: zone.freeDelivery,
        color: zone.color,
      }}
      buttonText='Редактировать'
      deleteAction={async () => {
        return await deleteZone(id);
      }}
      deleteConfirmDescription='Это действие нельзя отменить. Зона и все связанные с ним данные будут удалены навсегда.'
      sections={[
        {
          type: "input",
          name: "title",
          placeholder: "Название",
          required: true,
        },
        {
          name: "price",
          placeholder: "Цена",
          type: "input",
          required: true,
        },
        {
          name: "threshold",
          placeholder: "Доставка",
          type: "input",
          required: true,
        },
        {
          name: "freeDelivery",
          placeholder: "Бесплатная доставка",
          type: "input",
          required: true,
        },
        {
          name: "color",
          placeholder: "Цвет",
          type: "input",
          required: true,
        },
      ]}
    />
  );
}
