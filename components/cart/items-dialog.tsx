import { ImageOff, X } from "lucide-react";
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
import Link from "next/link";
import ModalAlert from "../modal/modal-alert";
import { useCartStore } from "@/providers/cart-store-provider";
import { useMainStore } from "@/providers/main-store-provider";

export default function ItemsDialog({
  open,
  setOpen,
  list,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  list: CartItemState[];
}) {
  const { branches, branch } = useMainStore((state) => state);

  const selectedBranch = branches.find((b) => b.id === Number(branch));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='[&_.close-dialog]:hidden sm:max-w-md max-w-none sm:rounded-2xl bg-[#A03968]'>
        <DialogHeader className='flex flex-col space-y-2 items-center text-center'>
          <DialogTitle className='text-white'>Уточняем</DialogTitle>
          <DialogDescription className='text-white text-center text-sm font-medium leading-tight max-w-xs'>
            При выбранном способе получения, не все товары из корзины доступны,
            вы можете их удалить или поменять способ получения
          </DialogDescription>
        </DialogHeader>
        <div className='p-4 bg-white rounded-2xl space-y-8'>
          {list.length === 0 && (
            <div className='p-2 border rounded-lg h-16 flex items-center justify-center'>
              <p className='text-xs text-muted-foreground'>
                Ваша корзина пуста
              </p>
            </div>
          )}
          {list.map((item) => {
            const sum = item.qnts?.reduce(
              (acc, curr) => acc + curr.price * curr.added,
              0
            );
            const rightSum = parseFloat(sum.toFixed(2));

            return (
              <div key={item.id} className='flex gap-2'>
                <div className='relative'>
                  <Link href={`/product/${item.regId}`}>
                    <Avatar className='w-16 h-16 aspect-square rounded-lg border'>
                      <AvatarImage
                        src={
                          item.img ||
                          `https://kuchu.shop/drugs/images/${item.regId}.jpeg` ||
                          undefined
                        }
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
                        {item.title || item.drug}
                      </p>
                    </Link>
                    <p className='text-muted-foreground'>
                      <span>{item.subtitle || item.form}</span>
                    </p>
                    {item.comment && (
                      <p className='text-destructive'>{item.comment}</p>
                    )}
                    <p className='text-sm font-semibold whitespace-nowrap'>
                      {rightSum} ₽
                    </p>
                  </div>
                  <AlertDialogRemove2 itemId={item.id} />
                </div>
              </div>
            );
          })}
        </div>
        <DialogClose asChild>
          <Button
            type='button'
            size='sm'
            className='mx-auto bg-white hover:bg-white/80 w-[120px] close-button h-7 text-xs flex items-center justify-center text-[#A03968] rounded-full shrink-0'
            onClick={() => setOpen(false)}
          >
            Хорошо
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

function AlertDialogRemove2({ itemId }: { itemId: number }) {
  const { removeCartItem } = useCartStore((state) => state);

  return (
    <ModalAlert
      title='Вы уверены, что хотите удалить товар из корзины?'
      onClick={() => removeCartItem(itemId)}
    >
      <Button className='h-full p-0 bg-transparent hover:bg-transparent hover:text-primary text-muted-foreground'>
        <X className='w-5 h-5' />
      </Button>
    </ModalAlert>
  );
}
