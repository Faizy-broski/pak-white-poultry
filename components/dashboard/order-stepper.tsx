"use client";

import { cn } from "@/lib/utils";

export const ORDER_STEPS = [
  { id: 1, title: "Select Your Eggs" },
  { id: 2, title: "Enter Delivery Details" },
  { id: 3, title: "Receive Next Day" },
  { id: 4, title: "Pay on Delivery" },
] as const;

export function OrderStepper({ currentStep }: { currentStep: number }) {
  return (
    <ol className="flex w-full items-start justify-between gap-2">
      {ORDER_STEPS.map((step, index) => {
        const isComplete = currentStep > step.id;
        const isActive = currentStep === step.id;

        return (
          <li key={step.id} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-2 text-center">
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition-colors",
                  isComplete && "border-primary bg-primary text-primary-foreground",
                  isActive && !isComplete && "border-primary text-primary",
                  !isActive && !isComplete && "border-border text-muted-foreground"
                )}
              >
                {isComplete ? "✓" : step.id}
              </span>
              <span
                className={cn(
                  "hidden max-w-[6.5rem] text-xs font-medium leading-tight sm:block",
                  isActive || isComplete ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {step.title}
              </span>
            </div>
            {index < ORDER_STEPS.length - 1 && (
              <span
                className={cn(
                  "mx-2 mt-[-1.25rem] h-px flex-1 sm:mt-[-1.9rem]",
                  isComplete ? "bg-primary" : "bg-border"
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}