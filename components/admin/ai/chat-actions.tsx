"use client";

import { DynamicForm } from "@/components/forms";
import { Button } from "@/components/ui/button";
import { addApChat, deleteApChat, editApChat } from "@/lib/db/apChat/actions";
import {
  AddApChatSchema,
  ApChat,
  EditApChatSchema,
} from "@/lib/db/apChat/schema";
import { Pencil } from "lucide-react";

export function AddChat({ projectId }: { projectId: number }) {
  return (
    <DynamicForm
      formSchema={AddApChatSchema}
      action={async (data) => {
        return await addApChat({ body: data });
      }}
      title='Добавить чат'
      initialData={{ title: "", projectId: projectId }}
      trigger={
        <Button
          className='rounded-full text-xs gap-2'
          variant='secondary'
          size='sm'
        >
          Добавить чат
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

export function EditChat({ chat }: { chat: ApChat }) {
  return (
    <DynamicForm
      formSchema={EditApChatSchema}
      action={async (data) => {
        return await editApChat({ id: chat.id, body: data });
      }}
      title='Редактировать чат'
      initialData={{
        title: chat.title,
      }}
      buttonText='Редактировать'
      trigger={
        <Button
          className='rounded-xl w-8 h-8 shrink-0'
          variant='outline'
          size='icon'
        >
          <Pencil className='w-4 h-4' />
        </Button>
      }
      deleteAction={async () => {
        return await deleteApChat({ id: chat.id });
      }}
      deleteConfirmDescription='Это действие нельзя отменить. Чат и все связанные с ним данные будут удалены навсегда.'
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
