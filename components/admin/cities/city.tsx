import Branch from "./branch";
import Zone from "./zone";
import { CityWithBranchesAndZones } from "@/lib/db/city/schema";
import { AddBranch } from "./branch-actions";
import { EditCity } from "./city-actions";

export default function City({ city }: { city: CityWithBranchesAndZones }) {
  return (
    <section className='w-full space-y-2'>
      <section className='flex flex-col md:flex-row md:items-center justify-between gap-2'>
        <h2 className='text-xl font-semibold'>{city.title}</h2>
        <div className='flex items-center gap-2'>
          <AddBranch cityId={city.id} />
          <EditCity city={city} />
        </div>
      </section>
      <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2'>
        {city.zones.map((zone) => (
          <Zone key={zone.id} zone={zone} />
        ))}
      </section>
      <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2'>
        {city.branches.map((branch) => (
          <Branch
            key={branch.id}
            branch={branch}
            goods={branch.goodCount}
            osts={branch._count.osts}
          />
        ))}
        {city.branches.length === 0 && (
          <div className='col-span-3 border rounded-md py-2 px-3 h-52 flex items-center justify-center'>
            <p className='text-sm text-muted-foreground'>Нет филиалов</p>
          </div>
        )}
      </section>
    </section>
  );
}
