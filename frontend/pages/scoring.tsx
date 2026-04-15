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
  CircleCheck,
  CircleDot,
  Circle,
  Loader2,
  Sparkles,
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10 w-full">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px] max-w-6xl mx-auto">
          {/* Main Form Content */}
          <div className="order-2 lg:order-1 flex flex-col gap-6">
            <Card className="border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden relative">
              {/* Fancy Glow effect */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-rose-500 to-purple-600"></div>
              <CardHeader className="space-y-6 border-b border-white/5 pb-8 pt-8">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium mb-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Langkah {step} dari {totalSteps}</span>
                  </div>
                  <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-400">
                    Mulai Proses Scoring
                  </CardTitle>
                  <CardDescription className="text-slate-400 text-base">
                    Lengkapi data bisnis Anda langkah demi langkah untuk mendapatkan penilaian terbaik.
                  </CardDescription>
                </div>
                <ScoringStepper currentStep={step} totalSteps={totalSteps} />
              </CardHeader>
              <CardContent className="pt-8 px-8 pb-8">
                {submitCount > 0 && errorMessages.length > 0 ? (
                  <div className="mb-8 rounded-xl border border-rose-500/30 bg-rose-500/10 p-5 text-sm text-rose-200 shadow-inner">
                    <p className="font-semibold flex items-center gap-2">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-rose-500 text-white text-xs">!</span>
                      Mohon perbaiki data berikut:
                    </p>
                    <ul className="mt-3 list-disc pl-8 space-y-1 text-rose-300">
                      {errorMessages.map((message) => (
                        <li key={message}>{message}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <div className="min-h-[280px]">
                  {renderStep()}
                </div>

                <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-8">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={step === 1}
                    className="h-12 px-6 rounded-xl border-slate-700 bg-slate-800/50 text-slate-200 hover:bg-slate-700 hover:text-white hover:border-slate-600 transition-all focus:ring-2 focus:ring-slate-500 disabled:opacity-30"
                  >
                    <ArrowLeft className="mr-2 size-4" />
                    Kembali
                  </Button>

                  {step < totalSteps ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={!currentStepValid}
                      className="h-12 px-8 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 text-white font-medium hover:from-orange-400 hover:to-rose-400 shadow-lg shadow-orange-500/25 transition-all focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:shadow-none"
                    >
                      Lanjut
                      <ArrowRight className="ml-2 size-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting || !currentStepValid}
                      className="h-12 px-8 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium hover:from-emerald-400 hover:to-teal-400 shadow-lg shadow-emerald-500/25 transition-all focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:shadow-none"
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
            {/* Fancy Progress Card */}
            <Card className="hidden lg:block border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-xl rounded-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
              <CardHeader className="pb-4 relative z-10">
                <CardTitle className="text-lg font-semibold text-slate-100 flex justify-between items-end">
                  Ringkasan Progress
                  <span className="text-2xl font-bold text-orange-400">{completionPercent}%</span>
                </CardTitle>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800 mt-4">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-orange-500 to-rose-500 transition-all duration-700 ease-out"
                    style={{ width: `${completionPercent}%` }}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-3 relative z-10 pb-6">
                {stepLabels.map((label, index) => {
                  const stepNumber = index + 1;
                  const done = isStepComplete(stepNumber);
                  const active = stepNumber === step;
                  return (
                    <div
                      key={label}
                      className={`flex items-center justify-between rounded-xl px-4 py-3 transition-all duration-300 ${
                        active 
                          ? 'bg-slate-800/80 border-l-2 border-orange-500 shadow-sm' 
                          : 'bg-slate-800/30 border border-transparent hover:bg-slate-800/50'
                      }`}
                    >
                      <span className={`text-sm font-medium ${active ? 'text-slate-100' : 'text-slate-400'}`}>
                        {label}
                      </span>
                      {done ? (
                        <CircleCheck className="size-5 text-emerald-400" />
                      ) : active ? (
                        <CircleDot className="size-5 text-orange-400" />
                      ) : (
                        <Circle className="size-5 text-slate-600" />
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Mobile Progress */}
            <details className="lg:hidden group rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-xl overflow-hidden">
              <summary className="cursor-pointer px-5 py-4 text-sm font-medium text-slate-200 flex justify-between items-center outline-none list-none">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-xs ring-1 ring-orange-500/30">
                    {completionPercent}%
                  </div>
                  <span>Lihat Progress</span>
                </div>
                <div className="text-slate-400 group-open:rotate-180 transition-transform">
                  ▼
                </div>
              </summary>
              <div className="space-y-2 border-t border-white/10 p-5 bg-slate-900/50">
                {stepLabels.map((label, index) => {
                  const stepNumber = index + 1;
                  const done = isStepComplete(stepNumber);
                  const active = stepNumber === step;
                  return (
                    <div
                      key={label}
                      className="flex items-center justify-between rounded-lg px-3 py-2"
                    >
                      <span className={`text-sm ${active ? 'text-slate-200 font-medium' : 'text-slate-400'}`}>{label}</span>
                      {done ? (
                        <CircleCheck className="size-4 text-emerald-400" />
                      ) : active ? (
                        <CircleDot className="size-4 text-orange-400" />
                      ) : (
                        <Circle className="size-4 text-slate-600" />
                      )}
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

const ScoringPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 py-12 lg:py-20 text-slate-200 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-orange-600/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <ScoringPageContent />
      </div>
    </div>
  );
};

export default ScoringPage;
