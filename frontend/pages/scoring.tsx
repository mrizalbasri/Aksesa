import React, { useState } from "react";
import { useRouter } from "next/router";
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
  ArrowRight,
  CircleDot,
  Loader2,
  Check,
  ShieldCheck,
} from "lucide-react";
import {
  SESSION_SCORING_RESULT_KEY,
  submitScoring,
  uploadInvoiceForOcr,
} from "@/lib/api";

const stepLabels = ["Invoice", "Transaksi", "Marketplace", "Profil Bisnis"];

const stepHeadings: { title: string; description: string }[] = [
  {
    title: "Upload invoice atau nota",
    description:
      "Unggah dokumen penjualan sebagai dasar validasi data bisnis Anda.",
  },
  {
    title: "Riwayat transaksi harian",
    description: "Catat transaksi nyata agar pola arus kas bisa dianalisis.",
  },
  {
    title: "Penjualan marketplace",
    description:
      "Opsional — tambahkan angka dari Tokopedia atau Shopee jika relevan.",
  },
  {
    title: "Profil bisnis",
    description:
      "Lama usaha, lokasi, dan tenaga kerja membantu konteks risiko.",
  },
];

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
  const [submitError, setSubmitError] = useState<string | null>(null);
  const totalSteps = 4;
  const router = useRouter();

  const methods = useForm<ScoringFormValues>({
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

  const onSubmit = async (data: ScoringFormValues) => {
    setSubmitError(null);

    const fileList = data.file as FileList | undefined;
    const invoiceFile = fileList?.[0];
    if (!invoiceFile) {
      setSubmitError("File invoice tidak ditemukan. Coba upload ulang.");
      return;
    }

    try {
      await uploadInvoiceForOcr(invoiceFile);
      const scoringResult = await submitScoring({
        transactions: data.transactions.map((item) => ({
          date: item.date,
          amount: Number(item.amount),
        })),
        tokopedia: Number(data.tokopedia ?? 0),
        shopee: Number(data.shopee ?? 0),
        businessAge: Number(data.businessAge),
        employees: Number(data.employees),
        location: data.location,
      });

      if (typeof window !== "undefined") {
        const payload = {
          ...scoringResult,
          submitted_at: new Date().toISOString(),
          invoice_file_name: invoiceFile.name,
        };
        window.sessionStorage.setItem(
          SESSION_SCORING_RESULT_KEY,
          JSON.stringify(payload),
        );
      }

      await router.push("/result");
    } catch (error) {
      const fallbackMessage = "Gagal memproses scoring. Silakan coba lagi.";
      const message =
        error instanceof Error ? error.message : fallbackMessage;
      setSubmitError(message);
    }
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
            <Card className="rounded-xl border-[#dedbd6] bg-white shadow-sm">
              <CardHeader className="space-y-6 border-b border-[#dedbd6] px-4 pb-7 pt-7 sm:px-7">
                <div className="space-y-2">
                  <div className="inline-block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#7b7b78]">
                    Langkah {step} dari {totalSteps} — {stepLabels[step - 1]}
                  </div>
                  <CardTitle className="max-w-3xl text-[28px] font-medium leading-[1.08] tracking-[-0.8px] text-[#111111] sm:text-[38px] sm:tracking-[-1px] lg:text-[44px] lg:tracking-[-1.2px]">
                    {stepHeadings[step - 1]?.title ?? "Proses scoring"}
                  </CardTitle>
                  <CardDescription className="mt-2 max-w-2xl pt-1 text-base font-normal leading-relaxed text-[#626260]">
                    {stepHeadings[step - 1]?.description ??
                      "Lengkapi data bisnis Anda langkah demi langkah."}
                  </CardDescription>
                </div>
                <div className="flex items-start gap-2 rounded-lg border border-[#cde7c3] bg-[#f4fbf1] px-4 py-3 text-sm text-[#2c6415]">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden />
                  <p>
                    Data dipakai hanya untuk analisis skor dan tidak dibagikan
                    tanpa izin Anda.
                  </p>
                </div>
                <ScoringStepper currentStep={step} totalSteps={totalSteps} />
              </CardHeader>
              <CardContent className="pt-7 px-4 sm:px-7 pb-7">
                {submitCount > 0 && errorMessages.length > 0 ? (
                  <div
                    className="mb-8 rounded-lg border border-[#fe4c02] bg-[#fff4ee] p-5 text-sm text-[#fe4c02]"
                    role="alert"
                  >
                    <p className="text-[12px] font-semibold uppercase tracking-[0.06em]">
                      Mohon perbaiki data berikut:
                    </p>
                    <ul className="mt-3 list-disc space-y-1 pl-8 text-[#111111]">
                      {errorMessages.map((message) => (
                        <li key={message}>{message}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {submitError ? (
                  <div
                    className="mb-8 rounded-lg border border-[#fe4c02] bg-[#fff4ee] p-5 text-sm text-[#fe4c02]"
                    role="alert"
                  >
                    {submitError}
                  </div>
                ) : null}

                <div className="min-h-[240px]">{renderStep()}</div>

                <div className="mt-8 flex flex-col-reverse items-stretch justify-between gap-4 border-t border-[#dedbd6] pt-7 sm:flex-row sm:items-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={step === 1}
                    className="h-12 w-full rounded-md border-[#111111] bg-transparent px-6 text-base font-medium text-[#111111] transition-transform duration-300 hover:bg-[#fcfaf7] hover:scale-[1.02] active:scale-95 disabled:opacity-30 disabled:hover:scale-100 sm:w-auto"
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
            <Card className="hidden rounded-xl border-[#dedbd6] bg-white shadow-sm lg:block">
              <CardHeader className="px-6 pb-4 pt-6">
                <CardTitle className="flex items-end justify-between text-[11px] font-semibold uppercase tracking-[0.08em] text-[#111111]">
                  Progress
                  <span className="text-[28px] font-medium leading-none tracking-[-0.6px] text-[#ff5600]">
                    {completionPercent}%
                  </span>
                </CardTitle>
                <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-[#efeae3]">
                  <div
                    className="h-full bg-[#ff5600] transition-all duration-300"
                    style={{ width: `${completionPercent}%` }}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-2 px-4 pb-6">
                {stepLabels.map((label, index) => {
                  const stepNumber = index + 1;
                  const done = isStepComplete(stepNumber);
                  const active = stepNumber === step;
                  return (
                    <div
                      key={label}
                      className={`flex items-center justify-between rounded-[6px] border border-transparent px-3 py-2 ${
                        active
                          ? "border-[#dedbd6] bg-[#fcfaf7]"
                          : "bg-transparent"
                      }`}
                    >
                      <span
                        className={`text-[14px] font-medium ${active ? "text-[#ff5600]" : done ? "text-[#111111]" : "text-[#7b7b78]"}`}
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
            <details className="group rounded-xl border border-[#dedbd6] bg-white shadow-sm lg:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#111111] outline-none">
                <div className="flex items-center gap-3">
                  <div className="text-xl font-medium leading-none tracking-[-0.48px] text-[#ff5600]">
                    {completionPercent}%
                  </div>
                  <span>Progress</span>
                </div>
                <div className="text-[#7b7b78] transition-transform group-open:rotate-180">
                  ▼
                </div>
              </summary>
              <div className="space-y-2 border-t border-[#dedbd6] bg-[#fcfaf7] p-5">
                {stepLabels.map((label, index) => {
                  const stepNumber = index + 1;
                  const done = isStepComplete(stepNumber);
                  const active = stepNumber === step;
                  return (
                    <div
                      key={label}
                      className={`flex items-center justify-between rounded-[6px] px-3 py-2 ${
                        active ? "border border-[#dedbd6] bg-white" : ""
                      }`}
                    >
                      <span
                        className={`text-[14px] font-medium ${active ? "text-[#ff5600]" : done ? "text-[#111111]" : "text-[#7b7b78]"}`}
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
    <div className="relative min-h-screen bg-[#faf9f6] py-8 font-sans text-[#111111] selection:bg-[#ffd8c2] sm:py-12 lg:py-14">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-16 top-20 h-40 w-40 rounded-full bg-[#ff5600]/6 blur-3xl" />
        <div className="absolute right-0 top-32 h-48 w-48 rounded-full bg-[#2c6415]/6 blur-3xl" />
      </div>
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <ScoringPageContent />
      </div>
    </div>
  );
}
