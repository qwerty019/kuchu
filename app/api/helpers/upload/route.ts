import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // You'll need to set up your Prisma client

type Data = {
  id: number;
  [key: string]: string | number | null | undefined;
};

export async function POST(request: Request) {
  try {
    const data: Data = await request.json();

    const arr = Object.entries(data)
      .map(([key, value]) => {
        if (key === "id") return;
        if (value === null || value === undefined) return;

        const title = titles.find((t) => t.value === key)?.label;

        if (!title) return;

        return {
          goodId: data.id,
          title,
          content: value as string,
          text: getText(value as string),
        };
      })
      .filter(isTruthy);

    const tr1 = prisma.content.deleteMany({
      where: { goodId: data.id },
    });

    const tr2 = prisma.content.createMany({
      data: arr,
    });

    await prisma.$transaction([tr1, tr2]);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error processing data:", error);
    return NextResponse.json(
      { error: "Failed to process data" },
      { status: 500 }
    );
  }
}

const titles = [
  { value: "COMPOSITION_DF", label: "Состав" },
  { value: "DRUGFORMDESCR", label: "Описание лекарственной формы" },
  { value: "PHARMAKINETIC", label: "Фармакокинетика" },
  { value: "PHARMADYNAMIC", label: "Фармакодинамика" },
  { value: "INDICATIONS", label: "Показания" },
  { value: "CONTRAINDICATIONS", label: "Противопоказания" },
  {
    value: "PREGNANCYUSE",
    label: "Применение при беременности и кормлении грудью",
  },
  { value: "USEMETHODANDDOSES", label: "Способ применения и дозы" },
  { value: "SIDEACTIONS", label: "Побочные действия" },
  { value: "INTERACTIONS", label: "Взаимодействие" },
  { value: "OVERDOSE", label: "Передозировка" },
  { value: "SPECIALGUIDELINES", label: "Особые указания" },
  { value: "FORM", label: "Форма выпуска" },
  { value: "APTEKA_CONDITION", label: "Условия отпуска из аптек" },
  { value: "MANUFACTURER", label: "Производитель" },
  { value: "PHARMGROUPS", label: "Фармакологическая группа" },
  { value: "PHARMACTIONS", label: "Фармакологическое действие" },
  { value: "MKB", label: "Нозологическая классификация (МКБ-10)" },
  { value: "ATC", label: "АТХ" },
  { value: "PHARMAPROPERTIES", label: "Фармакологические свойства" },
  { value: "PHARMAACTIONS", label: "Фармакологическое действие" },
  { value: "ACTONORG", label: "Действие на организм" },
  { value: "CHARACTERS", label: "Характеристика" },
  { value: "COMPOSITION", label: "Состав и форма выпуска" },
  { value: "COMMENT", label: "Комментарий" },
  { value: "COMPONENTSPROPERTIES", label: "Свойства компонентов" },
  { value: "CLINICALPHARMACOLOGY", label: "Клиническая фармакология" },
  { value: "RECOMMENDATIONS", label: "Рекомендации" },
  { value: "PRECAUTIONS", label: "Меры предосторожности" },
  { value: "INSTRFORPAC", label: "Инструкция для пациента" },
  { label: "Условия хранения", value: "STORAGE_CONDITION" },
  { label: "Срок годности", value: "EXPIRATION" },
  {
    label:
      "Влияние на способность к вождению автотранспорта и управлению механизмами",
    value: "DRIVING_EFFECT",
  },
  { label: "Применение у детей", value: "USECHILDREN" },
];

function isTruthy<T>(value: T): value is NonNullable<T> {
  return Boolean(value);
}

function getText(value: string) {
  // Replace HTML tags with empty string
  value = value.replace(/<br>/g, " ");
  value = value.replace(/<[^>]*>/g, "");

  // Replace common HTML entities
  value = value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt/g, "<")
    .replace(/&lt;/g, "<")
    .replace(/&gt/g, ">")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#8209;/g, "-")
    .replace(/&ndash;/g, "-")
    .replace(/&mdash/g, "-")
    .replace(/&mdash;/g, "-")
    .replace(/&#8722;/g, "-")
    .replace(/&#8239;/g, " ")
    .replace(/&#945/g, "α")
    .replace(/&#945;/g, "α")
    .replace(/&times;/g, "×")
    .replace(/&oacute;/g, "ó")
    .replace(/&alpha;/g, "α")
    .replace(/&deg;/g, "°")
    .replace(/&beta;/g, "β")
    .replace(/&#x00F3;/g, "ó")
    .replace(/&#903;/g, "·")
    .replace(/&frac12;/g, "½")
    .replace(/&gamma;/g, "γ")
    .replace(/&#946;/g, "β")
    .replace(/&middot;/g, "·")
    .replace(/&#593;/g, "ə")
    .replace(/&plusmn;/g, "±")
    .replace(/&mu;/g, "μ")
    .replace(/&laquo/g, "«")
    .replace(/&laquo;/g, "«")
    .replace(/&raquo/g, "»")
    .replace(/&raquo;/g, "»")
    .replace(/&ge/g, "≥")
    .replace(/&ge;/g, "≥")
    .replace(/&shy;/g, "")
    .replace(/&frac14;/g, "¼")
    .replace(/&frac13;/g, "⅓")
    .replace(/&#8595;/g, "↓")
    .replace(/&#8593;/g, "↑")
    .replace(/&le;/g, "≤")
    .replace(/&#8593;/g, "↑")
    .replace(/&#243;/g, "ó")
    .replace(/&#8805;/g, "≥")
    .replace(/&#947;/g, "γ")
    .replace(/&#8776;/g, "≈")
    .replace(/&le;/g, "≤")
    .replace(/&#956;/g, "μ")
    .replace(/&#954;/g, "κ")
    .replace(/&#948;/g, "δ")
    .replace(/&#963;/g, "σ")
    .replace(/&#215;/g, "×")
    .replace(/&#160;/g, " ")
    .replace(/&#x2014;/g, "—")
    .replace(/&#8804;/g, "≤")
    .replace(/&#x00D7;/g, "×")
    .replace(/&#x2212;/g, "−")
    .replace(/&#8734;/g, "∞")
    .replace(/&#x03B4;/g, "δ")
    .replace(/&#x03B1;/g, "α")
    .replace(/&#189;/g, "½")
    .replace(/&#967;/g, "χ")
    .replace(/&#x03B2;/g, "β")
    .replace(/&#8596;/g, "↔")
    .replace(/&#916;/g, "Δ")
    .replace(/&#x2015;/g, "―")
    .replace(/&#228;/g, "ä")
    .replace(/&#964;/g, "τ")
    .replace(/&#252;/g, "ü")
    .replace(/&#216;/g, "Ø");

  // Remove carriage returns, line breaks, and normalize spaces
  value = value
    .replace(/[\r\n]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return value;
}
