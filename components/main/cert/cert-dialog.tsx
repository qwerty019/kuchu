import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { CertOption } from "@/lib/db/certoption/schema";
import { ImageOff, X } from "lucide-react";
import { Cert } from "./data";
import CertCarousel from "./cert-carousel";
import Certificate from "./certificate";

export default function CertDialog({
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className='flex items-center gap-2 text-muted-foreground hover:text-primary hover:cursor-pointer'>
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
          <p className='text-sm font-medium'>Сертификаты</p>
        </div>
      </DialogTrigger>
      <Content open={open} cert={cert} options={options} />
    </Dialog>
  );
}

const Content = ({
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
    <DialogContent className='max-w-4xl [&_.close-dialog]:hidden w-full flex gap-6 rounded-2xl sm:rounded-2xl'>
      <CertCarousel cert={cert} />
      <div className='w-1/2 flex flex-col gap-6'>
        <DialogHeader className='flex-row items-start gap-2 space-y-0 justify-between'>
          <div className='space-y-1.5'>
            <DialogTitle className='text-3xl font-semibold'>
              {cert.title}
            </DialogTitle>
            <DialogDescription
              className={`text-sm leading-none ${
                !cert.subtitle ? "hidden" : ""
              }`}
            >
              {cert.subtitle}
            </DialogDescription>
          </div>
          <DialogClose asChild>
            <Button
              type='button'
              variant='secondary'
              className='p-2 flex items-center justify-center bg-accent rounded-full h-auto'
            >
              <X className='w-4 h-4' />
            </Button>
          </DialogClose>
        </DialogHeader>
        {cert.text && (
          <p className='whitespace-pre-line text-sm font-medium'>{cert.text}</p>
        )}
        <div className='grid grid-cols-3 gap-2'>
          {options.map((option) => (
            <Certificate key={option.id} option={option} />
          ))}
        </div>
      </div>
    </DialogContent>
  );
};
