import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { scoringFormSchema, ScoringFormValues } from "@/lib/validators";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ScoringStepper from "@/components/scoring/ScoringStepper";
import InvoiceUpload from "@/components/scoring/InvoiceUpload";
import TransactionForm from "@/components/scoring/TransactionForm";
import MarketplaceForm from "@/components/scoring/MarketplaceForm";
import BusinessProfileForm from "@/components/scoring/BusinessProfileForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { ScoringFormProvider } from "@/components/scoring/ScoringFormProvider";

const ScoringPageContent = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

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
    formState: { isSubmitting },
  } = methods;

  const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps));
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="border-slate-800 bg-slate-900/70 shadow-lg shadow-black/10">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold text-white">
              Mulai Proses Scoring
            </CardTitle>
            <ScoringStepper currentStep={step} totalSteps={totalSteps} />
          </CardHeader>
          <CardContent>
            {renderStep()}
            <div className="mt-8 flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={step === 1}
                className="border-slate-500 bg-transparent text-slate-100 hover:bg-slate-800 hover:text-white"
              >
                <ArrowLeft className="mr-2 size-4" />
                Kembali
              </Button>
              {step < totalSteps ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  Lanjut
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-green-600 text-white hover:bg-green-700"
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
      </form>
    </FormProvider>
  );
};

const ScoringPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 py-12 text-slate-50">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <ScoringPageContent />
      </div>
    </div>
  );
};

export default ScoringPage;
