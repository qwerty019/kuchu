import {
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../../ui/button";
import MapComponent from "../map/map-component";
import Branches from "../branch/branches";
import Addresses from "../address/addresses";
import { Info, SetInfo } from "@/lib/definitions";
import { X } from "lucide-react";
import { User } from "@/lib/auth";
import { Buttons, texts } from "./components";
import { useMainStore } from "@/providers/main-store-provider";

export default function MethodDialog({
  setOpen,
  user,
  info,
  setInfo,
  type,
  setType,
}: {
  setOpen: (open: boolean) => void;
  user: User | null;
  info: Info;
  setInfo: SetInfo;
  type: string | null;
  setType: (type: string | null) => void;
}) {
  const { zones } = useMainStore((state) => state);

  const freeDelivery = zones?.length
    ? Math.min(...zones.map((z) => z.freeDelivery))
    : 0;

  return (
    <>
      {info.add && (
        <div className='w-1/2 h-[652px] rounded-2xl relative'>
          <div className='absolute z-10 top-4 left-4 p-2 space-y-0.5 text-[10px] bg-background rounded-xl'>
            {zones?.map((z) => (
              <div key={z.id} className='flex items-center gap-1'>
                <div
                  className='rounded-full h-2 w-2'
                  style={{ backgroundColor: z.color }}
                />
                <p>Доставка: {z.price} ₽</p>
              </div>
            ))}
            <p className='text-muted-foreground'>
              Бесплатно от {freeDelivery} ₽
            </p>
          </div>
          <div className='border h-full rounded-2xl'>
            <MapComponent info={info} setInfo={setInfo} user={user} />
          </div>
        </div>
      )}
      <div className={`flex flex-col gap-3 ${info.add ? "w-1/2" : "w-full"}`}>
        <DialogHeader className='flex-row items-start gap-2 space-y-0 justify-between'>
          <div className='space-y-1.5'>
            <DialogTitle>
              {texts.find((x) => x.type === (type || "none"))?.title}
            </DialogTitle>
            <DialogDescription className='text-xs leading-none'>
              {texts.find((x) => x.type === (type || "none"))?.desc}
            </DialogDescription>
          </div>
          <DialogClose asChild>
            <Button
              type='button'
              variant='secondary'
              className='p-2 flex items-center justify-center bg-[#F2F2F2] rounded-full h-auto'
            >
              <X className='w-4 h-4' />
            </Button>
          </DialogClose>
        </DialogHeader>
        {!type && <Buttons setType={setType} />}
        {!type && (
          <div className='w-full h-full overflow-hidden rounded-xl'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src='/images/bag.png'
              alt='bag'
              className='w-full h-full object-cover'
            />
          </div>
        )}
        {type === "delivery" && (
          <Addresses
            info={info}
            setInfo={setInfo}
            setOpen={setOpen}
            setType={setType}
            user={user}
          />
        )}
        {type === "branch" && (
          <Branches setOpen={setOpen} setType={setType} user={user} />
        )}
      </div>
    </>
  );
}
