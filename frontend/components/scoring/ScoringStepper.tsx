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
  const steps = ["Invoice", "Transaksi", "Marketplace", "Profil Bisnis"];

  return (
    <div className="mt-8 relative mb-4">
      {/* Background track line */}
      <div className="absolute top-1/2 left-0 w-full h-[3px] -translate-y-1/2 bg-slate-800 rounded-full z-0 pointer-events-none" />
      
      {/* Active track line */}
      <div 
        className="absolute top-1/2 left-0 h-[3px] -translate-y-1/2 bg-gradient-to-r from-orange-500 to-rose-500 rounded-full z-0 transition-all duration-500 ease-out pointer-events-none" 
        style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
      />
      
      <ol className="relative z-10 flex items-center justify-between w-full">
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > stepNumber;
          const isCurrent = currentStep === stepNumber;

          return (
            <li
              key={stepNumber}
              className="flex flex-col items-center group"
            >
              <div
                className={`flex size-10 sm:size-12 items-center justify-center rounded-full border-2 transition-all duration-300 shadow-lg ${
                  isCompleted
                    ? "border-emerald-500 bg-emerald-500 text-white shadow-emerald-500/20"
                    : isCurrent
                      ? "border-orange-500 bg-slate-900 text-orange-400 shadow-orange-500/30 scale-110 ring-4 ring-orange-500/10"
                      : "border-slate-700 bg-slate-900 text-slate-500"
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5 sm:w-6 sm:h-6" /> : <span className="text-sm sm:text-base font-semibold">{stepNumber}</span>}
              </div>
              <span className={`absolute mt-14 sm:mt-16 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors duration-300 ${
                isCurrent ? 'text-orange-400' : isCompleted ? 'text-emerald-400' : 'text-slate-500'
              }`}>
                {label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default ScoringStepper;
