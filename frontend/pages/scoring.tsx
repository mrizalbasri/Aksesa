import React, { useState } from "react";
import {
  useForm,
  FormProvider,
  useWatch,
  type FieldErrors,
  type Path,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { scoringFormSchema, ScoringFormValues } from "@/lib/validators";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import ScoringStepper from "@/components/scoring/ScoringStepper";
import InvoiceUpload from "@/components/scoring/InvoiceUpload";
import TransactionForm from "@/components/scoring/TransactionForm";
import MarketplaceForm from "@/components/scoring/MarketplaceForm";
import BusinessProfileForm from "@/components/scoring/BusinessProfileForm";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  CircleDot,
  Loader2,
  Check,
  ShieldCheck,
} from "lucide-react";

const stepLabels = ["Invoice", "Transaksi", "Marketplace", "Profil Bisnis"];

const stepFields: Record<number, Path<ScoringFormValues>[]> = {
  1: ["file"],
  2: ["transactions"],
  3: [],
  4: ["businessAge", "employees", "location"],
};

const flattenErrors = (errors: FieldErrors<ScoringFormValues>): string[] => {
  const messages: string[] = [];

  const walk = (value: unknown) => {
    if (!value || typeof value !== "object") {
      return;
    }
    if ("message" in value && typeof value.message === "string") {
      messages.push(value.message);
    }
    if (Array.isArray(value)) {
      for (const item of value) {
        walk(item);
      }
      return;
    }
    for (const key of Object.keys(value)) {
      const record = value as Record<string, unknown>;
      walk(record[key]);
    }
  };

  walk(errors);
  return Array.from(new Set(messages));
};

const ScoringPageContent = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const methods = useForm<ScoringFormValues>({
    resolver: zodResolver(scoringFormSchema) as any,
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

  const {
    handleSubmit,
    trigger,
    control,
    formState: { isSubmitting, errors, submitCount },
  } = methods;

  const values = useWatch({ control });

  const isStepComplete = (stepNumber: number): boolean => {
    if (stepNumber === 1) {
      const fileValue = values.file as FileList | undefined;
      return Boolean(fileValue?.length === 1);
    }
    if (stepNumber === 2) {
      const transactions = values.transactions ?? [];
      return (
        transactions.length > 0 &&
        transactions.every((item) => item.date && Number(item.amount) > 0)
      );
    }
    if (stepNumber === 3) {
      return true;
    }
    return (
      Number(values.businessAge) > 0 &&
      Number(values.employees) >= 0 &&
      Boolean(values.location?.trim().length)
    );
  };

  const completionCount = [1, 2, 3, 4].filter(isStepComplete).length;
  const completionPercent = Math.round((completionCount / totalSteps) * 100);
  const currentStepValid = isStepComplete(step);
  const errorMessages = flattenErrors(errors).slice(0, 3);

  const nextStep = async () => {
    const fields = stepFields[step];
    const isValid =
      fields.length === 0 ? true : await trigger(fields, { shouldFocus: true });
    if (!isValid) {
      return;
    }
    setStep((prev) => Math.min(prev + 1, totalSteps));
  };
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const onSubmit = (data: ScoringFormValues) => {
    console.log(data);
    // Mock API call
    return new Promise((resolve) => setTimeout(resolve, 2000));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <InvoiceUpload />;
      case 2:
        return <TransactionForm />;
      case 3:
        return <MarketplaceForm />;
      case 4:
        return <BusinessProfileForm />;
      default:
        return <InvoiceUpload />;
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 relative z-10 w-full font-sans"
      >
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] max-w-5xl mx-auto">
          {/* Main Form Content */}
          <div className="order-2 lg:order-1 flex flex-col gap-6">
            <Card className="border-[#ddd7cf] bg-[#ffffff] rounded-xl shadow-sm dark:!border-[#ddd7cf] dark:!bg-[#ffffff] dark:!text-[#1f1d1a]">
              <CardHeader className="space-y-6 border-b border-[#e2ddd6] pb-7 pt-7 px-4 sm:px-7 dark:!border-[#e2ddd6]">
                <div className="space-y-2">
                  <div className="inline-block text-[#6a655e] font-semibold text-[11px] uppercase tracking-[0.08em]">
                    Langkah {step} dari {totalSteps}
                  </div>
                  <CardTitle className="text-[28px] font-medium text-[#1f1d1a] leading-[1.03] tracking-[-0.8px] sm:text-[42px] sm:tracking-[-1.2px] lg:text-[48px] lg:tracking-[-1.4px] dark:!text-[#1f1d1a]">
                    Mulai proses scoring.
                  </CardTitle>
                  <CardDescription className="text-[#5f5b54] text-[16px] font-normal leading-relaxed mt-2 pt-1 max-w-2xl dark:!text-[#5f5b54]">
                    Lengkapi data bisnis Anda langkah demi langkah.
                  </CardDescription>
                </div>
                <div className="flex items-start gap-2 rounded-lg border border-[#cde7c3] bg-[#f4fbf1] px-4 py-3 text-sm text-[#2c6415]">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0" />
                  <p>
                    Data dipakai hanya untuk analisis skor dan tidak dibagikan
                    tanpa izin Anda.
                  </p>
                </div>
                <ScoringStepper currentStep={step} totalSteps={totalSteps} />
              </CardHeader>
              <CardContent className="pt-7 px-4 sm:px-7 pb-7">
                {submitCount > 0 && errorMessages.length > 0 ? (
                  <div className="mb-8 border border-[#fe4c02] bg-[#fff4ee] p-5 text-sm text-[#fe4c02] rounded-lg">
                    <p className="font-semibold uppercase tracking-[0.6px] text-[12px]">
                      Mohon perbaiki data berikut:
                    </p>
                    <ul className="mt-3 list-disc pl-8 space-y-1 text-[#1f1d1a]">
                      {errorMessages.map((message) => (
                        <li key={message}>{message}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <div className="min-h-[240px]">{renderStep()}</div>

                <div className="mt-8 flex flex-col-reverse items-stretch justify-between gap-4 border-t border-[#e2ddd6] pt-7 sm:flex-row sm:items-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={step === 1}
                    className="w-full sm:w-auto h-12 px-6 rounded-md border-[#2a2825] bg-transparent text-[#2a2825] hover:scale-[1.02] active:scale-95 hover:bg-[#faf7f2] transition-transform duration-300 disabled:opacity-30 disabled:hover:scale-100 font-medium text-[16px]"
                  >
                    Kembali
                  </Button>

                  {step < totalSteps ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={!currentStepValid}
                      className="w-full sm:w-auto h-12 px-6 rounded-md bg-[#ff5600] text-white hover:bg-[#e14b00] hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 font-medium text-[16px]"
                    >
                      Lanjut
                      <ArrowRight className="ml-2 size-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting || !currentStepValid}
                      className="w-full sm:w-auto h-12 px-6 rounded-md bg-[#2c6415] text-white border border-[#2c6415] hover:bg-[#245111] hover:border-[#245111] hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 font-medium text-[16px]"
                    >
                      {isSubmitting ? (
                        <Loader2 className="mr-2 size-4 animate-spin" />
                      ) : null}
                      Submit Penilaian
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <aside className="order-1 lg:order-2 space-y-6 lg:sticky lg:top-24 lg:h-fit">
            <Card className="hidden lg:block border-[#ddd7cf] bg-[#ffffff] rounded-xl shadow-sm dark:!border-[#ddd7cf] dark:!bg-[#ffffff] dark:!text-[#1f1d1a]">
              <CardHeader className="pb-4 px-6 pt-6">
                <CardTitle className="text-[11px] font-semibold text-[#2a2825] flex justify-between items-end uppercase tracking-[0.08em]">
                  Progress
                  <span className="text-[28px] font-medium text-[#ff5600] tracking-[-0.6px] leading-none">
                    {completionPercent}%
                  </span>
                </CardTitle>
                <div className="h-1.5 w-full bg-[#e5dfd8] mt-4 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#ff5600] transition-all duration-300"
                    style={{ width: `${completionPercent}%` }}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-2 pb-6 px-4">
                {stepLabels.map((label, index) => {
                  const stepNumber = index + 1;
                  const done = isStepComplete(stepNumber);
                  const active = stepNumber === step;
                  return (
                    <div
                      key={label}
                      className={`flex items-center justify-between px-3 py-2 rounded-[6px] border border-transparent ${
                        active
                          ? "bg-[#faf7f2] border-[#ddd7cf]"
                          : "bg-transparent"
                      }`}
                    >
                      <span
                        className={`text-[14px] font-medium ${active ? "text-[#ff5600]" : done ? "text-[#2a2825]" : "text-[#6a655e]"}`}
                      >
                        {label}
                      </span>
                      {done ? (
                        <Check className="size-4 text-[#2c6415]" />
                      ) : active ? (
                        <CircleDot className="size-4 text-[#ff5600]" />
                      ) : null}
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Mobile Progress */}
            <details className="lg:hidden group rounded-xl border border-[#ddd7cf] bg-[#ffffff] shadow-sm dark:!border-[#ddd7cf] dark:!bg-[#ffffff] dark:!text-[#1f1d1a]">
              <summary className="cursor-pointer px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#2a2825] flex justify-between items-center outline-none list-none">
                <div className="flex items-center gap-3">
                  <div className="text-[#ff5600] font-medium tracking-[-0.48px] leading-none text-xl">
                    {completionPercent}%
                  </div>
                  <span>Progress</span>
                </div>
                <div className="text-[#6a655e] group-open:rotate-180 transition-transform">
                  ▼
                </div>
              </summary>
              <div className="space-y-2 border-t border-[#e2ddd6] p-5 bg-[#faf7f2]">
                {stepLabels.map((label, index) => {
                  const stepNumber = index + 1;
                  const done = isStepComplete(stepNumber);
                  const active = stepNumber === step;
                  return (
                    <div
                      key={label}
                      className={`flex items-center justify-between px-3 py-2 rounded-[6px] ${
                        active ? "bg-[#ffffff] border border-[#ddd7cf]" : ""
                      }`}
                    >
                      <span
                        className={`text-[14px] font-medium ${active ? "text-[#ff5600]" : done ? "text-[#2a2825]" : "text-[#6a655e]"}`}
                      >
                        {label}
                      </span>
                      {done ? (
                        <Check className="size-4 text-[#2c6415]" />
                      ) : active ? (
                        <CircleDot className="size-4 text-[#ff5600]" />
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </details>
          </aside>
        </div>
      </form>
    </FormProvider>
  );
};

export default function ScoringPage() {
  return (
    <div className="min-h-screen bg-[#f7f3ec] py-6 text-[#1f1d1a] font-sans lg:py-14 dark:!bg-[#f7f3ec] dark:!text-[#1f1d1a]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
        <ScoringPageContent />
      </div>
    </div>
  );
}
