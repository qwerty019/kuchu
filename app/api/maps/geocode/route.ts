export const dynamic = "force-dynamic";

import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const uri = searchParams.get("uri");

  if (!uri) {
    return Response.json({ message: "URI не найден" }, { status: 400 });
  }

  if (process.env.NODE_ENV === "development") {
    return Response.json(geo, { status: 200 });
  }

  try {
    const endpoint = "https://geocode-maps.yandex.ru/1.x/";
    const params = new URLSearchParams({
      apikey: process.env.NEXT_PUBLIC_YANDEX_API_KEY!,
      uri,
      lang: "ru",
      format: "json",
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

const geo = {
  response: {
    GeoObjectCollection: {
      metaDataProperty: {
        GeocoderResponseMetaData: {
          found: "1",
        },
      },
      featureMember: [
        {
          GeoObject: {
            metaDataProperty: {
              GeocoderMetaData: {
                precision: "exact",
                text: "Россия, Республика Саха (Якутия), Якутск, улица Петровского, 23/1",
                kind: "house",
                Address: {
                  country_code: "RU",
                  formatted:
                    "Россия, Республика Саха (Якутия), Якутск, улица Петровского, 23/1",
                  postal_code: "677008",
                  Components: [
                    {
                      kind: "country",
                      name: "Россия",
                    },
                    {
                      kind: "province",
                      name: "Дальневосточный федеральный округ",
                    },
                    {
                      kind: "province",
                      name: "Республика Саха (Якутия)",
                    },
                    {
                      kind: "area",
                      name: "городской округ Якутск",
                    },
                    {
                      kind: "locality",
                      name: "Якутск",
                    },
                    {
                      kind: "street",
                      name: "улица Петровского",
                    },
                    {
                      kind: "house",
                      name: "23/1",
                    },
                  ],
                },
                AddressDetails: {
                  Country: {
                    AddressLine:
                      "Россия, Республика Саха (Якутия), Якутск, улица Петровского, 23/1",
                    CountryNameCode: "RU",
                    CountryName: "Россия",
                    AdministrativeArea: {
                      AdministrativeAreaName: "Республика Саха (Якутия)",
                      SubAdministrativeArea: {
                        SubAdministrativeAreaName: "городской округ Якутск",
                        Locality: {
                          LocalityName: "Якутск",
                          Thoroughfare: {
                            ThoroughfareName: "улица Петровского",
                            Premise: {
                              PremiseNumber: "23/1",
                              PostalCode: {
                                PostalCodeNumber: "677008",
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            name: "улица Петровского, 23/1",
            description: "Якутск, Республика Саха (Якутия), Россия",
            boundedBy: {
              Envelope: {
                lowerCorner: "129.699713 62.025199",
                upperCorner: "129.707924 62.029056",
              },
            },
            uri: "ymapsbm1://geo?data=Cgg1Nzg4ODEyMhJx0KDQvtGB0YHQuNGPLCDQoNC10YHQv9GD0LHQu9C40LrQsCDQodCw0YXQsCAo0K_QutGD0YLQuNGPKSwg0K_QutGD0YLRgdC6LCDRg9C70LjRhtCwINCf0LXRgtGA0L7QstGB0LrQvtCz0L4sIDIzLzEiCg0ttAFDFccbeEI,",
            Point: {
              pos: "129.703818 62.027128",
            },
          },
        },
      ],
    },
  },
};
