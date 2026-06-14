"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EditStory } from "./story-actions";
import { Option } from "@/lib/definitions";
import { StoryAdmin } from "@/lib/db/story/schema";

export default function Story({
  story,
  branches,
  categories,
}: {
  story: StoryAdmin;
  branches: Option[];
  categories: Option[];
}) {
  const [edit, setEdit] = useState(false);

  return (
    <>
      <Button
        className='p-0 h-auto relative w-[100px] shrink-0 aspect-[3/4] bg-accent rounded-xl'
        onClick={() => setEdit(true)}
      >
        <div className='z-10 absolute inset-0 h-1/2 bg-gradient-to-b from-black/50 rounded-t-xl' />
        <Avatar className='w-full h-full rounded-xl'>
          <AvatarImage
            src={story.img}
            alt={story.title}
            className='w-full h-full object-cover rounded-xl'
          />
          <AvatarFallback className='w-full h-full rounded-xl' />
        </Avatar>
        <p className='z-10 absolute top-0 left-0 text-xs text-white font-medium w-[100px] p-2 whitespace-pre-line text-left'>
          {story.title}
        </p>
      </Button>
      {edit && (
        <EditStory
          id={story.id}
          branches={branches}
          categories={categories}
          open={edit}
          setOpen={setEdit}
        />
      )}
    </>
  );
}
