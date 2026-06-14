import { Button } from "@/components/ui/button";

export function Buttons({
  setType,
}: {
  setType: (type: string | null) => void;
}) {
  return (
    <div className='space-y-2'>
      <Button
        className='w-full text-xs rounded-full bg-[#A03968] hover:bg-[#A03968] text-white'
        onClick={() => setType("delivery")}
      >
        Доставка курьером
      </Button>
      <Button
        className='w-full text-xs rounded-full bg-[#EECEDC] hover:bg-[#EECEDC] text-[#A03968]'
        onClick={() => setType("branch")}
      >
        Заберу из аптеки
      </Button>
    </div>
  );
}

export const texts = [
  {
    type: "delivery",
    title: "Уточните адрес",
    desc: "Точный адрес поможет нам рассчитать доставку, а курьеру – быстрее привезти заказ",
  },
  {
    type: "branch",
    title: "Выберите аптеку",
    desc: "Мы покажем наличие товаров по каждому адресу – выбирайте удобную вам точку на карте, заказ будет ждать вас там",
  },
  {
    type: "none",
    title: "Как вы хотите получить заказ?",
    desc: "Доставим курьером на дом или соберём заказ в удобной вам аптеке. Рецептурные препараты доступны столько для самовывоза, всё остальное быстро привезёт курьер",
  },
];
