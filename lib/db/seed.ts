"use server";

import prisma from "../prisma";

export async function seed() {
  try {
    const cities = await prisma.city.findMany({
      where: {
        isDeleted: false,
      },
    });

    if (cities.length > 0) return { message: "Cities already seeded" };

    await prisma.city.create({
      data: {
        title: "Якутск",
        route: "index",
        branches: {
          createMany: {
            data: [
              {
                title: "Ленина, д. 7",
                address: "Ленина, д. 7",
                main: true,
                fbId: 19278,
              },
              {
                title: "Кузьмина, д. 34",
                address: "Кузьмина, д. 34",
                main: false,
                fbId: 19619,
              },
              {
                title: "Дзержинского, д. 20",
                address: "Дзержинского, д. 20",
                main: false,
                fbId: 19637,
              },
            ],
          },
        },
      },
    });

    await prisma.navText.createMany({
      data: [
        { text: "К себе бережно", show: true },
        { text: "Время для здоровья - сейчас", show: true },
        { text: "Безопасно, этично, бережно", show: true },
        { text: "Поддерживаем здоровье, не только лечим", show: true },
        { text: "Бережем здоровье и время", show: true },
      ],
    });

    return { message: "Seed completed" };
  } catch (error) {
    console.log(error);
    return { message: "Что-то пошло не так. Повторите еще." };
  }
}
