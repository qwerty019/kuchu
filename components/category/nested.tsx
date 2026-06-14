import { CategoryForPage } from "@/lib/db/category/schema";
import { Button } from "../ui/button";
import Link from "next/link";

export default function Nested({
  nested,
}: {
  nested: CategoryForPage["children"];
}) {
  return (
    <section className='flex gap-2 flex-wrap'>
      {nested.map((c) => (
        <Button
          key={c.id}
          variant='secondary'
          size='sm'
          className='bg-[#F2F2F2] rounded-full'
          asChild
        >
          <Link key={c.id} href={`/category/${c.route}`}>
            {c.title}
          </Link>
        </Button>
      ))}
    </section>
  );
}
