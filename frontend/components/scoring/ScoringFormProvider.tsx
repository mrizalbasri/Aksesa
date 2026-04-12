"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { createContext, useContext, type ReactNode } from "react";
import {
  useForm,
  type FieldErrors,
  type UseFormReturn,
  type UseFormProps,
  FormProvider,
} from "react-hook-form";
import { type z } from "zod";

import { scoringFormSchema, type ScoringFormValues } from "@/lib/validators";

// 1. Create a FormProvider
// -----------------------------------------------------------------------------
interface ScoringFormContextValue extends UseFormReturn<ScoringFormValues> {
  errors: FieldErrors<ScoringFormValues>;
}

const ScoringFormContext = createContext<ScoringFormContextValue | null>(null);

export function ScoringFormProvider({ children }: { children: ReactNode }) {
  const form = useForm<ScoringFormValues>({
    resolver: zodResolver(scoringFormSchema),
    defaultValues: {
      file: undefined,
      transactions: [{ date: "", amount: 0 }],
      tokopedia: 0,
      shopee: 0,
      businessAge: 0,
      employees: 0,
      location: "",
    },
  });

  return (
    <FormProvider {...form}>
      <ScoringFormContext.Provider
        value={{ ...form, errors: form.formState.errors }}
      >
        {children}
      </ScoringFormContext.Provider>
    </FormProvider>
  );
}

// 2. Create a hook to use the form context
// -----------------------------------------------------------------------------
export function useScoringForm() {
  const context = useContext(ScoringFormContext);
  if (!context) {
    throw new Error("useScoringForm must be used within a ScoringFormProvider");
  }
  return context;
}
