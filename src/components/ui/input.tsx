"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type InputSize = "m" | "l";

const sizeConfig: Record<InputSize, { container: string; text: string }> = {
  m: {
    container: "min-h-[32px] px-2 py-1.5 gap-1.5",
    text: "text-sm leading-5",
  },
  l: {
    container: "min-h-[40px] px-2 py-2.5 gap-1.5",
    text: "text-sm leading-5",
  },
};

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: InputSize;
  error?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
  containerClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = "l",
      error = false,
      leftIcon,
      rightIcon,
      rightElement,
      containerClassName,
      className,
      disabled,
      readOnly,
      ...props
    },
    ref
  ) => {
    const config = sizeConfig[size];

    return (
      <div
        className={cn(
          "flex w-full items-center overflow-hidden rounded-[6px] border transition-colors",
          "bg-semantics-base-bg-default border-semantics-base-border-1",
          error &&
            !disabled &&
            !readOnly && [
              "border-semantics-error-border-2 bg-semantics-error-bg-glow",
              "hover:bg-background",
              "focus-within:border-semantics-error-border-3 focus-within:bg-semantics-base-bg-default focus-within:ring-2 focus-within:ring-semantics-error-bg-glow-hover",
              "focus-within:hover:bg-semantics-base-bg-default focus-within:hover:border-semantics-error-border-3",
            ],
          !error &&
            !disabled &&
            !readOnly && [
              "hover:border-semantics-base-border-3",
              "focus-within:border-semantics-brand-border-3 focus-within:ring-2 focus-within:ring-semantics-brand-bg-glow-hover",
              "focus-within:hover:border-semantics-brand-border-3",
            ],
          disabled &&
            "border-semantics-base-border-0 bg-semantics-base-bg-hover cursor-not-allowed opacity-50",
          readOnly &&
            !disabled &&
            "border-semantics-base-border-1 bg-semantics-base-bg-hover",
          containerClassName
        )}
      >
        <div
          className={cn("flex flex-1 items-center overflow-hidden", config.container)}
        >
          {leftIcon && (
            <span className="shrink-0 text-semantics-base-fg-muted-2 flex items-center">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            disabled={disabled}
            readOnly={readOnly}
            className={cn(
              "w-full min-w-0 flex-1 bg-transparent outline-none",
              "font-medium",
              config.text,
              "text-semantics-base-fg placeholder:text-semantics-base-fg-muted-3",
              disabled && "cursor-not-allowed",
              readOnly && "cursor-default",
              "file:border-0 file:bg-transparent file:text-sm file:font-medium",
              "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
              className
            )}
            {...props}
          />

          {rightIcon && (
            <span className="shrink-0 text-semantics-base-fg-muted-2 flex items-center">
              {rightIcon}
            </span>
          )}
        </div>

        {rightElement && (
          <div className="shrink-0 flex items-center">{rightElement}</div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
