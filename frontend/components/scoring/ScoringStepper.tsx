import React from "react";
import { Check } from "lucide-react";

interface ScoringStepperProps {
  currentStep: number;
  totalSteps: number;
}

const ScoringStepper: React.FC<ScoringStepperProps> = ({
  currentStep,
  totalSteps,
}) => {
  const steps = [
    { full: "Invoice", short: "Inv" },
    { full: "Transaksi", short: "Trans" },
    { full: "Marketplace", short: "Market" },
    { full: "Profil Bisnis", short: "Profil" },
  ];

  return (
    <div className="mt-8 relative mb-2 px-1">
      <div className="pointer-events-none absolute left-0 top-3.5 z-0 h-[2px] w-full rounded-full bg-[#efeae3] sm:top-4" />

      <div
        className="pointer-events-none absolute left-0 top-3.5 z-0 h-[2px] rounded-full bg-[#ff5600] transition-all duration-300 sm:top-4"
        style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
      />

      <ol className="relative z-10 flex items-start justify-between w-full">
        {steps.map((item, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > stepNumber;
          const isCurrent = currentStep === stepNumber;

          return (
            <li
              key={stepNumber}
              className="flex min-w-0 flex-1 flex-col items-center gap-2 sm:gap-3"
            >
              <div
                className={`flex size-7 items-center justify-center rounded-md border transition-all duration-300 shadow-sm sm:size-8 ${
                  isCompleted
                    ? "border-[#ff5600] bg-[#ff5600] text-white"
                    : isCurrent
                      ? "border-[#ff5600] bg-[#fff7f1] text-[#ff5600]"
                      : "border-[#dedbd6] bg-[#fffdf9] text-[#7b7b78]"
                }`}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <span className="text-[12px] font-medium sm:text-[14px]">
                    {stepNumber}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] font-semibold tracking-[0.06em] uppercase text-center leading-tight transition-colors duration-300 sm:text-[12px] sm:tracking-[0.08em] ${
                  isCurrent
                    ? "text-[#ff5600]"
                    : isCompleted
                      ? "text-[#111111]"
                      : "text-[#7b7b78]"
                }`}
              >
                <span className="sm:hidden">{item.short}</span>
                <span className="hidden sm:inline">{item.full}</span>
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default ScoringStepper;
