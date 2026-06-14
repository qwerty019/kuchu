"use client";

import { Data } from "@/app/api/rls/route";
import { Button } from "@/components/ui/button";
import { Loader2, Search, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { updateDescId } from "@/lib/db/find/actions";

type GoodType = {
  id: number;
  drug: string;
  form: string;
  mnn: string;
  fabr: string;
  desc_id: number | null;
};

export default function Good({ good: initial }: { good: GoodType }) {
  const [good, setGood] = useState<GoodType>(initial);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Data[] | null>(null);
  const [open, setOpen] = useState(false);

  async function fetchData() {
    setLoading(true);

    try {
      const pos = `${good.drug} ${good.form} ${good.mnn}`;
      const res = await fetch(`/api/rls?pos=${pos}&firm=${good.fabr}`);

      if (!res.ok) {
        const data: { message: string } = await res.json();
        throw new Error(data.message);
      }

      const json: Data[] = await res.json();

      setData(json);
      setOpen(true);
    } catch (err: any) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <li className='p-2 px-4 border rounded-xl'>
      <div className='flex items-center gap-2 justify-between'>
        <div>
          <h2 className='text-sm font-semibold'>{good.drug}</h2>
          <p className='text-xs'>{good.form}</p>
          <p className='text-xs'>{good.fabr}</p>
          <p className='text-xs text-muted-foreground'>
            {good.mnn}
            {good.desc_id ? ` · ${good.desc_id}` : ""}
          </p>
        </div>
        <Button
          variant='outline'
          size='icon'
          className='w-8 h-8 p-0'
          onClick={() => fetchData()}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className='w-4 h-4 animate-spin' />
          ) : (
            <Search className='w-4 h-4' />
          )}
        </Button>
      </div>
      {data && open && (
        <Rls
          data={data}
          open={open}
          setOpen={setOpen}
          setData={setData}
          good={good}
          setGood={setGood}
        />
      )}
    </li>
  );
}

function Rls({
  data,
  setData,
  open,
  setOpen,
  good,
  setGood,
}: {
  data: Data[];
  setData: React.Dispatch<React.SetStateAction<any>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  good: GoodType;
  setGood: React.Dispatch<React.SetStateAction<GoodType>>;
}) {
  const [loading, setLoading] = useState(false);

  async function updateGood(good: GoodType, desc_id: number) {
    if (loading) return;

    setLoading(true);

    const action = await updateDescId(good.id, desc_id);
    if ("message" in action) {
      toast.error(action.message);
    } else {
      setGood((prev) => ({ ...prev, desc_id: action.desc_id }));
    }

    setLoading(false);
  }

  return (
    <DialogWrapper
      title='Добавить категорию'
      open={open}
      setOpen={(bool) => {
        if (!bool) setData(null);
        setOpen(bool);
      }}
      className='max-w-3xl'
      good={good}
    >
      <div className='p-2 bg-muted border rounded-xl'>
        <p className='text-sm font-semibold'>{good.drug}</p>
        <p className='text-xs'>{good.form}</p>
        <p className='text-xs'>{good.fabr}</p>
        <p className='text-xs text-muted-foreground'>{good.mnn}</p>
      </div>
      <div className='space-y-1'>
        {data.map((item: any, i: number) => (
          <Button
            key={i}
            variant={good.desc_id === item.desc_id ? "default" : "outline"}
            className='h-auto w-full p-2 px-3 text-sm flex-col font-normal items-start text-left truncate whitespace-pre-line'
            onClick={() => updateGood(good, item.desc_id)}
            disabled={loading}
          >
            <p className='text-xs text-muted-foreground'>
              {item.desc_id}
              {good.desc_id === item.desc_id && (
                <span className='font-semibold'>{` · Выбрано`}</span>
              )}
            </p>
            <p className='font-semibold'>{item.prep_full}</p>
            <p>{item.packing_full}</p>
            <p>{item.firms}</p>
          </Button>
        ))}
      </div>
    </DialogWrapper>
  );
}

function DialogWrapper({
  title,
  open,
  setOpen,
  trigger,
  children,
  className,
  good,
}: {
  title: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
  trigger?: React.ReactNode;
  className?: string;
  good: GoodType;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className={cn(
          "[&_.close-dialog]:hidden max-w-sm sm:rounded-2xl",
          className
        )}
      >
        <DialogHeader className='flex flex-row space-y-0 items-center justify-between gap-2'>
          <div>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription className='hidden'>
              Подзаголовок
            </DialogDescription>
          </div>
          <DialogClose asChild>
            <Button
              type='button'
              variant='secondary'
              className='close-button p-0 w-8 h-8 flex items-center justify-center bg-[#F2F2F2] rounded-full shrink-0'
            >
              <X className='w-4 h-4' />
            </Button>
          </DialogClose>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
