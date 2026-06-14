import { Button } from "@/components/ui/button";
import { DiscountCard } from "@/lib/farmbazis/definitions";
import { updateCard } from "./actions";
import { toast } from "sonner";
import { useState } from "react";
import DialogWrapper from "@/components/modal/modal-wrapper";

export function CardsModal({
  cards,
  open,
  setOpen,
  setUsers,
  setCards,
  id,
}: {
  cards: DiscountCard[];
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCards: React.Dispatch<React.SetStateAction<DiscountCard[]>>;
  setUsers: any;
  id: number;
}) {
  const [clicked, setClicked] = useState(false);

  const handleUpdate = async (card: DiscountCard, id: number) => {
    if (clicked) return;

    const confirm = window.confirm("Соединить карту?");
    if (!confirm) return;

    setClicked(true);

    const action = await updateCard(card, id);
    if ("message" in action) {
      toast.error(action.message);
      setClicked(false);
      return;
    }

    setUsers((prev: any) => {
      const index = prev.findIndex((u: any) => u.id === id);
      prev[index].discountCards = [action];
      return [...prev];
    });

    setClicked(false);
    setOpen(false);
    setCards([]);
  };

  return (
    <DialogWrapper open={open} setOpen={setOpen} title='Дисконтные карты'>
      <div className='grid grid-cols-2 gap-2'>
        {cards?.map((card) => (
          <Button
            key={card.barcode}
            variant='outline'
            className='p-3 items-start flex-col h-auto border rounded-lg text-sm space-y-1'
            onClick={() => handleUpdate(card, id)}
            disabled={clicked}
          >
            <p className='text-muted-foreground text-xs'>{card.barcode}</p>
            <p>Сумма: {card.accumulation}</p>
            <p className='text-muted-foreground text-xs'>
              {clicked ? "Подождите..." : "Активная карта"}
            </p>
          </Button>
        ))}
      </div>
    </DialogWrapper>
  );
}
