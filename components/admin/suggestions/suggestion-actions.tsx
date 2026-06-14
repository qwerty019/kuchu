"use client";

import { DynamicForm } from "@/components/forms";
import { Button } from "@/components/ui/button";
import {
  addSuggestion,
  deleteSuggestion,
  editSuggestion,
} from "@/lib/db/suggestion/actions";
import {
  AddSuggestionSchema,
  EditSuggestionSchema,
  Suggestion,
} from "@/lib/db/suggestion/schema";

export function AddSuggestion() {
  return (
    <DynamicForm
      formSchema={AddSuggestionSchema}
      action={async (data) => {
        return await addSuggestion(data);
      }}
      title='Добавить подсказку'
      initialData={{ title: "" }}
      trigger={
        <Button
          className='rounded-full text-xs gap-2'
          variant='secondary'
          size='sm'
        >
          Добавить подсказку
        </Button>
      }
      sections={[
        {
          type: "input",
          name: "title",
          placeholder: "Название",
          required: true,
        },
      ]}
    />
  );
}

export function EditSuggestion({
  suggestion,
  open,
  setOpen,
}: {
  suggestion: Suggestion;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <DynamicForm
      open={open}
      setOpen={setOpen}
      formSchema={EditSuggestionSchema}
      action={async (data) => {
        return await editSuggestion(suggestion.id, data);
      }}
      title='Редактировать подсказку'
      initialData={{ title: suggestion.title }}
      buttonText='Редактировать'
      deleteAction={async () => {
        return await deleteSuggestion(suggestion.id);
      }}
      deleteConfirmDescription='Это действие нельзя отменить. Подсказка и все связанные с ним данные будут удалены навсегда.'
      sections={[
        {
          type: "input",
          name: "title",
          placeholder: "Название",
          required: true,
        },
      ]}
    />
  );
}
