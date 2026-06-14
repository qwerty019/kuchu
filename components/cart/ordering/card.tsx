import { useMainStore } from "@/providers/main-store-provider";
import { LogoSvg, Svg1, Svg2 } from "../../icons";
import { Button } from "../../ui/button";
import { useCartStore } from "@/providers/cart-store-provider";
import { DiscountCard } from "@/lib/definitions";
import { calculateDiscount } from "@/lib/utils";
import { Info } from "../definitions";

export default function Card({
  info,
  setInfo,
}: {
  setInfo: React.Dispatch<React.SetStateAction<Info>>;
  info: Info;
}) {
  const { items } = useCartStore((state) => state);
  const { discountCard } = useMainStore((state) => state);

  const sum = items.reduce((t, ci) => {
    const item = ci.qnts?.reduce((ip, qi) => ip + qi.price * qi.added, 0);
    return t + item;
  }, 0);
  const rightSum = parseFloat(sum.toFixed(2));

  if (!discountCard) return null;

  return (
    <div className='flex flex-col justify-between w-full aspect-video rounded-xl bg-[#865BBD] p-3 gap-3'>
      <div className='flex justify-between gap-2'>
        <LogoSvg />
        <div className='border rounded-full py-3 px-4 flex items-center gap-1'>
          <Svg1 className='text-[#FFFCED]' />
          <p className='text-white text-xs'>
            {discountCard
              ? discountCard?.accumulation || "Нет бонусов"
              : "Карта не найдена"}
          </p>
        </div>
      </div>
      <Svg2 className='ml-auto' />
      <div className='flex justify-between items-center gap-1'>
        <p className='text-white text-[10px]'>
          1% начисляем бонусами <br />
          До 30% — ваша скидка на заказ
        </p>
        <UseButton
          card={discountCard}
          info={info}
          setInfo={setInfo}
          sum={rightSum}
        />
      </div>
    </div>
  );
}

const UseButton = ({
  card,
  info,
  setInfo,
  sum,
}: {
  card: DiscountCard | null;
  info: Info;
  setInfo: React.Dispatch<React.SetStateAction<Info>>;
  sum: number;
}) => {
  if (!card) return null;
  if (!card.accumulation) return null;
  if (!card.discount) return null;

  const handleUse = () => {
    if (card.accumulation === 0) return;
    setInfo((prev) => ({
      ...prev,
      useCard: !prev.useCard,
      promo: "",
      cert: "",
    }));
  };

  const discount = calculateDiscount(sum, card.discount, card.accumulation);

  // todo
  if (card) return null;

  return (
    <Button
      className='bg-white text-[#865BBD] hover:bg-slate-50 rounded-full'
      onClick={() => handleUse()}
    >
      <div className='flex items-center gap-1'>
        <p className='mr-1'>{info.useCard ? "Списывание" : "Списать"}</p>
        <Svg1 className='text-[#865BBD]' />
        <p>{discount}</p>
      </div>
    </Button>
  );
};
