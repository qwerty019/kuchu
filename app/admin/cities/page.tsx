import City from "@/components/admin/cities/city";
import { AddCity } from "@/components/admin/cities/city-actions";
import Empty from "@/components/ui/custom/empty";
import { fetchCitiesWithBranchesAndZones } from "@/lib/db/city/data";
import { isAdmin } from "@/lib/utils-server";

export default async function Page() {
  await isAdmin("/admin/cities");

  const cities = await fetchCitiesWithBranchesAndZones();

  return (
    <main className='admin-page space-y-6'>
      <h1 className='scroll-m-20 text-3xl font-extrabold tracking-tight'>
        Города и филиалы
      </h1>
      <section className='space-y-2'>
        {cities.map((city) => (
          <City key={city.id} city={city} />
        ))}
        {cities.length === 0 && <Empty message='Нет городов' />}
      </section>
      <section className='flex items-center gap-2'>
        <AddCity />
      </section>
    </main>
  );
}
