"use client";

import FormTextArea from "@/components/form/textarea";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { editInstructions } from "@/lib/db/aiProject/actions";
import { AiProject, EditInstructionsSchema } from "@/lib/db/aiProject/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export function Instructions({ project }: { project: AiProject }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof EditInstructionsSchema>>({
    resolver: zodResolver(EditInstructionsSchema),
    defaultValues: { instructions: project.instructions },
  });

  const isDirty = form.formState.isDirty;

  async function onSubmit(values: z.infer<typeof EditInstructionsSchema>) {
    if (isSubmitting || !isDirty) return;

    setIsSubmitting(true);

    const action = await editInstructions({
      id: project.id,
      body: values,
    });

    if ("message" in action) {
      toast.error(action.message);
    } else {
      toast.success("Успешно изменено");
      form.reset({ instructions: values.instructions });
    }

    setIsSubmitting(false);
  }

  return (
    <div className='flex flex-col h-[calc(100dvh-170px)]'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='w-full mb-4 h-full'
        >
          <div className='border rounded-2xl p-4 space-y-4 h-full min-h-[252px]'>
            <div className='flex items-center justify-between gap-1'>
              <p className='text-sm font-medium'>Инструкции</p>
              <div className='flex items-center gap-1'>
                <Button
                  type='submit'
                  className='h-8 text-xs rounded-full'
                  disabled={!isDirty}
                >
                  Сохранить
                </Button>
              </div>
            </div>
            <div className='flex-grow relative h-full'>
              <FormTextArea
                form={form}
                name='instructions'
                placeholder='Инструкция для бота'
                className='absolute inset-0 resize-none min-h-max h-[calc(100%-48px)] flex flex-grow thin-scrollbar'
              />
            </div>
          </div>
        </form>
      </Form>
      <div className='border rounded-2xl p-4 space-y-4 flex-1 max-h-[151px]'>
        <div className='flex items-center justify-between gap-2'>
          <p className='text-sm font-medium'>База знаний</p>
          {/* <Button
            variant='outline'
            size='sm'
            className='rounded-full text-xs h-8 cursor-default hover:bg-transparent'
          >
            {embeddings.find((m) => m.value === project.embeddingModel)
              ?.label || project.embeddingModel}
          </Button> */}
          <Button
            variant='outline'
            size='sm'
            className='h-8 text-xs rounded-full'
            asChild
          >
            <Link href={`/admin/ai/${project.id}/knowledges`}>Управлять</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
