"use client";

import * as React from "react";
import {
  Controller,
  type Control,
  type ControllerRenderProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FormFieldProps {
  label?: string;
  required?: boolean;
  supportText?: React.ReactNode;
  htmlFor?: string;
  caption?: React.ReactNode;
  captionIcon?: React.ReactNode;
  showCaptionIcon?: boolean;
  error?: boolean;
  className?: string;
  children: React.ReactNode;
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  (
    {
      label,
      required,
      supportText,
      htmlFor,
      caption,
      captionIcon,
      showCaptionIcon = false,
      error = false,
      className,
      children,
    },
    ref
  ) => {
    const showLabel = !!(label || supportText);
    const showCaption = !!caption;

    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-1.5 w-full", className)}
      >
        {showLabel && (
          <div className="flex items-center gap-2 pb-0.5">
            {label && (
              <div className="flex flex-1 items-center">
                <label
                  htmlFor={htmlFor}
                  className="text-[13px] leading-4 font-bold text-semantics-base-fg"
                >
                  {label}
                </label>
                {required && (
                  <span className="text-[13px] font-semibold text-semantics-error-bg text-center">
                    *
                  </span>
                )}
              </div>
            )}
            {supportText && (
              <div className="shrink-0 text-[13px] leading-4 font-medium text-semantics-base-fg-muted-2">
                {supportText}
              </div>
            )}
          </div>
        )}

        {children}

        {showCaption && (
          <div className="flex items-stretch gap-1.5 w-full min-w-0">
            {showCaptionIcon && (
              <span
                className={cn(
                  "shrink-0 flex items-start pt-0.5",
                  error
                    ? "text-semantics-error-fg-link"
                    : "text-semantics-base-fg-muted"
                )}
                aria-hidden
              >
                {captionIcon || <Info className="h-4 w-4" />}
              </span>
            )}
            <div
              className={cn(
                "min-w-0 flex-1 text-xs leading-5 font-medium",
                error
                  ? "text-semantics-error-fg-link"
                  : "text-semantics-base-fg-muted"
              )}
            >
              {caption}
            </div>
          </div>
        )}
      </div>
    );
  }
);
FormField.displayName = "FormField";

export interface FormFieldControllerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<FormFieldProps, "error" | "children"> {
  name: TName;
  control: Control<TFieldValues>;
  render: (field: ControllerRenderProps<TFieldValues, TName>) => React.ReactNode;
  defaultCaption?: React.ReactNode;
}

function FormFieldController<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  render,
  defaultCaption,
  caption,
  ...fieldProps
}: FormFieldControllerProps<TFieldValues, TName>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const hasError = !!fieldState.error;
        const errorMessage = fieldState.error?.message;

        return (
          <FormField
            {...fieldProps}
            error={hasError}
            caption={
              hasError && errorMessage ? errorMessage : (caption ?? defaultCaption)
            }
          >
            {render(field)}
          </FormField>
        );
      }}
    />
  );
}

export { FormField, FormFieldController };
