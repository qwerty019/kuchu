import DialogWrapper from "@/components/modal/modal-wrapper";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { GoodWithFilters } from "@/lib/db/good/schema";
import { fetcher } from "@/lib/fetcher";
import { useState } from "react";
import useSWR from "swr";
import { EditGoodFilter } from "./edit-good-filter";
import { AddGoodFilter } from "./add-good-filter";

export default function GoodFilters({
  id,
  open,
  setOpen,
}: {
  id: number;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [add, setAdd] = useState(false);

  const { data, isLoading, mutate, error } = useSWR<GoodWithFilters | null>(
    `/api/goods/${id}?type=filters`,
    fetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: false }
  );

  if (error) {
    return (
      <DialogWrapper title='Фильтры товара' open={open} setOpen={setOpen}>
        <div className='flex flex-col items-center justify-center border rounded-2xl p-3 gap-3'>
          <div className='text-center'>
            <p className='text-sm'>Ошибка</p>
            <p className='text-xs text-muted-foreground'>
              Что-то пошло не так. Повторите еще.
            </p>
          </div>
          <Button
            variant='outline'
            onClick={() => mutate()}
            className='p-4 rounded-full text-xs'
          >
            Попробовать снова
          </Button>
        </div>
      </DialogWrapper>
    );
  }

  if (isLoading) {
    return (
      <DialogWrapper title='Фильтры товара' open={open} setOpen={setOpen}>
        <div className='space-y-1'>
          <Skeleton className='h-[106px] rounded-2xl' />
          <Skeleton className='h-[106px] rounded-2xl' />
        </div>
      </DialogWrapper>
    );
  }

  if (!data) return null;

  return (
    <DialogWrapper title='Фильтры товара' open={open} setOpen={setOpen}>
      <div className='space-y-1'>
        {data.filters.length === 0 && (
          <div className='border rounded-2xl p-3 h-32 flex items-center justify-center'>
            <p className='text-sm text-muted-foreground'>Нет фильтров</p>
          </div>
        )}
        {data.filters.map((goodFilter) => (
          <FilterItem
            key={goodFilter.id}
            goodFilter={goodFilter}
            goodId={id}
            mutate={mutate}
          />
        ))}
      </div>
      <div className='flex flex-1 overflow-hidden'>
        <Button
          variant='outline'
          onClick={() => setAdd(true)}
          className='p-4 rounded-full text-xs w-full whitespace-pre-wrap'
        >
          Добавить фильтр
        </Button>
      </div>
      {add && (
        <AddGoodFilter
          open={add}
          setOpen={setAdd}
          goodId={id}
          mutate={mutate}
        />
      )}
    </DialogWrapper>
  );
}

const FilterItem = ({
  goodFilter,
  mutate,
  goodId,
}: {
  goodFilter: GoodWithFilters["filters"][number];
  mutate: () => void;
  goodId: number;
}) => {
  const [edit, setEdit] = useState(false);

  return (
    <div className='border rounded-2xl p-3 space-y-2'>
      <div>
        <h3 className='text-sm font-semibold'>{goodFilter.option.value}</h3>
        <p className='text-xs text-muted-foreground'>
          {goodFilter.option.filter.title}
        </p>
      </div>
      <Button
        variant='outline'
        size='sm'
        className='p-4 rounded-full text-xs w-fit'
        onClick={() => setEdit(true)}
      >
        Изменить
      </Button>
      {edit && (
        <EditGoodFilter
          open={edit}
          setOpen={setEdit}
          goodFilter={{
            id: goodFilter.id,
            goodId: goodId,
            optionId: goodFilter.option.id,
          }}
          mutate={mutate}
        />
      )}
    </div>
  );
};
