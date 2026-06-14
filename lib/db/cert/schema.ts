import { z } from "zod";

export const Schema = z.object({
  id: z.coerce.number().int().positive(),
  userId: z.coerce.number().int().positive(),
  title: z.string().trim(),
  status: z.coerce.number().int(),
  nominal: z.coerce.number().int().positive(),
  number: z.string().trim(),
  expDate: z.string(),
  email: z.string().email(),
  isPaid: z.boolean().default(false),
  isDeleted: z.boolean().default(false),
  createdAt: z.string(),
  updatedAt: z.string(),
  code: z.string().trim().nullable(),
});

export const BaseSchema = Schema.pick({
  id: true,
  title: true,
  status: true,
  nominal: true,
  number: true,
  expDate: true,
  email: true,
  isPaid: true,
  createdAt: true,
});

const CertPaymentSchema = z.object({
  id: z.coerce.number().int().positive(),
  status: z.string().trim().nullable(),
  ykId: z.string().trim().nullable(),
});

export const CertWithPaymentsSchema = BaseSchema.extend({
  certPayments: z.array(CertPaymentSchema),
});

export type CertWithPayments = z.infer<typeof CertWithPaymentsSchema>;

const CertBranchSchema = z.object({
  id: z.coerce.number().int().positive(),
  branch: z.object({
    fbId: z.coerce.number().int().positive().nullable(),
  }),
});

export const CertWithBranchesAndPaymentsSchema = BaseSchema.extend({
  certPayments: z.array(CertPaymentSchema),
  certBranches: z.array(CertBranchSchema),
});

export type CertWithBranchesAndPayments = z.infer<
  typeof CertWithBranchesAndPaymentsSchema
>;
