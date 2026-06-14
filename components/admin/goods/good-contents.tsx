import DialogWrapper from "@/components/modal/modal-wrapper";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { GoodWithContents } from "@/lib/db/good/schema";
import { fetcher } from "@/lib/fetcher";
import { useState } from "react";
import useSWR from "swr";
import { AddContent } from "./add-content";
import { Content } from "@/lib/db/content/schema";
import { EditContent } from "./edit-content";

export default function GoodContents({
  id,
  open,
  setOpen,
}: {
  id: number;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [add, setAdd] = useState(false);

  const { data, isLoading, mutate, error } = useSWR<GoodWithContents | null>(
    `/api/goods/${id}?type=contents`,
    fetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: false }
  );

  if (error) {
    return (
      <DialogWrapper title='Описания товара' open={open} setOpen={setOpen}>
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
      <DialogWrapper title='Описания товара' open={open} setOpen={setOpen}>
        <div className='space-y-1'>
          <Skeleton className='h-[62px]' />
          <Skeleton className='h-[62px]' />
        </div>
      </DialogWrapper>
    );
  }

  if (!data) return null;

  return (
    <DialogWrapper title='Описания товара' open={open} setOpen={setOpen}>
      <div className='space-y-1'>
        {data.contents.length === 0 && (
          <div className='border rounded-2xl p-3 h-32 flex items-center justify-center'>
            <p className='text-sm text-muted-foreground'>Нет описаний</p>
          </div>
        )}
        {data.contents.map((content) => (
          <ContentItem
            key={content.id}
            content={content}
            imported={data.imported}
            mutate={mutate}
          />
        ))}
      </div>
      <div className='flex flex-1 overflow-hidden'>
        <Button
          variant='outline'
          onClick={() => setAdd(true)}
          className='p-4 rounded-full text-xs w-full whitespace-pre-wrap'
          disabled={data.imported ? true : false}
        >
          {data.imported
            ? "Нельзя редактировать описания импортированных из РЛС"
            : "Добавить описание"}
        </Button>
      </div>
      {add && (
        <AddContent open={add} setOpen={setAdd} goodId={id} mutate={mutate} />
      )}
    </DialogWrapper>
  );
}

const ContentItem = ({
  content,
  imported,
  mutate,
}: {
  content: Content;
  imported: boolean;
  mutate: () => void;
}) => {
  const [edit, setEdit] = useState(false);

  return (
    <div className='border rounded-2xl p-3 space-y-2'>
      <div>
        <h3 className='text-sm font-semibold'>{content.title}</h3>
        {/* <p className='text-sm whitespace-pre-wrap'>{content.text}</p> */}
        <div
          dangerouslySetInnerHTML={{ __html: content.content }}
          className='space-y-1 text-xs'
        />
      </div>
      {!imported ? (
        <Button
          variant='outline'
          size='sm'
          className='p-4 rounded-full text-xs w-fit'
          onClick={() => setEdit(true)}
        >
          Изменить
        </Button>
      ) : null}
      {edit && (
        <EditContent
          open={edit}
          setOpen={setEdit}
          content={content}
          mutate={mutate}
        />
      )}
    </div>
  );
};
