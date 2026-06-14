"use client";

import { PageStory } from "@/lib/db/story/definitions";
import Story from "./story";

export default function StoriesList({ stories }: { stories: PageStory[] }) {
  if (stories.length === 0) {
    return null;
  }

  return (
    <section className='flex gap-2 overflow-x-auto scrollbar-hide'>
      {stories.map((s) => (
        <Story key={s.id} story={s} />
      ))}
    </section>
  );
}
