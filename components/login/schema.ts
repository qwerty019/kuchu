import { parsePhoneNumber } from "libphonenumber-js/mobile";
import { z } from "zod";

export const formSchema = z
  .object({
    phone: z
      .string()
      .trim()
      .refine(
        (value) => {
          try {
            const parsed = parsePhoneNumber(value, "RU");

            if (parsed.country !== "RU" || !parsed.isValid()) {
              return false;
            }

            return true;
          } catch (err) {
            return false;
          }
        },
        { message: "Неправильный номер телефона." }
      )
      .transform((value) => {
        const parsed = parsePhoneNumber(value, "RU");
        return parsed.number as string;
      }),
    callId: z.string().nullable(),
    date: z.date().nullable(),
    code: z.string(),
    promo: z.boolean(),
    share: z.boolean(),
    isNew: z.boolean(),
    surname: z.string().nullable(),
    name: z.string().nullable(),
    dob: z.string().nullable(),
    type: z.enum(["sms", "call"]),
  })
  .superRefine((data, ctx) => {
    if (data.callId && !data.code) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Обязательное поле",
        path: ["code"],
      });
    }

    if (data.callId && data.code.length !== 4) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Код должен содержать 4 цифры",
        path: ["code"],
      });
    }

    if (data.isNew) {
      if (!data.surname || data.surname.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Обязательное поле",
          path: ["surname"],
        });
      }
      if (!data.name || data.name.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Обязательное поле",
          path: ["name"],
        });
      }
      if (!data.dob) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Обязательное поле",
          path: ["dob"],
        });
      }
    }
  });
