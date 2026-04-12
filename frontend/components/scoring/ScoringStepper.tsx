import React from "react";

interface ScoringStepperProps {
  currentStep: number;
  totalSteps: number;
}

const ScoringStepper: React.FC<ScoringStepperProps> = ({
  currentStep,
  totalSteps,
}) => {
  const steps = ["Invoice", "Transaksi", "Marketplace", "Profil Bisnis"];

  return (
    <div className="mt-6">
      <ol className="flex items-center justify-between text-sm font-medium text-slate-400">
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > stepNumber;
          const isCurrent = currentStep === stepNumber;

          return (
            <li
              key={stepNumber}
              className={`flex flex-1 items-center ${
                index < totalSteps - 1 ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`flex items-center ${
                  isCurrent ? "text-blue-400" : ""
                }`}
              >
                <span
                  className={`flex size-8 items-center justify-center rounded-full border ${
                    isCompleted
                      ? "border-green-500 bg-green-500 text-white"
                      : isCurrent
                        ? "border-blue-400"
                        : "border-slate-600"
                  }`}
                >
                  {isCompleted ? "✓" : stepNumber}
                </span>
                <span className="ml-2 hidden sm:block">{label}</span>
              </div>
              {index < totalSteps - 1 && (
                <div
                  className={`h-0.5 w-full ${
                    isCompleted ? "bg-green-500" : "bg-slate-600"
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default ScoringStepper;
