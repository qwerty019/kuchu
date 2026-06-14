export const dynamic = "force-dynamic";

const goods = [
  {
    id: 26836,
    drug: "Мочалка детская",
    form: "ROXY губка с хлопк. покрытием (арт. RBS-001)",
    mnn: "Детские товары",
    fabr: "Рокси/Россия",
  },
];

export async function GET() {
  try {
    const all: {
      options: {
        value: string;
        type: string;
        filterId: number | undefined;
      }[];
      id: number;
      drug: string;
      form: string;
      mnn: string;
      fabr: string;
    }[] = [];

    const filtered = goods.filter((x) => x.form.toLowerCase().includes("очки"));

    for (const good of filtered) {
      const options = [];

      // Страна
      const country = getCountry(good.fabr);

      if (country) {
        const filter = filters.find((f) => f.title === "Страна");
        options.push({ value: country, type: "Страна", filterId: filter?.id });
      }

      // Фирма
      const company = getCompany(good.fabr);

      if (company) {
        const filter = filters.find((f) => f.title === "Фирма");
        options.push({ value: company, type: "Фирма", filterId: filter?.id });
      }

      // Тип
      const form = getType(good.drug);

      if (form) {
        const filter = filters.find((f) => f.title === "Тип");
        options.push({ value: form, type: "Тип", filterId: filter?.id });
      }

      // Количество в упаковке
      const qnt = getQuantity(good.form);

      if (qnt) {
        const filter = filters.find((f) => f.title === "Количество в упаковке");
        options.push({
          value: qnt,
          type: "Количество в упаковке",
          filterId: filter?.id,
        });
      }

      // Размер
      const size = getSize(good.form);

      if (size) {
        const filter = filters.find((f) => f.title === "Размер");
        options.push({ value: size, type: "Размер", filterId: filter?.id });
      }

      all.push({
        ...good,
        options,
      });
    }

    console.log(all.length, goods.length, filtered.length);

    all.sort((a, b) => a.form.localeCompare(b.form));

    return Response.json(all, { status: 200 });
  } catch (err) {
    console.log(err);
    return Response.json(
      { message: "Что-то пошло не так. Повторите еще." },
      { status: 500 }
    );
  }
}

function getVolume(form: string) {
  const match = form.match(/(\d+(?:,\d+)?)\s*мл/i);
  if (match) return match[1] + "мл";
  return null;
}

function getWeight(form: string) {
  const match = form.match(/(\d+(?:,\d+)?)\s*г/i);
  if (match) return match[1] + "г";
  return null;
}

function getSize(form: string) {
  if (form.includes(" L ")) {
    return "L";
  }

  if (form.includes(" M ")) {
    return "M";
  }

  if (form.includes(" М ")) {
    return "M";
  }

  if (form.includes(" S ")) {
    return "S";
  }

  if (form.includes(" XL ") || form.includes("ХL")) {
    return "XL";
  }

  if (form.includes(" Extra Large ")) {
    return "Extra Large";
  }

  if (form.includes(" Large ")) {
    return "Large";
  }

  if (form.includes(" Extra Small ")) {
    return "Extra Small";
  }

  if (form.includes(" Medium ")) {
    return "Medium";
  }

  if (form.includes(" Small ")) {
    return "Small";
  }

  return null;
}

function getPreparation(product: string) {
  const form = product.toLowerCase();

  const arr = [];

  if (
    form.includes("д/в/в") ||
    form.includes("в/в введ.") ||
    form.includes("в/в и ")
  ) {
    arr.push("Внутривенно");
  }
  if (
    form.includes("д/в/м введ.") ||
    form.includes("в/м введ.") ||
    form.includes("в/м)") ||
    form.includes("д/в/м и")
  ) {
    arr.push("Внутримышечно");
  }
  if (form.includes("внутрисуст. введ.")) {
    arr.push("Внутрисуставно");
  }
  if (form.includes("д/инф.") || form.includes("д/ин.")) {
    arr.push("Инфузионное");
  }
  if (form.includes("в/в введ.")) {
    arr.push("Внутривенно");
  }
  if (
    form.includes("местного прим.") ||
    form.includes("д/местн. прим.") ||
    form.includes("д/мест. прим.") ||
    form.includes("д/местн.") ||
    form.includes("д/мест. ") ||
    form.includes("полоск")
  ) {
    arr.push("Местное");
  }
  if (form.includes("п/к введ.")) {
    arr.push("Подкожно");
  }
  if (form.includes("орал.") || form.includes("орал)")) {
    arr.push("Орально");
  }
  if (form.includes("интраназ.")) {
    arr.push("Интраназально");
  }
  if (
    form.includes("д/приема внутрь") ||
    form.includes("д/приема вн.") ||
    form.includes("д/внутр. прим.")
  ) {
    arr.push("Внутрь");
  }
  if (
    form.includes("офтальмол.") ||
    form.includes("офтальм. увл.") ||
    form.includes("офтальм.")
  ) {
    arr.push("Офтальмологическое");
  }
  if (
    form.includes("д/ингал.") ||
    form.includes("д/инг.)") ||
    form.includes("д/инг. дозир.)")
  ) {
    arr.push("Ингаляционно");
  }
  if (
    form.includes("наружн. прим.") ||
    form.includes("д/наруж. прим.") ||
    form.includes("наружн.") ||
    form.includes("наруж. прим.")
  ) {
    arr.push("Наружное");
  }
  if (form.includes("д/подкожн. введ.") || form.includes("д/подкож. введ.")) {
    arr.push("Подкожно");
  }
  if (form.includes("д/рект. введ.")) {
    arr.push("Ректально");
  }

  if (!arr.length) {
    return null;
  }

  return arr;
}

function getDrugForm(product: string) {
  let form = product.toLowerCase();

  if (form.includes("(р-р")) {
    form = "Раствор";
  } else if (form.includes("(конц.")) {
    form = "Концентрат";
  } else if (form.includes("(лиоф.")) {
    form = "Лиофилизат";
  } else if (form.includes("(пор.")) {
    form = "Порошок";
  } else if (form.includes("(гран.")) {
    form = "Гранулы";
  }

  if (form === product.toLowerCase()) {
    return null;
  }

  return form;
}

function getType(form: string) {
  if (form.includes("Подгузники-трусики")) {
    return "Подгузники-трусики";
  }

  if (form.includes("Подгузники")) {
    return "Подгузники";
  }

  return null;
}

function getDosage(form: string) {
  const match = form.match(
    /([\d.,]+\s*(?:мг|мкг|МЕ|%|ЕД)(?:\s*\+\s*[\d.,]+\s*(?:мг|мкг|МЕ|%|ЕД))*)/
  );

  if (match) {
    return match[1];
  }

  return null;
}

function getQuantity(form: string) {
  const match = form.match(/№(\d+)/);
  return match ? match[1] : null;
}

function getCompany(fabr: string) {
  if (fabr.includes("/")) {
    return fabr.split("/")[0];
  }

  return null;
}

function getCountry(fabr: string) {
  const country = countries.find((c) => fabr.includes(c));
  return country;
}

const countries = [
  "Австралия",
  "Австрия",
  "Азербайджан",
  "Албания",
  "Алжир",
  "Ангола",
  "Аргентина",
  "Армения",
  "Афганистан",
  "Бангладеш",
  "Беларусь",
  "Бельгия",
  "Болгария",
  "Бразилия",
  "Великобритания",
  "Венгрия",
  "Вьетнам",
  "Германия",
  "Греция",
  "Грузия",
  "Дания",
  "Египет",
  "Израиль",
  "Индия",
  "Индонезия",
  "Иран",
  "Ирландия",
  "Исландия",
  "Испания",
  "Италия",
  "Казахстан",
  "Канада",
  "Кипр",
  "Китай",
  "Колумбия",
  "Корея",
  "Куба",
  "Латвия",
  "Литва",
  "Малайзия",
  "Мексика",
  "Молдова",
  "Монголия",
  "Нидерланды",
  "Новая Зеландия",
  "Норвегия",
  "Пакистан",
  "Польша",
  "Португалия",
  "Россия",
  "Румыния",
  "Сербия",
  "Сингапур",
  "Словакия",
  "Словения",
  "США",
  "Таиланд",
  "Турция",
  "Узбекистан",
  "Украина",
  "Финляндия",
  "Франция",
  "Хорватия",
  "Черногория",
  "Чехия",
  "Швейцария",
  "Швеция",
  "Эстония",
  "Южная Африка",
  "Япония",
];

const filters = [
  { id: 1, title: "Страна", type: "country" },
  { id: 2, title: "Фирма", type: "company" },
  { id: 3, title: "Лекарственная форма", type: "form" },
  { id: 4, title: "Количество в упаковке", type: "quantity" },
  { id: 5, title: "Дозировка", type: "dosage" },
  { id: 6, title: "Тип упаковки", type: "package" },
  { id: 7, title: "Способ применения", type: "usage" },
  { id: 8, title: "Тип", type: "type" },
  { id: 9, title: "Оптическая сила", type: "power" },
  { id: 10, title: "Форма выпуска", type: "release" },
  { id: 11, title: "Объем", type: "volume" },
  { id: 12, title: "Масса", type: "weight" },
  { id: 13, title: "Размер", type: "size" },
];
