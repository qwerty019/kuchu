"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DeliveryZoneInCity } from "@/lib/db/deliveryzone/schema";
import { EditZone } from "./zone-actions";

export default function Zone({ zone }: { zone: DeliveryZoneInCity }) {
  const [edit, setEdit] = useState(false);

  return (
    <>
      <Button
        variant='outline'
        className='border p-2 rounded-2xl flex-col gap-1 items-start h-auto font-normal'
        onClick={() => setEdit(true)}
      >
        <div className='flex items-center gap-2'>
          <div
            className='w-3 h-3 rounded-full shrink-0'
            style={{ backgroundColor: zone.color }}
          />
          <p className='font-semibold'>{zone.title}</p>
        </div>
        <p className='text-sm'>
          Цена: <span className='font-semibold'>{zone.price} ₽</span>
          {" · "}
          Доставка: <span className='font-semibold'>{zone.threshold} ₽</span>
        </p>
        <p className='text-sm'>
          Бесплатная доставка:{" "}
          <span className='font-semibold'>{zone.freeDelivery} ₽</span>
        </p>
      </Button>
      <EditZone id={zone.id} zone={zone} open={edit} setOpen={setEdit} />
    </>
  );
}
