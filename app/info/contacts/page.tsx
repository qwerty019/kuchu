import Upper from "@/components/info/upper";

export default async function Home() {
  return (
    <main className='main-page space-y-4'>
      <Upper title='Контакты' />
      <section className='lg:ml-5 text-sm space-y-3'>
        <p>ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ &quot;АПТЕКА ЭМП&quot;;</p>
        <p>
          Юридический адрес: 677005 город Якутск ул. Петра Алексеева дом 79 кв18
        </p>
        <p>ИНН 1435357632</p>
        <p>ОГРН: 1211400000481</p>
        <p>Тел: +7(4112)32-46-59</p>
        <p>E-mail: aptemp@mail.ru</p>
        <p>Лицензия № ЛО-14-02-001059 от 24.09.2021</p>
        <p>Справочная служба и прием заказов:</p>
        <ul className='space-y-1'>
          <li>- Тел: +79245902200</li>
          <li>- E-mail: aptemp@mail.ru</li>
          <li>- kuchu.shop</li>
        </ul>
        <p>
          Сотрудник ответственный за размещение на сайте в сети интернет -
          Степанова Наталья Сергеевна.
        </p>
      </section>
    </main>
  );
}
