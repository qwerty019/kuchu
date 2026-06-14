"use client";

import { DynamicForm } from "@/components/forms";
import { Button } from "@/components/ui/button";
import {
  addApKnowledge,
  deleteApKnowledge,
  editApKnowledge,
} from "@/lib/db/apKnowledge/actions";
import {
  AddApKnowledgeSchema,
  ApKnowledge,
  EditApKnowledgeSchema,
} from "@/lib/db/apKnowledge/schema";

export function AddKnowledge({ projectId }: { projectId: number }) {
  return (
    <DynamicForm
      formSchema={AddApKnowledgeSchema}
      action={async (data) => {
        return await addApKnowledge({ body: data });
      }}
      title='Добавить знание'
      initialData={{ title: "", content: "", projectId: projectId }}
      trigger={
        <Button
          className='rounded-full text-xs gap-2'
          variant='secondary'
          size='sm'
        >
          Добавить знание
        </Button>
      }
      sections={[
        {
          type: "input",
          name: "title",
          placeholder: "Название",
          required: true,
        },
        {
          type: "textarea",
          name: "content",
          placeholder: "Контент",
          required: true,
        },
      ]}
    />
  );
}

export function EditKnowledge({ knowledge }: { knowledge: ApKnowledge }) {
  return (
    <DynamicForm
      formSchema={EditApKnowledgeSchema}
      action={async (data) => {
        return await editApKnowledge({ id: knowledge.id, body: data });
      }}
      title='Редактировать знание'
      initialData={{
        title: knowledge.title,
        content: knowledge.content,
      }}
      buttonText='Редактировать'
      trigger={
        <Button
          type='button'
          variant='outline'
          className='rounded-full p-4 text-xs'
        >
          Редактировать
        </Button>
      }
      deleteAction={async () => {
        return await deleteApKnowledge({ id: knowledge.id });
      }}
      deleteConfirmDescription='Это действие нельзя отменить. Знание и все связанные с ним данные будут удалены навсегда.'
      sections={[
        {
          type: "input",
          name: "title",
          placeholder: "Название",
          required: true,
        },
        {
          type: "textarea",
          name: "content",
          placeholder: "Контент",
          required: true,
        },
      ]}
    />
  );
}
