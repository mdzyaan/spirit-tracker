"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonVariant = "solid" | "outline" | "ghost" | "link";
type ButtonStyle = "primary" | "black" | "gray" | "destructive" | "warning";
type ButtonSize = "m" | "l" | "icon-m" | "icon-l";

interface ButtonStyleConfig {
  base: string;
  hover?: string;
  active?: string;
  disabled?: string;
}

type ButtonStylesMap = Record<ButtonVariant, Record<ButtonStyle, ButtonStyleConfig>>;

interface BaseButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type" | "className" | "style"> {
  variant?: ButtonVariant;
  styleVariant?: ButtonStyle;
  isLoading?: boolean;
  width?: "fit" | "full";
  shape?: "default" | "pill";
  noWrap?: boolean;
  linkPadding?: boolean;
  iconLeft?: React.ReactElement;
  iconRight?: React.ReactElement;
  asChild?: boolean;
  type?: "button" | "submit" | "reset";
}

interface IconOnlyButtonProps extends BaseButtonProps {
  isIconOnly: true;
  size?: "icon-m" | "icon-l";
}

interface RegularButtonProps extends BaseButtonProps {
  isIconOnly?: false;
  size?: ButtonSize;
}

export type ButtonProps = IconOnlyButtonProps | RegularButtonProps;

const buttonStyles: ButtonStylesMap = {
  solid: {
    primary: {
      base: "bg-semantics-brand-bg text-semantics-base-fg-invert-white",
      hover: "hover:bg-semantics-brand-bg-hover",
      active: "active:bg-semantics-brand-bg-active",
      disabled: "opacity-50",
    },
    black: {
      base: "bg-semantics-base-bg-invert text-semantics-base-bg",
      hover: "hover:bg-semantics-base-bg-invert-hover",
      active: "active:bg-semantics-base-bg-invert",
      disabled: "opacity-50",
    },
    gray: {
      base: "bg-semantics-base-bg-invert text-semantics-base-bg",
      hover: "hover:bg-semantics-base-bg-invert-hover",
      active: "active:bg-semantics-base-bg-invert-active",
      disabled: "opacity-50",
    },
    destructive: {
      base: "bg-semantics-error-bg text-semantics-base-fg-invert-white",
      hover: "hover:bg-semantics-error-bg-hover",
      active: "active:bg-semantics-error-bg-active",
      disabled: "opacity-50",
    },
    warning: {
      base: "bg-semantics-warning-bg text-semantics-base-fg-invert-white",
      hover: "hover:bg-semantics-warning-bg-hover",
      active: "active:bg-semantics-warning-bg-active",
      disabled: "opacity-50",
    },
  },
  outline: {
    primary: {
      base: "border border-semantics-brand-border-2 text-semantics-brand-fg-link bg-transparent",
      hover: "hover:bg-semantics-brand-bg-glow",
      active: "active:bg-semantics-brand-bg-glow",
      disabled: "opacity-50",
    },
    black: {
      base: "border border-semantics-base-border-1 text-semantics-base-fg bg-transparent",
      hover: "hover:border-semantics-base-border-1 hover:bg-semantics-base-bg-hover",
      active: "active:border-semantics-base-border-1 active:bg-semantics-base-bg-hover",
      disabled: "opacity-50",
    },
    gray: {
      base: "border border-semantics-base-border-1 text-semantics-base-fg-muted bg-transparent",
      hover: "hover:bg-semantics-base-bg-hover",
      active: "active:bg-semantics-base-bg-hover",
      disabled: "opacity-50",
    },
    destructive: {
      base: "border border-semantics-error-border-2 text-semantics-error-fg-link bg-transparent",
      hover: "hover:bg-semantics-error-bg-glow",
      active: "active:bg-semantics-error-bg-glow",
      disabled: "opacity-50",
    },
    warning: {
      base: "border border-semantics-warning-border-2 text-semantics-warning-fg-link bg-transparent",
      hover: "hover:bg-semantics-warning-bg-glow",
      active: "active:bg-semantics-warning-bg-glow",
      disabled: "opacity-50",
    },
  },
  ghost: {
    primary: {
      base: "bg-transparent text-semantics-brand-fg-link",
      hover: "hover:bg-semantics-brand-bg-glow",
      active: "active:bg-semantics-brand-bg-glow",
      disabled: "opacity-50",
    },
    black: {
      base: "bg-transparent text-semantics-base-fg",
      hover: "hover:bg-semantics-base-bg-hover",
      active: "active:bg-semantics-base-bg-hover",
      disabled: "opacity-50",
    },
    gray: {
      base: "bg-transparent text-semantics-base-fg-muted",
      hover: "hover:bg-semantics-base-bg-hover hover:text-semantics-base-fg",
      active: "active:bg-semantics-base-bg-hover",
      disabled: "opacity-50",
    },
    destructive: {
      base: "bg-transparent text-semantics-error-fg-link",
      hover: "hover:bg-semantics-error-bg-glow",
      active: "active:bg-semantics-error-bg-glow",
      disabled: "opacity-50",
    },
    warning: {
      base: "bg-transparent text-semantics-warning-fg-link",
      hover: "hover:bg-semantics-warning-bg-glow",
      active: "active:bg-semantics-warning-bg-glow",
      disabled: "opacity-50",
    },
  },
  link: {
    primary: {
      base: "bg-transparent text-semantics-brand-fg-link",
      hover: "hover:underline",
      active: "active:underline",
      disabled: "opacity-50",
    },
    black: {
      base: "bg-transparent text-semantics-base-fg",
      hover: "hover:underline",
      active: "active:underline",
      disabled: "opacity-50",
    },
    gray: {
      base: "bg-transparent text-semantics-base-fg-muted",
      hover: "hover:underline hover:text-semantics-base-fg",
      active: "active:underline",
      disabled: "opacity-50",
    },
    destructive: {
      base: "bg-transparent text-semantics-error-fg-link",
      hover: "hover:underline",
      active: "active:underline",
      disabled: "opacity-50",
    },
    warning: {
      base: "bg-transparent text-semantics-warning-fg-link",
      hover: "hover:underline",
      active: "active:underline",
      disabled: "opacity-50",
    },
  },
};

function getButtonClasses(
  variant: ButtonVariant,
  styleVariant: ButtonStyle,
  size: ButtonSize,
  isLoading: boolean,
  disabled: boolean,
  hasChildren: boolean,
  shape: "default" | "pill" = "default",
  noWrap: boolean = true,
  width: "fit" | "full" = "fit",
  linkPadding: boolean = false
) {
  const roundedClass = shape === "pill" ? "rounded-full" : "rounded-md";
  const baseClasses = cn(
    "inline-flex items-center justify-center transition-colors transition-transform duration-150 focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none font-semibold focus-visible:ring-semantics-base-bg-invert-hover",
    roundedClass,
    noWrap && hasChildren && "whitespace-nowrap",
    width === "full" ? "w-full" : "w-fit"
  );

  const useLinkNoPadding = variant === "link" && !linkPadding;
  const sizeClasses = useLinkNoPadding
    ? hasChildren
      ? "min-h-0 p-0 gap-2"
      : "h-8 w-8 p-0"
    : {
        m: hasChildren ? "h-8 py-1.5 px-3 gap-2" : "h-8 w-8 p-2",
        l: hasChildren ? "h-10 py-3 px-4 gap-2" : "h-10 w-10 p-3",
        "icon-m": "h-8 w-8 p-2",
        "icon-l": "h-10 w-10 p-3",
      };
  const resolvedSizeClasses =
    typeof sizeClasses === "string" ? sizeClasses : sizeClasses[size];

  const styleConfig = buttonStyles[variant][styleVariant];
  const typeStyleClasses = cn(
    styleConfig.base,
    !disabled && !isLoading && styleConfig.hover,
    !disabled && !isLoading && styleConfig.active,
    (disabled || isLoading) && styleConfig.disabled
  );

  return cn(
    baseClasses,
    resolvedSizeClasses,
    "text-sm leading-5",
    typeStyleClasses,
    !disabled && !isLoading && "active:scale-95"
  );
}

type LegacyVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
type LegacySize = "default" | "sm" | "lg" | "icon";

export interface ButtonPropsWithCompat extends Omit<ButtonProps, "variant" | "styleVariant" | "size"> {
  variant?: ButtonVariant | LegacyVariant;
  styleVariant?: ButtonStyle;
  size?: ButtonSize | LegacySize;
  className?: string;
}

function mapLegacyVariant(v: LegacyVariant): { variant: ButtonVariant; styleVariant: ButtonStyle } {
  switch (v) {
    case "default":
      return { variant: "solid", styleVariant: "primary" };
    case "destructive":
      return { variant: "solid", styleVariant: "destructive" };
    case "secondary":
      return { variant: "solid", styleVariant: "gray" };
    case "outline":
      return { variant: "outline", styleVariant: "black" };
    case "ghost":
      return { variant: "ghost", styleVariant: "black" };
    case "link":
      return { variant: "link", styleVariant: "primary" };
    default:
      return { variant: "solid", styleVariant: "primary" };
  }
}

function mapLegacySize(s: LegacySize, isIconOnly: boolean): ButtonSize {
  switch (s) {
    case "sm":
      return isIconOnly ? "icon-m" : "m";
    case "lg":
      return isIconOnly ? "icon-l" : "l";
    case "icon":
      return "icon-m";
    case "default":
    default:
      return isIconOnly ? "icon-m" : "m";
  }
}

const Button = React.forwardRef<HTMLButtonElement, ButtonPropsWithCompat>(
  (props, ref) => {
    const {
      variant: variantProp = "default",
      styleVariant: styleVariantProp,
      size: sizeProp,
      isLoading = false,
      width = "fit",
      shape = "default",
      noWrap = true,
      linkPadding = false,
      iconLeft,
      iconRight,
      children,
      disabled,
      type = "button",
      className,
      ...htmlProps
    } = props;

    const legacyVariants: LegacyVariant[] = [
      "default",
      "destructive",
      "outline",
      "secondary",
      "ghost",
      "link",
    ];
    const legacySizes: LegacySize[] = ["default", "sm", "lg", "icon"];
    const isLegacyVariant = legacyVariants.includes(variantProp as LegacyVariant);
    const isLegacySize = legacySizes.includes((sizeProp ?? "default") as LegacySize);

    const { variant, styleVariant } = isLegacyVariant
      ? mapLegacyVariant(variantProp as LegacyVariant)
      : {
          variant: (variantProp as ButtonVariant) || "solid",
          styleVariant: (styleVariantProp as ButtonStyle) || "primary",
        };

    const isIconOnly = props.isIconOnly ?? false;
    const size: ButtonSize = isLegacySize
      ? mapLegacySize((sizeProp as LegacySize) ?? "default", isIconOnly)
      : ((sizeProp as ButtonSize) ?? (isIconOnly ? "icon-m" : "m"));

    const asChild = props.asChild ?? false;
    const Comp = asChild ? Slot : "button";

    const cloneIcon = (icon: React.ReactElement): React.ReactElement =>
      React.cloneElement(icon, {
        className: cn((icon.props as { className?: string })?.className),
      } as Record<string, unknown>);

    const leftIconElement = iconLeft ? cloneIcon(iconLeft) : null;
    const rightIconElement = iconRight ? cloneIcon(iconRight) : null;

    const buttonClasses = cn(
      getButtonClasses(
        variant,
        styleVariant,
        size,
        isLoading,
        !!disabled,
        !!children,
        shape,
        noWrap,
        width,
        variant === "link" ? linkPadding : false
      ),
      className
    );

    return (
      <Comp
        {...htmlProps}
        className={buttonClasses}
        ref={ref}
        disabled={disabled || isLoading}
        type={type}
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" size={16} />
            {!isIconOnly && children}
          </>
        ) : (
          <>
            {leftIconElement}
            {!isIconOnly && children}
            {rightIconElement}
          </>
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button };
