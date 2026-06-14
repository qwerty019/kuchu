export const footerContacts = [
  { value: "+7 (924) 590-22-00", href: "tel:+79245902200" },
  { value: "aptemp@mail.ru", href: "mailto:aptemp@mail.ru" },
  { value: "Whatsapp", href: "https://wa.me/79245902200" },
] as const;

export const footerLinks1 = [
  { title: "О нас", href: "/info/about" },
  { title: "Адреса аптек", href: "/info/addresses" },
  { title: "Лицензия", href: "/info/license" },
  { title: "Контакты", href: "/info/contacts" },
  { title: "Возврат и обмен", href: "/info/return" },
  { title: "Выписка из реестра", href: "/info/statement" },
] as const;

export const footerLinks2 = [
  { title: "Оплата", href: "/info/payment" },
  { title: "Доставка", href: "/info/delivery" },
  { title: "Как оформить заказ", href: "/info/how" },
  { title: "Пользовательское соглашение", href: "/info/terms" },
  { title: "Политика конфиденциальности", href: "/info/privacy" },
  {
    title: "Информация о контролирующих органах",
    href: "/info/regulatory",
  },
  {
    title: "Политика в отношении обработки персональных данных",
    href: "/info/privacy_policy",
  },
] as const;

export const footerInfoLinks = [...footerLinks1, ...footerLinks2];

export const footerLegalText =
  'Зона, время, товары и предложения доставки ограничены. Организатор, продавец ООО "АПТЕКА ЭМП", ИНН 1435357632, ОГРН 1211400000481677005 город Якутск ул. Петра Алексеева дом 79 кв18';

export const footerStreamlineHref = "https://www.streamlinehq.com/illustrations";

/** Тёмно-серые разделители строк каталога / футера на странице поиска */
export const searchListDividerClass = "border-b border-[#525252]";
