"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export type CheckboxSize = "s" | "m" | "l";

const sizeConfig: Record<
  CheckboxSize,
  { box: string; icon: string; radius: string; stroke: number }
> = {
  s: {
    box: "h-4 w-4",
    icon: "h-3.5 w-3.5",
    radius: "rounded-[4px]",
    stroke: 2.5,
  },
  m: {
    box: "h-5 w-5",
    icon: "h-4 w-4",
    radius: "rounded-[6px]",
    stroke: 2.75,
  },
  l: {
    box: "h-6 w-6",
    icon: "h-5 w-5",
    radius: "rounded-[6px]",
    stroke: 3,
  },
};

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  size?: CheckboxSize;
  className?: string;
  indicatorClassName?: string;
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(
  (
    {
      size = "m",
      className,
      indicatorClassName,
      ...props
    },
    ref
  ) => {
    const config = sizeConfig[size];

    return (
      <CheckboxPrimitive.Root
        ref={ref}
        className={cn(
          "group peer shrink-0 border border-[1.5px] transition-colors",
          config.radius,
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-semantics-base-bg-invert-hover focus-visible:ring-offset-0 focus-visible:ring-offset-semantics-base-bg-default",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "bg-transparent border-semantics-base-border-1 enabled:hover:border-semantics-base-border-3",
          "data-[state=checked]:bg-semantics-brand-bg data-[state=checked]:border-semantics-brand-bg data-[state=checked]:text-semantics-base-fg-invert-white data-[state=checked]:enabled:hover:bg-semantics-brand-bg-hover data-[state=checked]:enabled:hover:border-semantics-brand-bg-hover data-[state=checked]:enabled:active:bg-semantics-brand-bg-active data-[state=checked]:enabled:active:border-semantics-brand-bg-active",
          "data-[state=indeterminate]:bg-semantics-brand-bg data-[state=indeterminate]:border-semantics-brand-bg data-[state=indeterminate]:text-semantics-base-fg-invert-white data-[state=indeterminate]:enabled:hover:bg-semantics-brand-bg-hover data-[state=indeterminate]:enabled:hover:border-semantics-brand-bg-hover data-[state=indeterminate]:enabled:active:bg-semantics-brand-bg-active data-[state=indeterminate]:enabled:active:border-semantics-brand-bg-active",
          config.box,
          className
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator
          className={cn(
            "flex items-center justify-center text-current",
            indicatorClassName
          )}
        >
          <Check
            className={cn(
              "hidden shrink-0 group-data-[state=checked]:block",
              config.icon
            )}
            strokeWidth={config.stroke}
          />
          <Minus
            className={cn(
              "hidden shrink-0 group-data-[state=indeterminate]:block",
              config.icon
            )}
            strokeWidth={config.stroke}
          />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
