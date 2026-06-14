import { z } from "zod";

export const certSchema = z.object({
  id: z.number().int().positive(),
  title: z
    .string()
    .trim()
    .min(1, {
      message: "Название обязательно",
    })
    .max(255, {
      message: "Название слишком длинное",
    }),
  status: z.number().int(),
  nominal: z.number().int(),
  number: z.string(),
  email: z.string().email(),
  isPaid: z.boolean(),
});

export const AddCertSchema = certSchema.omit({
  id: true,
  isPaid: true,
});

export type Cert = z.infer<typeof certSchema>;
