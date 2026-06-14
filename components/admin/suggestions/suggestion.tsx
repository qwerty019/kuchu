"use client";

import type { Suggestion } from "@/lib/db/suggestion/schema";
import { EditSuggestion } from "./suggestion-actions";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

export default function Suggestion({ suggestion }: { suggestion: Suggestion }) {
  const [edit, setEdit] = useState(false);

  return (
    <>
      <li className='border rounded-lg p-2 pl-3 flex gap-2 items-center justify-between'>
        <p className='text-sm'>{suggestion.title}</p>
        <Button
          variant='outline'
          size='icon'
          className='h-8 w-8'
          onClick={() => setEdit(true)}
        >
          <Pencil className='w-4 h-4' />
        </Button>
      </li>
      {edit && (
        <EditSuggestion suggestion={suggestion} open={edit} setOpen={setEdit} />
      )}
    </>
  );
}
