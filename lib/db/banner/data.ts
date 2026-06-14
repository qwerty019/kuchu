"use server";

import { db } from "@/db";
import { banner, bannerBranch } from "@/db/schema";
import { eq, asc, and, inArray } from "drizzle-orm";
import { unstable_noStore as noStore } from "next/cache";
import { cookies } from "next/headers";
import { Banner, BannerInEdit, PageBanner } from "./schema";

export async function getBannersForPage() {
  noStore();

  const branch = cookies().get("branch")?.value;

  try {
    if (branch) {
      const bannerBranches = await db.query.bannerBranch.findMany({
        where: and(
          eq(bannerBranch.isDeleted, false),
          eq(bannerBranch.branchId, Number(branch))
        ),
        columns: { bannerId: true },
      });

      const bannerIds = bannerBranches.map((b) => b.bannerId);

      if (bannerIds.length === 0) return [];

      const banners = await db.query.banner.findMany({
        where: and(
          eq(banner.isDeleted, false),
          inArray(banner.id, bannerIds),
          eq(banner.show, true)
        ),
        orderBy: asc(banner.position),
        columns: {
          id: true,
          title: true,
          img: true,
          subtitle: true,
          position: true,
          show: true,
        },
      });

      return banners satisfies PageBanner[];
    }

    const banners = await db.query.banner.findMany({
      where: and(eq(banner.isDeleted, false), eq(banner.show, true)),
      orderBy: asc(banner.position),
      columns: {
        id: true,
        title: true,
        img: true,
        subtitle: true,
        position: true,
        show: true,
      },
    });

    return banners satisfies PageBanner[];
  } catch (error) {
    console.log(error);
    throw new Error("Ошибка при получении баннеров");
  }
}

export async function getBanners() {
  noStore();

  try {
    const banners = await db.query.banner.findMany({
      where: eq(banner.isDeleted, false),
      orderBy: asc(banner.position),
      columns: {
        id: true,
        title: true,
        img: true,
        subtitle: true,
      },
    });

    return banners satisfies Banner[];
  } catch (error) {
    console.log(error);
    throw new Error("Ошибка при получении баннеров");
  }
}

export async function getBannerInEdit({ id }: { id: number }) {
  noStore();

  try {
    const bannerResult = await db.query.banner.findFirst({
      where: and(eq(banner.isDeleted, false), eq(banner.id, id)),
      columns: {
        id: true,
        title: true,
        img: true,
        subtitle: true,
        position: true,
        show: true,
      },
      with: {
        bannerBranches: {
          where: eq(bannerBranch.isDeleted, false),
          columns: { branchId: true },
        },
      },
    });

    if (!bannerResult) {
      throw new Error("Баннер не найден");
    }

    const transformed = {
      ...bannerResult,
      bannerbranches: bannerResult.bannerBranches.map((b) => b.branchId),
    };

    return transformed satisfies BannerInEdit;
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Ошибка при получении баннера");
  }
}
