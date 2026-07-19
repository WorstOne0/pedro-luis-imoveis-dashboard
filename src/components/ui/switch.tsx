"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Toggle switch. Built on a plain button rather than pulling in
 * @radix-ui/react-switch — role="switch" plus aria-checked is the whole
 * accessibility contract, and buttons already handle keyboard activation.
 */
const Switch = React.forwardRef<
  HTMLButtonElement,
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> & {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
  }
>(({ className, checked, onCheckedChange, disabled, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    role="switch"
    aria-checked={checked}
    disabled={disabled}
    onClick={() => onCheckedChange(!checked)}
    className={cn(
      "inline-flex h-[2.8rem] w-[5rem] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      checked ? "bg-primary" : "bg-gray-300 dark:bg-gray-600",
      className
    )}
    {...props}
  >
    <span
      className={cn(
        "pointer-events-none block h-[2.2rem] w-[2.2rem] rounded-full bg-white shadow-lg ring-0 transition-transform",
        checked ? "translate-x-[2.2rem]" : "translate-x-[0.2rem]"
      )}
    />
  </button>
));

Switch.displayName = "Switch";
export { Switch };
