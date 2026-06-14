import { useCartStore } from "@/providers/cart-store-provider";
import { useMainStore } from "@/providers/main-store-provider";
import { Button } from "../ui/button";
import { Loader2, Minus, Plus } from "lucide-react";
import { Good } from "@/lib/db/good/definitions";
import { useState } from "react";
import { CartItemState } from "@/stores/cart-store";
import { setCookie } from "@/lib/actions";
import CheckItemsDialog from "./check-items-dialog";
import { toast } from "sonner";
import { isWithinDateRange } from "@/lib/utils";

export default function GoodButtons({
  good,
  isDrawer,
}: {
  good: Good;
  isDrawer?: boolean;
}) {
  const { branch, method, onboarding, setOnboarding } = useMainStore(
    (state) => state
  );
  const { items, addCartItem, decreaseQnt } = useCartStore((state) => state);

  const cartItem = items.find((i) => i.id === good.id);
  const osts = good.ost.filter((x) => x.branchId === Number(branch));
  const qnt = Math.floor(osts.reduce((acc, curr) => acc + curr.uQntOst, 0));
  const recipe = method === "delivery" && osts.some((x) => x.recipe);

  const lastPrice = osts[osts.length - 1]?.priceRoznWNDS;
  const ost = osts.find((qnt, index) => {
    const cartQnt = cartItem?.qnts[index];
    if (cartQnt) return qnt.uQntOst > cartQnt.added;
    return qnt.uQntOst > 0;
  });
  const nextPrice = ost?.priceRoznWNDS || lastPrice || 0;

  const handleAdd = (item: Good) => {
    if (!item) return;
    if (qnt === 0) return;
    if (recipe) return;
    if (!branch) return;

    addCartItem(item, branch);
  };

  // Example usage: 6 Feb 2026 00:00:00 to 7 Feb 2026 23:59:59 in +09:00 timezone
  const isDisabledFeb = isWithinDateRange({
    start: new Date(Date.UTC(2026, 1, 6, 0, 0, 0)), // Months are 0-indexed, so 1 is February
    end: new Date(Date.UTC(2026, 1, 7, 23, 59, 59)),
    timezoneOffset: 9,
  });

  if (isDisabledFeb) {
    return <ItemButton disabled>Временно недоступно</ItemButton>;
  }

  if (recipe) return <ShowOstInfo good={good} />;

  if (qnt === 0) {
    const allCount = good.ost.reduce((acc, curr) => acc + curr.uQntOst, 0);

    if (allCount === 0) {
      return <ItemButton disabled>Нет в наличии</ItemButton>;
    }

    return (
      <ShowOstInfo
        good={good}
        desc='Товара нет в наличии в этом филиале, вы можете выбрать способ получения'
      />
    );
  }

  if (!cartItem) {
    return (
      <ItemButton
        onClick={() => {
          handleAdd(good);
          if (onboarding.cart !== "true" && onboarding.mounted) {
            setOnboarding((prev) => ({ ...prev, cart: "show" }));
          }
        }}
      >
        <p>{nextPrice} ₽</p>
        <Plus className='w-4 h-4' />
      </ItemButton>
    );
  }

  const qnts = cartItem?.qnts?.reduce((acc, curr) => acc + curr.added, 0);

  return (
    <div className='flex w-full items-center justify-center rounded-full h-[44px] py-2 px-3 mt-auto gap-3 bg-[#A03968] text-white hover:bg-[#A03968]'>
      <Button
        className='h-full p-0 bg-transparent hover:bg-transparent'
        onClick={() => decreaseQnt(good.id)}
      >
        <Minus className='w-4 h-4' />
      </Button>
      <div className='text-center'>
        <p className='font-semibold text-sm leading-tight'>{nextPrice} ₽</p>
        {isDrawer && (
          <p className='text-[10px] text-white/80 leading-tight'>
            {qnts} шт.
          </p>
        )}
      </div>
      {qnts !== qnt && (
        <Button
          className='h-full p-0 bg-transparent hover:bg-transparent'
          onClick={() => {
            handleAdd(good);
            if (onboarding.cart !== "true" && onboarding.mounted) {
              setOnboarding((prev) => ({ ...prev, cart: "show" }));
            }
          }}
        >
          <Plus className='w-4 h-4' />
        </Button>
      )}
    </div>
  );
}

const ShowOstInfo = ({ good, desc }: { good: Good; desc?: string }) => {
  return (
    <div className='bg-[#A03968] p-3 rounded-2xl space-y-3'>
      <p className='text-white text-xs text-center'>
        {desc ||
          "Доставка рецептурных лекарств не осуществляется, вы можете выбрать способ получения"}
      </p>
      <div className='space-y-1'>
        {Array.from(new Set(good.ost.map((o) => o.branchId))).map((bId) => (
          <BranchItem key={bId} good={good} branchId={bId} />
        ))}
      </div>
    </div>
  );
};

const BranchItem = ({ good, branchId }: { good: Good; branchId: number }) => {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<CartItemState[]>([]);
  const [open, setOpen] = useState(false);

  const { branches, setMethod, setBranch } = useMainStore((state) => state);
  const { items } = useCartStore((state) => state);

  const branchOsts = good.ost.filter((o) => o.branchId === branchId);
  const minPrice = Math.min(...branchOsts.map((o) => o.priceRoznWNDS));
  const branch = branches.find((b) => b.id === branchId);

  const addItemAndChangeBranch = async (branchId: number) => {
    setLoading(true);

    try {
      const res = await fetch("/api/cart/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, branch: branchId, method: "pickup" }),
      });

      if (!res.ok) {
        throw new Error("Ошибка при проверке доступности товаров.");
      }

      const data: CartItemState[] = await res.json();

      if (data.some((x) => x.comment)) {
        setList(data);
        setOpen(true);
      } else {
        await setCookie("method", "pickup");
        await setCookie("branch", `${branchId}`);

        setMethod("pickup");
        setBranch(`${branchId}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Ошибка при проверке доступности товаров.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-white rounded-xl flex items-center gap-2 justify-between py-2 px-3'>
      <div className='truncate'>
        <p className='font-medium text-sm truncate'>{branch?.title}</p>
        <p className='text-muted-foreground text-xs truncate'>Самовывоз</p>
      </div>
      <div className='flex items-center gap-1'>
        <div className='px-2 py-1 rounded-full bg-[#F2F2F2] h-6'>
          <p className='text-xs text-[#A03968] font-semibold whitespace-nowrap'>
            {minPrice} ₽
          </p>
        </div>
        <Button
          size='sm'
          className='text-xs h-6 rounded-full bg-[#A03968] hover:bg-[#A03968]/80 min-w-[75px]'
          onClick={() => addItemAndChangeBranch(branchId)}
          disabled={loading}
        >
          {loading ? <Loader2 className='w-3 h-3 animate-spin' /> : "Выбрать"}
        </Button>
      </div>
      {open && (
        <CheckItemsDialog
          open={open}
          setOpen={setOpen}
          list={list}
          setList={setList}
          branch={branchId}
          method='pickup'
        />
      )}
    </div>
  );
};

const ItemButton = ({
  onClick,
  disabled,
  children,
}: {
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) => {
  return (
    <Button
      className='relative w-full h-auto p-3 mt-auto bg-[#A03968] text-white hover:bg-[#A03968]/80 disabled:bg-[#be5e89] disabled:opacity-100 flex items-center gap-2 rounded-full z-10'
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  );
};
