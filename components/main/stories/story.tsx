"use client";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import StoryCarousel from "./story-carousel";
import { PageStory } from "@/lib/db/story/definitions";

export default function Story({ story }: { story: PageStory }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className='w-[165px] shrink-0 relative rounded-2xl bg-accent aspect-[3/4]'>
          <div className='z-10 absolute inset-0 h-1/2 bg-gradient-to-b from-black/50 rounded-2xl' />
          <Avatar className='w-full h-full rounded-2xl'>
            <AvatarImage
              src={story.img}
              alt={story.title}
              className='w-full h-full object-cover rounded-2xl'
            />
            <AvatarFallback className='rounded-xl flex items-center justify-center' />
          </Avatar>
          <p className='z-10 absolute top-0 left-0 text-sm leading-tight text-white font-medium w-[165px] p-3 whitespace-pre-line'>
            {story.title}
          </p>
        </div>
      </DialogTrigger>
      {open && <StoryCarousel story={story} setOpen={setOpen} />}
    </Dialog>
  );
}
