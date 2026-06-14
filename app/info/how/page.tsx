import Upper from "@/components/info/upper";

export default async function Home() {
  return (
    <main className='main-page space-y-4'>
      <Upper title='Как оформить заказ' />
      <section className='lg:ml-5 text-sm space-y-4'>
        <p className='font-semibold'>
          1. Найдите нужный товар через строку поиска (достаточно набрать часть
          названия)
        </p>
        <p className='italic'>
          Искать можно по заболеваниям (например, «Противовирусные», «Сердце и
          сосуды», «Диабет») и по действующему веществу.
        </p>
      </section>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className='w-full rounded-2xl border' src='/docs/how/0.jpg' alt='' />
      <section className='lg:ml-5 text-sm space-y-4'>
        <p className='font-semibold'>
          2. Добавьте товар в корзину, укажите нужное количество.
        </p>
      </section>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className='w-full rounded-2xl border' src='/docs/how/1.jpg' alt='' />
      <section className='lg:ml-5 text-sm space-y-4'>
        <p className='font-semibold'>
          3. После выбора необходимо авторизоваться по номеру телефона.
        </p>
      </section>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className='w-full rounded-2xl border' src='/docs/how/2.jpg' alt='' />
      <section className='lg:ml-5 text-sm space-y-4'>
        <p className='font-semibold'>
          4. Выберите удобный для Вас способ получения заказа:
        </p>
        <ul className='space-y-2'>
          <li>- Самовывоз из аптеки;</li>
          <li>- Доставка курьером;</li>
        </ul>
      </section>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className='w-full rounded-2xl border' src='/docs/how/3.jpg' alt='' />
      <section className='lg:ml-5 text-sm space-y-4'>
        <p className='font-semibold'>При самовывозе выберите аптеку</p>
        <p>
          Выберите из предложенного списка аптеку, где планируете забрать заказ.
          Проверьте состав вашего заказа в выбранной аптеке.
        </p>
      </section>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className='w-full rounded-2xl border' src='/docs/how/4.jpg' alt='' />
      <section className='lg:ml-5 text-sm space-y-4'>
        <p className='font-semibold'>Доставка курьера</p>
        <p>Уточните адрес</p>
        <p>
          Точный адрес поможет нам рассчитать доставку, а курьеру – быстрее
          привезти заказ.
        </p>
      </section>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className='w-full rounded-2xl border' src='/docs/how/5.jpg' alt='' />
      <section className='lg:ml-5 text-sm space-y-4'>
        <p className='font-semibold'>5 Выберите способ оплаты</p>
      </section>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className='w-full rounded-2xl border' src='/docs/how/6.jpg' alt='' />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className='w-full rounded-2xl border' src='/docs/how/7.png' alt='' />
    </main>
  );
}
