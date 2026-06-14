import Upper from "@/components/info/upper";

export default async function Page() {
  return (
    <main className='main-page space-y-4'>
      <Upper title='Информация о контролирующих органах' />
      <section className='text-sm space-y-4'>
        <section className='space-y-2'>
          <div className='p-4 rounded-2xl bg-[#F2F2F2] space-y-4'>
            <p className='font-semibold'>
              Территориальный орган федеральной службы по надзору в сфере
              здравоохранения по Республике Саха (Якутия)
            </p>
            <p>Адрес: ТЦ Глобус-центр Улица Короленко, 2а1 этаж</p>
            <p>Тел: +74112425041</p>
          </div>
          <div className='p-4 rounded-2xl bg-[#F2F2F2] space-y-4'>
            <p className='font-semibold'>Министерство здравоохранения РФ</p>
            <p>Адрес: Ул.Лермонтова 126</p>
            <p>Тел: 88005509903</p>
          </div>
          <div className='p-4 rounded-2xl bg-[#F2F2F2] space-y-4'>
            <p className='font-semibold'>
              Центр гигиены и эпидемиологии в Республике Саха (Якутия)
            </p>
            <p>Адрес: Ул.Ойунского 9/1</p>
            <p>Тел: +74112352243</p>
          </div>
        </section>
      </section>
    </main>
  );
}
