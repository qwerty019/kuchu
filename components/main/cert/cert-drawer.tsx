import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { CertOption } from "@/lib/db/certoption/schema";
import { Cert } from "./data";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerHeader,
  DrawerTrigger,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Avatar } from "@/components/ui/avatar";
import CertCarousel from "./cert-carousel";
import Certificate from "./certificate";
import { ImageOff } from "lucide-react";

export default function CertDrawer({
  open,
  setOpen,
  cert,
  options,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  cert: Cert;
  options: CertOption[];
}) {
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <div className='flex items-center gap-2 hover:text-primary hover:cursor-pointer'>
          <Avatar className='w-8 h-8  aspect-square rounded-md'>
            <AvatarImage
              src={"/images/categories/cert_icon.svg"}
              alt='Сертификаты'
              className='w-8 h-8 aspect-square object-cover rounded-md'
            />
            <AvatarFallback className='p-2 rounded-md text-muted-foreground bg-[#F2F2F2] flex items-center justify-center'>
              <ImageOff className='w-4 h-4' />
            </AvatarFallback>
          </Avatar>
          <p className='text-sm font-medium text-muted-foreground'>
            Сертификаты
          </p>
        </div>
      </DrawerTrigger>
      <DrawerContent className='max-h-[90vh] [&_.close-drawer]:hidden overflow-hidden p-0 border-none bg-transparent'>
        <div className='overflow-y-auto scrollbar-hide h-full'>
          <ContentDrawer open={open} cert={cert} options={options} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

const ContentDrawer = ({
  open,
  cert,
  options,
}: {
  open: boolean;
  cert: Cert;
  options: CertOption[];
}) => {
  if (!open) return null;

  return (
    <>
      <CertCarousel cert={cert} isDrawer />
      <div className='relative space-y-4 p-4 bg-background rounded-t-[10px] h-full -mt-4 z-10'>
        <DrawerHeader className='p-0 flex items-start gap-2 space-y-0 justify-between'>
          <div className='space-y-1.5'>
            <DrawerTitle className='text-left text-2xl font-semibold'>
              {cert.title}
            </DrawerTitle>
            <DrawerDescription
              className={`text-sm leading-none text-left ${
                !cert.subtitle ? "hidden" : ""
              }`}
            >
              {cert.subtitle}
            </DrawerDescription>
          </div>
        </DrawerHeader>
        {cert.text && (
          <p className='whitespace-pre-line text-sm font-medium'>{cert.text}</p>
        )}
        <div className='grid grid-cols-2 gap-2'>
          {options.map((option) => (
            <Certificate key={option.id} option={option} />
          ))}
        </div>
      </div>
    </>
  );
};
