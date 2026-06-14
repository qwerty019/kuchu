import Upper from "@/components/info/upper";

export default async function Page() {
  return (
    <main className='main-page space-y-4'>
      <Upper title='Адреса аптек' />
      <section className='text-sm space-y-4'>
        <section className='space-y-2'>
          <div className='p-4 rounded-2xl bg-[#A03968] text-white space-y-4'>
            <p className='font-semibold'>
              677000, г.Якутск, ул.Дзержинского, д.20 тел: 8(924) 662-10-20
            </p>
            <ul className='text-xs'>
              <li>- Будние дни: 9:00-19:00</li>
              <li>- Сб 10:00–18:00</li>
              <li>- Вс 10:00–18:00</li>
            </ul>
          </div>
          <div className='p-4 rounded-2xl bg-[#A03968] text-white space-y-4'>
            <p className='font-semibold'>
              677000, г.Якутск, пр.Ленина, д.7, кв.36 тел: 8(4112) 42-55-55, 8
              (924) 590-22-00
            </p>
            <ul className='text-xs'>
              <li>- Круглосуточно</li>
            </ul>
          </div>
          <div className='p-4 rounded-2xl bg-[#A03968] text-white space-y-4'>
            <p className='font-semibold'>
              677000, г.Якутск, ул.Кузьмина, д.34, пом.2 тел: 8(924) 590-22-00
            </p>
            <ul className='text-xs'>
              <li>- Будние дни: 9:00-19:00</li>
              <li>- Сб 10:00–17:00</li>
              <li>- Вс 10:00–17:00</li>
            </ul>
          </div>
        </section>
      </section>
    </main>
  );
}
