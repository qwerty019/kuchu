import { ImageOff, Loader2, X } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { CartItemState } from "@/stores/cart-store";
import { useMainStore } from "@/providers/main-store-provider";
import Link from "next/link";
import ModalAlert from "../modal/modal-alert";
import { useCartStore } from "@/providers/cart-store-provider";
import { useState } from "react";
import { setCookie } from "@/lib/actions";

export default function CheckItemsDialog({
  open,
  setOpen,
  list,
  setList,
  branch,
  method,
  onSuccess,
  name,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  list: CartItemState[];
  setList: React.Dispatch<React.SetStateAction<CartItemState[]>>;
  branch: number;
  method: string;
  onSuccess?: () => void;
  name?: string | null;
}) {
  const [clicked, setClicked] = useState(false);

  const { branches, setMethod, setBranch } = useMainStore((state) => state);
  const { setItems, setLastShown } = useCartStore((state) => state);

  const selectedBranch = branches.find((b) => b.id === branch);

  const handleChange = async (id: number) => {
    if (!id || clicked) return;

    setClicked(true);

    await setCookie("method", method);
    await setCookie("branch", `${id}`);

    setMethod(method);
    setBranch(`${id}`);

    setItems(list);
    setLastShown(Date.now());
    setClicked(false);
    setOpen(false);

    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='[&_.close-dialog]:hidden sm:max-w-md max-w-none sm:rounded-2xl bg-[#A03968]'>
        <DialogHeader className='flex flex-col space-y-2 items-center text-center'>
          <DialogTitle className='text-white'>Уточняем</DialogTitle>
          <DialogDescription className='text-white text-center text-sm font-medium leading-tight max-w-xs'>
            При смене способа получения, не все товары из корзины доступны, вы
            может их удалить или вернуться назад
          </DialogDescription>
        </DialogHeader>
        <div className='p-4 bg-white rounded-2xl space-y-8'>
          {list.length === 0 && (
            <div className='p-2 border rounded-lg h-16 flex items-center justify-center'>
              <p className='text-xs text-muted-foreground'>Корзина пуста</p>
            </div>
          )}
          {list.map((item) => {
            const sum = item.qnts?.reduce(
              (acc, curr) => acc + curr.price * curr.added,
              0,
            );
            const rightSum = parseFloat(sum.toFixed(2));

            return (
              <div key={item.id} className='flex gap-2'>
                <div className='relative'>
                  <Link href={`/product/${item.regId}`}>
                    <Avatar className='w-16 h-16 aspect-square rounded-lg border'>
                      <AvatarImage
                        src={item.img || undefined}
                        alt={item.drug}
                        className='aspect-square object-contain p-[15%] rounded-lg'
                      />
                      <AvatarFallback className='rounded-lg text-muted-foreground bg-[#F2F2F2] flex items-center justify-center'>
                        <ImageOff className='w-6 h-6' />
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                </div>
                <div className='flex w-full gap-4 justify-between'>
                  <div className='text-xs font-semibold'>
                    <Link
                      href={`/product/${item.regId}`}
                      className='hover:underline'
                    >
                      <p
                        style={{
                          textDecoration: item.disabled
                            ? "line-through"
                            : "none",
                        }}
                      >
                        {item.drug}
                      </p>
                    </Link>
                    <p className='text-muted-foreground'>
                      <span>{item.form || "Неизвестно"}</span>
                    </p>
                    {item.comment && (
                      <p className='text-destructive'>{item.comment}</p>
                    )}
                    <p className='text-sm font-semibold whitespace-nowrap'>
                      {rightSum} ₽
                    </p>
                  </div>
                  <AlertDialogRemove2 itemId={item.id} setList={setList} />
                </div>
              </div>
            );
          })}
          <div className='flex flex-col items-center gap-2'>
            <Button
              type='button'
              size='sm'
              className='mx-auto bg-[#A03968] hover:bg-[#A03968]/80 w-[120px] close-button h-7 text-xs flex items-center justify-center text-white rounded-full shrink-0'
              onClick={() => handleChange(branch)}
              disabled={clicked}
            >
              {clicked ? (
                <Loader2 className='w-3 h-3 animate-spin' />
              ) : (
                "Подтвердить"
              )}
            </Button>
            <p className='text-muted-foreground text-xs'>
              {name || selectedBranch?.title || "Неизвестно"}
            </p>
          </div>
        </div>
        <DialogClose asChild>
          <Button
            type='button'
            size='sm'
            className='mx-auto bg-white hover:bg-white/80 w-[120px] close-button h-7 text-xs flex items-center justify-center text-[#A03968] rounded-full shrink-0'
          >
            Назад
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

function AlertDialogRemove2({
  itemId,
  setList,
}: {
  itemId: number;
  setList: React.Dispatch<React.SetStateAction<CartItemState[]>>;
}) {
  return (
    <ModalAlert
      title='Вы уверены, что хотите удалить товар из корзины?'
      onClick={() => {
        setList((prev) => prev.filter((item) => item.id !== itemId));
      }}
    >
      <Button className='h-full p-0 bg-transparent hover:bg-transparent hover:text-primary text-muted-foreground'>
        <X className='w-5 h-5' />
      </Button>
    </ModalAlert>
  );
}
