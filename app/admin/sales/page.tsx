export const dynamic = "force-dynamic";

import Banner from "@/components/admin/sales/banner";
import { AddBanner } from "@/components/admin/sales/banner-actions";
import Promo from "@/components/admin/sales/promo";
import { AddPromo } from "@/components/admin/sales/promo-actions";
import Sale from "@/components/admin/sales/sale";
import { AddSale } from "@/components/admin/sales/sale-actions";
import Story from "@/components/admin/sales/story";
import { AddStory } from "@/components/admin/sales/story-actions";
import { getBanners } from "@/lib/db/banner/data";
import { fetchBranches } from "@/lib/db/branch/data";
import { fetchAllCategories } from "@/lib/db/category/data";
import { fetchPromos } from "@/lib/db/promo/data";
import { fetchSales } from "@/lib/db/sale/data";
import { fetchStories } from "@/lib/db/story/data";
import { Option } from "@/lib/definitions";
import { isAdmin } from "@/lib/utils-server";

export default async function Page() {
  await isAdmin("/admin/sales");

  const branches = await fetchBranches();
  const categories = await fetchAllCategories({ parentId: "notNull" });

  return (
    <main className='admin-page space-y-6'>
      <h1 className='scroll-m-20 text-3xl font-extrabold tracking-tight'>
        Акции
      </h1>
      <section className='space-y-4'>
        <Stories
          branches={branches.map((b) => ({
            value: b.id.toString(),
            label: b.title,
            desc: b.address || undefined,
          }))}
          categories={categories}
        />
        <Sales
          branches={branches.map((b) => ({
            value: b.id.toString(),
            label: b.title,
            desc: b.address || undefined,
          }))}
          categories={categories}
        />
        <Promos />
        <Banners
          branches={branches.map((b) => ({
            value: b.id.toString(),
            label: b.title,
            desc: b.address || undefined,
          }))}
        />
      </section>
    </main>
  );
}

async function Promos() {
  const promos = await fetchPromos();

  return (
    <section className='space-y-4'>
      <h2 className='scroll-m-20 text-2xl font-extrabold tracking-tight'>
        Промокоды
      </h2>
      <section className='flex gap-1 overflow-x-auto -mx-4 px-4'>
        <AddPromo />
        {promos.map((promo) => (
          <Promo key={promo.id} promo={promo} />
        ))}
      </section>
    </section>
  );
}

async function Sales({
  branches,
  categories,
}: {
  branches: Option[];
  categories: Option[];
}) {
  const sales = await fetchSales();

  return (
    <section className='space-y-4'>
      <h2 className='scroll-m-20 text-2xl font-extrabold tracking-tight'>
        Акции
      </h2>
      <section className='flex gap-1 overflow-x-auto -mx-4 px-4'>
        <AddSale categories={categories} branches={branches} />
        {sales.map((sale) => (
          <Sale
            key={sale.id}
            sale={sale}
            branches={branches}
            categories={categories}
          />
        ))}
      </section>
    </section>
  );
}

async function Stories({
  branches,
  categories,
}: {
  branches: Option[];
  categories: Option[];
}) {
  const stories = await fetchStories();

  return (
    <section className='space-y-4'>
      <h2 className='scroll-m-20 text-2xl font-extrabold tracking-tight'>
        Сторизы
      </h2>
      <section className='flex gap-1 overflow-x-auto -mx-4 px-4'>
        <AddStory branches={branches} categories={categories} />
        {stories.map((story) => (
          <Story
            key={story.id}
            story={story}
            branches={branches}
            categories={categories}
          />
        ))}
      </section>
    </section>
  );
}

async function Banners({ branches }: { branches: Option[] }) {
  const banners = await getBanners();

  return (
    <section className='space-y-4'>
      <h2 className='scroll-m-20 text-2xl font-extrabold tracking-tight'>
        Баннеры
      </h2>
      <section className='flex gap-1 overflow-x-auto -mx-4 px-4'>
        <AddBanner branches={branches} />
        {banners.map((banner) => (
          <Banner key={banner.id} banner={banner} branches={branches} />
        ))}
      </section>
    </section>
  );
}
