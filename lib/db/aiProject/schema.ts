import { z } from "zod";

export const Schema = z.object({
  id: z.coerce.number().int().positive(),
  title: z.string().trim().min(1, { message: "Название обязательно" }),
  description: z.string().trim().nullable(),
  instructions: z.string().trim().min(1, { message: "Инструкция обязательна" }),
  selected: z.boolean().default(false),
});

export const AddAiProjectSchema = Schema.pick({
  title: true,
  description: true,
  instructions: true,
});

export const EditAiProjectSchema = Schema.pick({
  title: true,
  description: true,
  selected: true,
});

export const EditInstructionsSchema = Schema.pick({
  instructions: true,
});

export type AiProject = z.infer<typeof Schema>;
