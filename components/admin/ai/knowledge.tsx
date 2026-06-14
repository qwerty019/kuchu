"use client";

import { ApKnowledge } from "@/lib/db/apKnowledge/schema";
import { EditKnowledge } from "./knowledge-actions";

export function Knowledge({ knowledge }: { knowledge: ApKnowledge }) {
  return (
    <div className='w-full border rounded-2xl p-4 space-y-3'>
      <div className='space-y-1'>
        <p className='text-base font-medium'>{knowledge.title}</p>
        <p className='text-xs text-muted-foreground'>{knowledge.content}</p>
      </div>
      <EditKnowledge knowledge={knowledge} />
    </div>
  );
}
