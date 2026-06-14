import { Button } from "../../ui/button";
import { CurrentOrder } from "@/lib/db/order/schema";

export default function Thanks({
  order,
  setOpen,
  hideMainButton,
}: {
  order: CurrentOrder;
  setOpen: (open: boolean) => void;
  hideMainButton?: boolean;
}) {
  const text = texts.find((x) =>
    order.address ? x.type === "delivery" : x.type === "pickup"
  );

  return (
    <section className='flex flex-col flex-1 gap-4 rounded-2xl bg-background p-4'>
      <div className='flex flex-col items-center justify-center gap-2 text-center max-w-xs mx-auto'>
        <p className='font-semibold text-lg leading-none'>
          Спасибо
          <br />
          что доверяете нам!
        </p>
        <p className='text-muted-foreground text-xs font-medium whitespace-pre-line'>
          {text?.title}
        </p>
      </div>
      <div className='w-full h-full space-y-4'>
        <div className='w-full h-full overflow-hidden rounded-xl flex items-center justify-center'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src='/images/thank-you.png'
            alt='thank-you'
            className='w-2/3 object-cover mx-auto'
          />
        </div>
      </div>
      <div className='flex flex-col items-center justify-center gap-2 text-center max-w-xs mx-auto'>
        <p className='font-semibold text-xs leading-none'>
          Перепроверьте детали заказа
        </p>
        <p className='text-muted-foreground text-xs font-medium whitespace-pre-line'>
          {text?.text}
        </p>
      </div>
      <div className='space-y-2'>
        <div className='flex gap-2'>
          <div className='bg-[#404040] text-white rounded-2xl p-4 w-fit text-xs font-semibold'>
            <p>{order.address ? "Доставка" : "Самовывоз"}</p>
            <p>{order.deliveryFee ? `${order.deliveryFee} ₽` : "0 ₽"}</p>
          </div>
          <div className='bg-[#F2F2F2] rounded-2xl p-4 w-full text-xs font-semibold'>
            <p>{order.address ? order.address.address : order.branch?.title}</p>
            <p className='text-muted-foreground'>
              {order.address ? order.deliveryTime : "Самовывоз"}
            </p>
          </div>
        </div>
        <div className='bg-[#F2F2F2] rounded-2xl p-4 w-full text-xs font-semibold'>
          <p>Способ оплаты</p>
          <p className='text-muted-foreground'>
            {order.paymentType === "card"
              ? "Картой на сайте"
              : order.paymentType === "cash"
                ? "Наличными"
                : "Картой при получении"}
          </p>
        </div>
        <div className='flex items-center gap-2'>
          {order.payments.length > 0 &&
            order.payments[0].status === "pending" && (
              <Button
                className='w-full md:w-fit rounded-full p-6 text-xs'
                asChild
              >
                <a
                  href={`/payment?token=${order.payments[0].token}&orderId=${order.id}`}
                >
                  Оплатить
                </a>
              </Button>
            )}
          {!hideMainButton && (
            <Button
              className='w-full rounded-full bg-[#A03968] hover:bg-[#A03968]/90 p-6 text-xs'
              onClick={() => setOpen(false)}
            >
              Вернуться в аптеку
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}

const texts = [
  {
    type: "delivery",
    title: "Собирем заказ\nи отправим курьером",
    text: "Вы можете отменить заказ,\nтолько до того как его передали курьеру",
  },
  {
    type: "pickup",
    title: "Бережно собирем заказ",
    text: "После оплаты,\nзаказ возврату не подлежит",
  },
];
