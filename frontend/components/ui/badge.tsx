import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border border-[#dedbd6] px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff5600]/20 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#111111] text-white hover:bg-[#111111]/80",
        secondary:
          "border-transparent bg-[#f3f1ec] text-[#111111] hover:bg-[#ece7df]",
        destructive:
          "border-transparent bg-[#c41c1c] text-white hover:bg-[#a71818]",
        outline: "text-[#111111]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
