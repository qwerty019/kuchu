import { useMainStore } from "@/providers/main-store-provider";
import { Button } from "../ui/button";
import { Good } from "@/lib/db/good/definitions";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ImageOff, Loader2, X } from "lucide-react";
import { useCartStore } from "@/providers/cart-store-provider";
import { useState } from "react";
import { addUserGood } from "@/lib/db/userGood/actions";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function FavoritesList() {
  const { favorites, setShowFavorites } = useMainStore((state) => state);

  return (
    <section className='p-4 hidden lg:block fixed right-0 w-80 shrink-0 bg-[#A03968] h-[calc(100vh-64px-16px-16px)] rounded-2xl mr-4 overflow-hidden'>
      <div className='flex flex-col gap-4 h-full justify-between'>
        <h4 className='scroll-m-20 text-xl font-bold text-white'>Избранное</h4>
        <div className='bg-background space-y-3 h-full rounded-2xl p-3 overflow-y-auto'>
          {favorites.map((good) => (
            <FavoriteItem key={good.id} good={good} />
          ))}
          {favorites.length === 0 && (
            <p className='text-center text-muted-foreground h-full flex items-center justify-center text-sm'>
              Вы не добавили <br /> ни одного товара в избранное
            </p>
          )}
        </div>
        <Button
          className='w-full h-14 text-sm rounded-full text-[#A03968] bg-background hover:bg-background/80'
          onClick={() => setShowFavorites(false)}
        >
          Закрыть
        </Button>
      </div>
    </section>
  );
}

export const FavoriteItem = ({ good }: { good: Good }) => {
  const { items, addCartItem } = useCartStore((state) => state);
  const { branch, method } = useMainStore((state) => state);

  const cartItem = items.find((i) => i.id === good.id);

  const osts = good.ost.filter((x) => x.branchId === Number(branch));
  const qnt = Math.floor(osts.reduce((acc, curr) => acc + curr.uQntOst, 0));
  const lastPrice = osts[osts.length - 1]?.priceRoznWNDS || 0;
  const recipe = method === "delivery" && osts.some((x) => x.recipe);

  const handleAdd = (item: Good) => {
    if (!item) return;
    if (qnt === 0) return;
    if (recipe) return;
    if (!branch) return;
    if (cartItem) return;

    addCartItem(item, branch);
  };

  return (
    <div className='flex gap-2'>
      <div className='relative'>
        <Link href={`/product/${good.regId}`}>
          <Avatar className='w-16 h-16 aspect-square rounded-lg border'>
            <AvatarImage
              src={good.img || undefined}
              alt={good.drug}
              className='aspect-square object-contain p-[15%]'
            />
            <AvatarFallback className='rounded-lg text-muted-foreground bg-[#F2F2F2] flex items-center justify-center'>
              <ImageOff className='w-6 h-6' />
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>
      <div className='space-y-1.5 w-full'>
        <div className='flex w-full gap-4 justify-between'>
          <div className='text-xs font-semibold'>
            <Link href={`/product/${good.regId}`} className='hover:underline'>
              {good.title || good.drug}
            </Link>
            <p className='text-muted-foreground'>
              <span>{good.subtitle || good.form}</span>
            </p>
          </div>
          <AlertDialogRemove goodId={good.id} />
        </div>
        <div className='flex items-center gap-1 justify-between'>
          <Button
            size='sm'
            className='h-7 text-xs rounded-full text-white bg-[#A03968] hover:bg-[#A03968]/80'
            disabled={cartItem || qnt === 0 ? true : false}
            onClick={() => handleAdd(good)}
          >
            {cartItem ? "В корзине" : "В корзину"}
          </Button>
          <p className='text-sm font-semibold'>{lastPrice} ₽</p>
        </div>
      </div>
    </div>
  );
};

function AlertDialogRemove({ goodId }: { goodId: number }) {
  const { favorites, setFavorites } = useMainStore((state) => state);

  const [open, setOpen] = useState(false);
  const [clicked, setClicked] = useState(false);

  const handleRemove = async (goodId: number) => {
    if (clicked) return;

    setClicked(true);

    await addUserGood(goodId);

    setClicked(false);

    const filtered = favorites.filter((g) => g.id !== goodId);
    setFavorites(filtered);

    toast.success("Товар удален из избранного.");

    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className='h-full p-1 bg-transparent hover:bg-transparent text-[#A03968]'>
          <X className='w-4 h-4' />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className='sm:rounded-2xl'>
        <AlertDialogHeader>
          <AlertDialogTitle>Вы точно уверены?</AlertDialogTitle>
          <AlertDialogDescription>
            Вы уверены, что хотите удалить товар из избранного?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className='rounded-full p-4 text-xs'>
            Отмена
          </AlertDialogCancel>
          <Button
            type='button'
            className='rounded-full bg-[#A03968] hover:bg-[#A03968] p-4 text-xs'
            onClick={() => handleRemove(goodId)}
            disabled={clicked}
          >
            {clicked ? (
              <Loader2 className='animate-spin w-4 h-4' />
            ) : (
              "Подтвердить"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
