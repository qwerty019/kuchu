import { z } from "zod";

const Schema = z.object({
  id: z.coerce.number().int().positive(),
  optionId: z.coerce.number().int().positive(),
  goodId: z.coerce.number().int().positive(),
});

export type GoodFilter = z.infer<typeof Schema>;

export const AddGoodFilterSchema = Schema.pick({
  optionId: true,
  goodId: true,
});

export const EditGoodFilterSchema = Schema.pick({
  optionId: true,
  goodId: true,
});
