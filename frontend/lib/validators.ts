import { z } from "zod";

export type ScoringFormValues = {
  file: FileList | unknown;
  transactions: { date: string; amount: number }[];
  tokopedia?: number;
  shopee?: number;
  businessAge: number;
  employees: number;
  location: string;
};

export const scoringFormSchema = z.object({
  file: z
    .unknown()
    .refine((files) => files && (files as FileList).length === 1, "File is required.")
    .refine((files) => {
      const fl = files as FileList;
      return fl?.[0]?.size <= 5000000;
    }, "Max file size is 5MB.")
    .refine((files) => {
      const fl = files as FileList;
      return fl?.[0] ? ["image/jpeg", "image/png"].includes(fl[0].type) : false;
    }, "Only .jpg and .png formats are supported."),
  transactions: z
    .array(
      z.object({
        date: z.string().min(1, "Date is required."),
        amount: z.number().min(1, "Amount must be greater than 0."),
      }),
    )
    .min(1, "At least one transaction is required."),
  tokopedia: z.number().optional(),
  shopee: z.number().optional(),
  businessAge: z.number().min(1, "Business age is required."),
  employees: z.number().min(0),
  location: z.string().min(2, "Location is required."),
}) satisfies z.ZodType<ScoringFormValues>;
