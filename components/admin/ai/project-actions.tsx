"use client";

import { DynamicForm } from "@/components/forms";
import { Button } from "@/components/ui/button";
import {
  addAiProject,
  deleteAiProject,
  editAiProject,
} from "@/lib/db/aiProject/actions";
import {
  AddAiProjectSchema,
  AiProject,
  EditAiProjectSchema,
} from "@/lib/db/aiProject/schema";
import { Pencil } from "lucide-react";

export function AddProject() {
  return (
    <DynamicForm
      formSchema={AddAiProjectSchema}
      action={async (data) => {
        return await addAiProject({ body: data });
      }}
      title='Добавить проект'
      initialData={{ title: "", description: null, instructions: "" }}
      trigger={
        <Button
          className='rounded-full text-xs gap-2'
          variant='secondary'
          size='sm'
        >
          Добавить проект
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
          type: "input",
          name: "description",
          placeholder: "Описание",
          required: false,
        },
        {
          name: "instructions",
          placeholder: "Инструкции",
          type: "textarea",
          required: true,
        },
      ]}
    />
  );
}

export function EditProject({ project }: { project: AiProject }) {
  return (
    <DynamicForm
      formSchema={EditAiProjectSchema}
      action={async (data) => {
        return await editAiProject({ id: project.id, body: data });
      }}
      title='Редактировать город'
      initialData={{
        title: project.title,
        description: project.description,
        selected: project.selected,
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
        return await deleteAiProject({ id: project.id });
      }}
      deleteConfirmDescription='Это действие нельзя отменить. Проект и все связанные с ним данные будут удалены навсегда.'
      sections={[
        {
          type: "input",
          name: "title",
          placeholder: "Название",
          required: true,
        },
        {
          name: "description",
          placeholder: "Описание",
          type: "input",
          required: false,
        },
        {
          name: "selected",
          label: "Выбранный проект",
          type: "checkbox",
          required: false,
        },
      ]}
    />
  );
}
