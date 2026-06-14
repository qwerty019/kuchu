import { Button } from "../../ui/button";
import Branches from "../branch/branches";
import Addresses from "../address/addresses";
import { Info, SetInfo } from "@/lib/definitions";
import { X } from "lucide-react";
import {
  DrawerClose,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "../../ui/drawer";
import MapComponent from "../map/map-component";
import { User } from "@/lib/auth";
import { Buttons, texts } from "./components";
import { useMainStore } from "@/providers/main-store-provider";

export default function MethodDrawer({
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
    <div className='overflow-y-auto scrollbar-hide'>
      <div className='w-full relative'>
        {info.add && (
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
        )}
        {info.add && (
          <div className='aspect-square'>
            <MapComponent info={info} setInfo={setInfo} user={user} />
          </div>
        )}
        <div className='p-4 flex flex-col gap-6'>
          <DrawerHeader className='p-0 flex items-start gap-2 space-y-0 justify-between'>
            <div className='space-y-1.5'>
              <DrawerTitle className='text-left'>
                {texts.find((x) => x.type === (type || "none"))?.title}
              </DrawerTitle>
              <DrawerDescription className='text-xs leading-none text-left'>
                {texts.find((x) => x.type === (type || "none"))?.desc}
              </DrawerDescription>
            </div>
            <DrawerClose asChild>
              <Button
                type='button'
                variant='secondary'
                className='p-2 flex items-center justify-center bg-accent rounded-full h-auto'
              >
                <X className='w-4 h-4' />
              </Button>
            </DrawerClose>
          </DrawerHeader>
          {!type && <Buttons setType={setType} />}
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
      </div>
    </div>
  );
}
