export const dynamic = "force-dynamic";

import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const text = searchParams.get("text");

  if (!text) {
    return Response.json({ message: "Текст не найден" }, { status: 400 });
  }

  if (process.env.NODE_ENV === "development") {
    return Response.json({ results: testResults }, { status: 200 });
  }

  try {
    const endpoint = "https://suggest-maps.yandex.ru/v1/suggest";
    const params = new URLSearchParams({
      apikey: process.env.YANDEX_API_GEOSUGGEST!,
      text: `якутск ${text}`,
      lang: "ru",
      types: "house",
      attrs: "uri",
    });
    const url = `${endpoint}?${params.toString()}`;
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error("Что-то пошло не так. Повторите еще.");
    }

    const data = await res.json();

    return Response.json(data, { status: 200 });
  } catch (err) {
    console.log(err);
    return Response.json(
      { message: "Что-то пошло не так. Повторите еще." },
      { status: 500 }
    );
  }
}

const testResults = [
  {
    title: {
      text: "улица Петровского, 23/1",
      hl: [
        {
          begin: 6,
          end: 17,
        },
      ],
    },
    subtitle: {
      text: "Якутск, Республика Саха (Якутия)",
      hl: [
        {
          begin: 0,
          end: 6,
        },
        {
          begin: 25,
          end: 31,
          type: "MISPRINT",
        },
      ],
    },
    tags: ["house"],
    distance: {
      value: 11949658.4,
      text: "11949.66 км",
    },
    uri: "ymapsbm1://geo?data=Cgg1Nzg4ODEyMhJx0KDQvtGB0YHQuNGPLCDQoNC10YHQv9GD0LHQu9C40LrQsCDQodCw0YXQsCAo0K_QutGD0YLQuNGPKSwg0K_QutGD0YLRgdC6LCDRg9C70LjRhtCwINCf0LXRgtGA0L7QstGB0LrQvtCz0L4sIDIzLzE,",
  },
];
