import { fetchPageStories } from "@/lib/db/story/data";
import { Skeleton } from "../ui/skeleton";
import StoriesList from "./stories/stories-list";
import { Suspense } from "react";

export default async function Stories() {
  return (
    <Suspense fallback={<Loading />}>
      <StoriesSuspense />
    </Suspense>
  );
}

async function StoriesSuspense() {
  const stories = await fetchPageStories();

  return <StoriesList stories={stories} />;
}

function Loading() {
  return (
    <section className='flex gap-2 overflow-x-auto scrollbar-hide'>
      {Array.from({ length: 5 }, (_, i) => (
        <Skeleton
          key={i}
          className='shrink-0 w-[165px] h-[220px] rounded-2xl'
        />
      ))}
    </section>
  );
}
