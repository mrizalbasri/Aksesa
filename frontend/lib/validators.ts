import { z } from "zod";

export const invoiceSchema = z.object({
  file: z
    .any()
    .refine((files) => files?.length === 1, "File is required.")
    .refine((files) => files?.[0]?.size <= 5000000, `Max file size is 5MB.`)
    .refine(
      (files) => ["image/jpeg", "image/png"].includes(files?.[0]?.type),
      "Only .jpg and .png formats are supported.",
    ),
});

export const transactionSchema = z.object({
  transactions: z
    .array(
      z.object({
        date: z.string().min(1, "Date is required."),
        amount: z.coerce.number().min(1, "Amount must be greater than 0."),
      }),
    )
    .min(1, "At least one transaction is required."),
});

export const marketplaceSchema = z.object({
  tokopedia: z.coerce.number().optional(),
  shopee: z.coerce.number().optional(),
});

export const businessProfileSchema = z.object({
  businessAge: z.coerce.number().min(1, "Business age is required."),
  employees: z.coerce.number().min(0, "Number of employees is required."),
  location: z.string().min(2, "Location is required."),
});

export const scoringFormSchema = invoiceSchema
  .merge(transactionSchema)
  .merge(marketplaceSchema)
  .merge(businessProfileSchema);

export type ScoringFormValues = z.infer<typeof scoringFormSchema>;
