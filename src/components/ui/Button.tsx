"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "./Spinner";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, fullWidth, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
          // Variants
          variant === "primary" && "bg-gold text-navy-deep hover:bg-gold-soft active:scale-[0.98]",
          variant === "secondary" && "bg-navy text-white hover:bg-navy-royal active:scale-[0.98]",
          variant === "outline" && "border-2 border-navy text-navy hover:bg-navy hover:text-white active:scale-[0.98]",
          variant === "ghost" && "text-navy hover:bg-navy/10 active:scale-[0.98]",
          variant === "danger" && "bg-alert-red text-white hover:bg-red-700 active:scale-[0.98]",
          // Sizes
          size === "sm" && "px-3 py-1.5 text-sm",
          size === "md" && "px-5 py-2.5 text-sm",
          size === "lg" && "px-7 py-3.5 text-base",
          // Width
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {loading && <Spinner size="sm" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
